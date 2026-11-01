import { EdgeData, TEST_TYPES, isCompute } from './types';

/** Resource dependencies a compute node calls out to (its BOTTOM handle). */
const COMPUTE_RESOURCE_RULES: Record<string, EdgeData> = {
  s3: { iamPolicy: 's3:PutObject,s3:GetObject', envVarName: 'S3_BUCKET_NAME', isConfigured: true },
  rds: { protocol: 'TCP', port: 5432, envVarName: 'DATABASE_URL', isConfigured: true },
  dynamodb: { iamPolicy: 'dynamodb:GetItem,dynamodb:PutItem', envVarName: 'DYNAMODB_TABLE', isConfigured: true },
  elasticache: { protocol: 'Redis', port: 6379, envVarName: 'REDIS_URL', isConfigured: true },
  sqs: { iamPolicy: 'sqs:SendMessage,sqs:ReceiveMessage', envVarName: 'QUEUE_URL', isConfigured: true },
  sns: { iamPolicy: 'sns:Publish', envVarName: 'SNS_TOPIC_ARN', isConfigured: true },
  secretsmanager: { iamPolicy: 'secretsmanager:GetSecretValue', envVarName: 'SECRET_ID', isConfigured: true },
  kms: { iamPolicy: 'kms:Decrypt,kms:GenerateDataKey', envVarName: 'KMS_KEY_ID', isConfigured: true },
  bedrock: { iamPolicy: 'bedrock:InvokeModel', envVarName: 'MODEL_ID', isConfigured: true },
  logs: { iamPolicy: 'logs:PutLogEvents', envVarName: 'LOG_GROUP_NAME', isConfigured: true },
  kinesis: { iamPolicy: 'kinesis:PutRecord', envVarName: 'STREAM_NAME', isConfigured: true },
  states: { iamPolicy: 'states:StartExecution', envVarName: 'STATE_MACHINE_ARN', isConfigured: true },
  efs: { protocol: 'NFS', port: 2049, envVarName: 'EFS_FS_ID', isConfigured: true },
};

/** Things that call INTO a compute node (its TOP handle). */
const COMPUTE_INGRESS_SOURCES: Record<string, EdgeData> = {
  alb: { protocol: 'HTTP Target Group', port: 80, isConfigured: true },
  apigateway: { protocol: 'API Gateway Integration', isConfigured: true },
  cloudfront: { protocol: 'HTTP Custom Origin', port: 8080, isConfigured: true },
  route53: { protocol: 'DNS Routing Record', isConfigured: true },
  client: { protocol: 'Direct Client Call', isConfigured: true },
  sqs: { protocol: 'SQS Poller / Trigger', isConfigured: true },
  sns: { protocol: 'SNS Subscription', isConfigured: true },
  events: { protocol: 'EventBridge Target', isConfigured: true },
  states: { protocol: 'Workflow Task Execution', isConfigured: true },
  kinesis: { protocol: 'Kinesis Stream Consumer', isConfigured: true },
  iam: { protocol: 'IAM Execution Role Attachment', isConfigured: true },
};

export function computeRule(source: string, target: string): EdgeData | undefined {
  if (isCompute(source)) {
    if (COMPUTE_RESOURCE_RULES[target]) return COMPUTE_RESOURCE_RULES[target];
    if (isCompute(target)) return { protocol: 'Direct Invocation', isConfigured: true };
    if ((TEST_TYPES as readonly string[]).includes(target)) return { protocol: 'Test Target', isConfigured: true };
  }
  if (COMPUTE_INGRESS_SOURCES[source] && isCompute(target)) return COMPUTE_INGRESS_SOURCES[source];
  return undefined;
}
