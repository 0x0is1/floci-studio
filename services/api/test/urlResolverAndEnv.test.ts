import { describe, it, expect } from 'bun:test';
import { normalizeFlociEndpoint, buildSqsUrls, buildS3Urls, buildRdsUrls } from '../src/services/urlResolver';
import { resolveInjectedEnvVars } from '../src/services/envResolver';

describe('URL Normalization & Environment Injection', () => {
  it('normalizes internal floci container urls to localhost', () => {
    const raw = 'http://floci:4566/000000000000/app-queue';
    const clean = normalizeFlociEndpoint(raw);
    expect(clean).toBe('http://localhost:4566/000000000000/app-queue');
    expect(clean.includes('floci:4566')).toBe(false);
  });

  it('preserves production AWS URLs untouched', () => {
    const prodSqs = 'https://sqs.us-east-1.amazonaws.com/123456789012/prod-queue';
    expect(normalizeFlociEndpoint(prodSqs)).toBe(prodSqs);

    const prodS3 = 'https://my-bucket.s3.amazonaws.com';
    expect(normalizeFlociEndpoint(prodS3)).toBe(prodS3);
  });

  it('builds clean SQS and S3 URLs with localhost default', () => {
    const sqs = buildSqsUrls('app-queue', 'http://floci:4566');
    expect(sqs.url).toBe('http://localhost:4566/000000000000/app-queue');
    expect(sqs.name).toBe('app-queue');

    const s3 = buildS3Urls('app-bucket', 'http://floci:4566');
    expect(s3.url).toBe('http://localhost:4566/app-bucket');
    expect(s3.name).toBe('app-bucket');
  });

  it('resolves injected environment variables for EC2 without internal floci aliases', () => {
    const nodes = [
      { id: 'ec2-1', data: { serviceType: 'ec2', config: { port: 8080 } } },
      { id: 'sqs-1', data: { serviceType: 'sqs', config: { queueName: 'app-queue' } } },
      { id: 's3-1', data: { serviceType: 's3', config: { bucketName: 'app-bucket' } } },
    ];
    const edges = [
      { source: 'ec2-1', target: 'sqs-1' },
      { source: 'ec2-1', target: 's3-1' },
    ];
    const resMap = {
      'sqs-1': 'http://floci:4566/000000000000/app-queue',
      's3-1': 'app-bucket',
    };

    const env = resolveInjectedEnvVars('ec2-1', edges, resMap, nodes as any);

    expect(env.QUEUE_URL).toBe('http://localhost:4566/000000000000/app-queue');
    expect(env.SQS_QUEUE_URL).toBe('http://localhost:4566/000000000000/app-queue');
    expect(env.S3_BUCKET_NAME).toBe('app-bucket');
    expect(env.S3_BUCKET_URL).toBe('http://localhost:4566/app-bucket');
    expect(env.AWS_ENDPOINT_URL).toBe('http://localhost:4566');

    for (const val of Object.values(env)) {
      expect(val.includes('http://floci')).toBe(false);
    }
  });
});

describe('Extended resource type env injection', () => {
  const makeEnv = (peerType: string, config: Record<string, any> = {}) => {
    const nodes = [
      { id: 'ec2-1', data: { serviceType: 'ec2', config: { port: 8080 } } },
      { id: 'peer-1', data: { serviceType: peerType, config } },
    ];
    const edges = [{ source: 'ec2-1', target: 'peer-1' }];
    return resolveInjectedEnvVars('ec2-1', edges, {}, nodes as any);
  };

  it('injects elasticache REDIS_URL from engine/port/endpoint config', () => {
    const env = makeEnv('elasticache', { engine: 'redis', port: 6379, endpoint: 'cache-1' });
    expect(env.REDIS_URL).toBe('redis://cache-1:6379');
    expect(env.ELASTICACHE_ENDPOINT).toBe('cache-1');
    expect(env.ELASTICACHE_PORT).toBe('6379');
  });

  it('injects secretsmanager vars under the correct SECRET_* keys (not the dead secrets branch)', () => {
    const env = makeEnv('secretsmanager', { secretName: 'db-creds' });
    expect(env.SECRET_ID).toBe('db-creds');
    expect(env.SECRET_NAME).toBe('db-creds');
    expect(env.SECRET_ARN).toBe('arn:aws:secretsmanager:us-east-1:000000000000:secret:db-creds');
  });

  it('injects kms key id and arn', () => {
    const env = makeEnv('kms', { keyAlias: 'alias/app-key' });
    expect(env.KMS_KEY_ID).toBe('alias/app-key');
    expect(env.KMS_KEY_ARN).toBe('arn:aws:kms:us-east-1:000000000000:key/alias/app-key');
  });

  it('injects log group name and arn', () => {
    const env = makeEnv('logs', { logGroupName: '/floci/app' });
    expect(env.LOG_GROUP_NAME).toBe('/floci/app');
    expect(env.LOG_GROUP_ARN).toBe('arn:aws:logs:us-east-1:000000000000:log-group:/floci/app');
  });

  it('injects kinesis stream name and arn', () => {
    const env = makeEnv('kinesis', { streamName: 'app-stream' });
    expect(env.STREAM_NAME).toBe('app-stream');
    expect(env.STREAM_ARN).toBe('arn:aws:kinesis:us-east-1:000000000000:stream/app-stream');
  });

  it('injects state machine arn', () => {
    const env = makeEnv('states', { stateMachineName: 'app-workflow' });
    expect(env.STATE_MACHINE_ARN).toBe('arn:aws:states:us-east-1:000000000000:stateMachine:app-workflow');
  });

  it('injects efs filesystem id and mount target', () => {
    const env = makeEnv('efs', { fileSystemName: 'app-efs' });
    expect(env.EFS_FS_ID).toBe('app-efs');
    expect(env.EFS_MOUNT_TARGET).toBe('app-efs.efs.us-east-1.amazonaws.com');
  });

  it('injects sns topic arn fallback from topicName when unresolved', () => {
    const env = makeEnv('sns', { topicName: 'app-topic' });
    expect(env.SNS_TOPIC_ARN).toBe('app-topic');
  });

  it('resolves mariadb engine to the mysql wire protocol and port 3306, not postgres', () => {
    const rds = buildRdsUrls('appdb', { engine: 'mariadb-10' });
    expect(rds.databaseUrl.startsWith('mysql://')).toBe(true);
    expect(rds.port).toBe('3306');
  });

  it('resolves postgres-16 engine to the postgres protocol and port 5432', () => {
    const rds = buildRdsUrls('appdb', { engine: 'postgres-16' });
    expect(rds.databaseUrl.startsWith('postgres://')).toBe(true);
    expect(rds.port).toBe('5432');
  });

  it('applies defaults for every extended type when no config is given', () => {
    expect(makeEnv('elasticache').REDIS_URL).toBe('redis://localhost:6379');
    expect(makeEnv('secretsmanager').SECRET_NAME).toBe('app-secret');
    expect(makeEnv('kms').KMS_KEY_ID).toBe('alias/app-key');
    expect(makeEnv('logs').LOG_GROUP_NAME).toBe('/floci/app');
    expect(makeEnv('kinesis').STREAM_NAME).toBe('app-stream');
    expect(makeEnv('states').STATE_MACHINE_ARN).toContain('app-workflow');
    expect(makeEnv('efs').EFS_FS_ID).toBe('app-efs');
  });
});

