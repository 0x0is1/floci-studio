import { AwsServiceType, AwsEdgeData } from '@/types/aws';

export function checkComputeRules(sourceType: AwsServiceType, targetType: AwsServiceType): { match: boolean; data?: AwsEdgeData } {
  const isCompute = ['ec2', 'lambda', 'ecs'].includes(sourceType);
  if (!isCompute) return { match: false };

  if (targetType === 's3') {
    return { match: true, data: { iamPolicy: 's3:PutObject,s3:GetObject', envVarName: 'S3_BUCKET_NAME', isConfigured: true } };
  }
  if (targetType === 'rds') {
    return { match: true, data: { protocol: 'TCP', port: 5432, envVarName: 'DATABASE_URL', isConfigured: true } };
  }
  if (targetType === 'dynamodb') {
    return { match: true, data: { iamPolicy: 'dynamodb:GetItem,dynamodb:PutItem', envVarName: 'DYNAMODB_TABLE', isConfigured: true } };
  }
  if (targetType === 'elasticache') {
    return { match: true, data: { protocol: 'Redis', port: 6379, envVarName: 'REDIS_URL', isConfigured: true } };
  }
  if (targetType === 'sqs') {
    return { match: true, data: { iamPolicy: 'sqs:SendMessage,sqs:ReceiveMessage', envVarName: 'QUEUE_URL', isConfigured: true } };
  }
  if (targetType === 'sns') {
    return { match: true, data: { iamPolicy: 'sns:Publish', envVarName: 'TOPIC_ARN', isConfigured: true } };
  }
  if (targetType === 'secretsmanager') {
    return { match: true, data: { iamPolicy: 'secretsmanager:GetSecretValue', envVarName: 'SECRET_ID', isConfigured: true } };
  }
  if (targetType === 'kms') {
    return { match: true, data: { iamPolicy: 'kms:Decrypt,kms:GenerateDataKey', envVarName: 'KMS_KEY_ID', isConfigured: true } };
  }
  if (targetType === 'bedrock') {
    return { match: true, data: { iamPolicy: 'bedrock:InvokeModel', envVarName: 'MODEL_ID', isConfigured: true } };
  }
  if (targetType === 'logs') {
    return { match: true, data: { iamPolicy: 'logs:PutLogEvents', envVarName: 'LOG_GROUP_NAME', isConfigured: true } };
  }
  if (targetType === 'kinesis') {
    return { match: true, data: { iamPolicy: 'kinesis:PutRecord', envVarName: 'STREAM_NAME', isConfigured: true } };
  }
  if (targetType === 'states') {
    return { match: true, data: { iamPolicy: 'states:StartExecution', envVarName: 'STATE_MACHINE_ARN', isConfigured: true } };
  }
  if (targetType === 'efs') {
    return { match: true, data: { protocol: 'NFS', port: 2049, envVarName: 'EFS_FS_ID', isConfigured: true } };
  }
  if (targetType === 'lambda' && sourceType !== 'lambda') {
    return { match: true, data: { iamPolicy: 'lambda:InvokeFunction', envVarName: 'FUNCTION_NAME', isConfigured: true } };
  }

  return { match: false };
}
