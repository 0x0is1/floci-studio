import { AwsServiceType, AwsEdgeData } from '@/types/aws';

export function checkStorageDbRules(sourceType: AwsServiceType, targetType: AwsServiceType): { match: boolean; data?: AwsEdgeData } {
  if (sourceType === 's3') {
    if (['lambda', 'sqs', 'sns', 'events'].includes(targetType)) {
      return { match: true, data: { protocol: 'S3 Event Notifications', isConfigured: true } };
    }
    if (targetType === 'kms') return { match: true, data: { protocol: 'SSE-KMS Encryption', isConfigured: true } };
    if (targetType === 'logs') return { match: true, data: { protocol: 'S3 Server Access Logging', isConfigured: true } };
  }

  if (sourceType === 'dynamodb') {
    if (['lambda', 'kinesis', 'events'].includes(targetType)) {
      return { match: true, data: { protocol: 'DynamoDB Streams', isConfigured: true } };
    }
    if (targetType === 'kms') return { match: true, data: { protocol: 'KMS CMK Encryption', isConfigured: true } };
  }

  if (sourceType === 'rds') {
    if (targetType === 'secretsmanager') return { match: true, data: { protocol: 'Secrets Rotation Integration', isConfigured: true } };
    if (targetType === 'kms') return { match: true, data: { protocol: 'KMS Storage Encryption', isConfigured: true } };
    if (targetType === 'logs') return { match: true, data: { protocol: 'RDS Database Log Export', isConfigured: true } };
  }

  if (sourceType === 'elasticache') {
    if (targetType === 'kms') return { match: true, data: { protocol: 'KMS At-Rest Encryption', isConfigured: true } };
    if (targetType === 'logs') return { match: true, data: { protocol: 'Redis Slow Log Delivery', isConfigured: true } };
  }

  if (sourceType === 'iam' && ['ec2', 'lambda', 'ecs', 'states'].includes(targetType)) {
    return { match: true, data: { protocol: 'IAM Execution Role Attachment', isConfigured: true } };
  }

  if (sourceType === 'secretsmanager' && targetType === 'kms') {
    return { match: true, data: { protocol: 'KMS Secret Encryption Key', isConfigured: true } };
  }

  return { match: false };
}
