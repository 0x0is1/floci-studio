/** Env var builders for the resource types envResolver.ts doesn't have dedicated URL builders for. */

const ACCOUNT = '000000000000';
const REGION = 'us-east-1';

export function resourceFallbackValue(sType: string, cfg: Record<string, any> = {}): string {
  switch (sType) {
    case 'elasticache': return cfg.clusterName || 'app-cache';
    case 'secretsmanager': return cfg.secretName || 'app-secret';
    case 'kms': return cfg.keyAlias || 'alias/app-key';
    case 'logs': return cfg.logGroupName || '/floci/app';
    case 'kinesis': return cfg.streamName || 'app-stream';
    case 'states': return cfg.stateMachineName || 'app-workflow';
    case 'efs': return cfg.fileSystemName || 'app-efs';
    default: return '';
  }
}

export function applyExtraEnvVars(
  env: Record<string, string>,
  sType: string,
  val: string,
  cfg: Record<string, any> = {}
): void {
  if (sType === 'elasticache') {
    const engine = cfg.engine || 'redis';
    const port = cfg.port || (engine === 'memcached' ? 11211 : 6379);
    const host = cfg.endpoint || cfg.host || 'localhost';
    env.REDIS_URL = `${engine === 'memcached' ? 'memcached' : 'redis'}://${host}:${port}`;
    env.ELASTICACHE_ENDPOINT = host;
    env.ELASTICACHE_PORT = String(port);
  } else if (sType === 'secretsmanager') {
    env.SECRET_ID = val;
    env.SECRET_NAME = val;
    env.SECRET_ARN = `arn:aws:secretsmanager:${REGION}:${ACCOUNT}:secret:${val}`;
  } else if (sType === 'kms') {
    env.KMS_KEY_ID = val;
    env.KMS_KEY_ARN = `arn:aws:kms:${REGION}:${ACCOUNT}:key/${val}`;
  } else if (sType === 'logs') {
    env.LOG_GROUP_NAME = val;
    env.LOG_GROUP_ARN = `arn:aws:logs:${REGION}:${ACCOUNT}:log-group:${val}`;
  } else if (sType === 'kinesis') {
    env.STREAM_NAME = val;
    env.STREAM_ARN = `arn:aws:kinesis:${REGION}:${ACCOUNT}:stream/${val}`;
  } else if (sType === 'states') {
    env.STATE_MACHINE_ARN = `arn:aws:states:${REGION}:${ACCOUNT}:stateMachine:${val}`;
  } else if (sType === 'efs') {
    env.EFS_FS_ID = val;
    env.EFS_MOUNT_TARGET = `${val}.efs.${REGION}.amazonaws.com`;
  }
}
