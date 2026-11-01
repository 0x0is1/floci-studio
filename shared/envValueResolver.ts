/**
 * Single source of truth for the human-readable "resolved value" shown for an
 * injected env var in the inspector sidebar. Mirrors the real value shapes
 * `services/api/src/services/envResolver.ts` + `extraResourceEnvBuilders.ts`
 * actually inject at deploy time, so the sidebar can never show something the
 * backend wouldn't produce.
 */

const ACCOUNT = '000000000000';
const REGION = 'us-east-1';

export interface ResolvableNode {
  data?: { serviceType?: string; config?: Record<string, any>; label?: string };
}

export function resolveDisplayValue(node: ResolvableNode | undefined, endpoint = 'http://localhost:4566'): string {
  if (!node) return 'configured';
  const type = node.data?.serviceType;
  const cfg = node.data?.config || {};

  switch (type) {
    case 'sqs': return `${endpoint}/${ACCOUNT}/${cfg.queueName || 'app-queue'}`;
    case 's3': return `${endpoint}/${cfg.bucketName || 'app-bucket'}`;
    case 'rds': {
      const user = cfg.username || cfg.user || 'postgres';
      const pass = cfg.password || 'floci123';
      const port = cfg.port || 5432;
      const db = cfg.databaseName || cfg.dbName || 'postgres';
      return `postgresql://${user}:${pass}@localhost:${port}/${db}`;
    }
    case 'dynamodb': return `${endpoint}/tables/${cfg.tableName || 'app-table'}`;
    case 'bedrock': return `${endpoint}/bedrock`;
    case 'sns': return `arn:aws:sns:${REGION}:${ACCOUNT}:${cfg.topicName || 'app-topic'}`;
    case 'secretsmanager': return `arn:aws:secretsmanager:${REGION}:${ACCOUNT}:secret:${cfg.secretName || 'app-secret'}`;
    case 'kms': return `arn:aws:kms:${REGION}:${ACCOUNT}:key/${cfg.keyAlias || 'alias/app-key'}`;
    case 'logs': return `arn:aws:logs:${REGION}:${ACCOUNT}:log-group:${cfg.logGroupName || '/floci/app'}`;
    case 'kinesis': return `arn:aws:kinesis:${REGION}:${ACCOUNT}:stream/${cfg.streamName || 'app-stream'}`;
    case 'states': return `arn:aws:states:${REGION}:${ACCOUNT}:stateMachine:${cfg.stateMachineName || 'app-workflow'}`;
    case 'efs': return `${cfg.fileSystemName || 'app-efs'}.efs.${REGION}.amazonaws.com`;
    case 'elasticache': {
      const engine = cfg.engine || 'redis';
      const port = cfg.port || (engine === 'memcached' ? 11211 : 6379);
      const host = cfg.endpoint || cfg.host || 'localhost';
      return `${engine === 'memcached' ? 'memcached' : 'redis'}://${host}:${port}`;
    }
    default:
      return cfg.bucketName || cfg.queueName || cfg.tableName || cfg.dbName || cfg.topicName || cfg.modelId || cfg.functionName || node.data?.label || 'configured';
  }
}
