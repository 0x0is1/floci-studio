import { describe, it, expect } from 'bun:test';
import { normalizeFlociEndpoint, buildSqsUrls, buildS3Urls } from '../src/services/urlResolver';
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

