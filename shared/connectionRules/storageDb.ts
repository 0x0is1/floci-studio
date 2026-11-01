import { EdgeData, isCompute } from './types';

export function storageDbRule(source: string, target: string): EdgeData | undefined {
  if (source === 's3') {
    if (['sqs', 'sns', 'events'].includes(target) || isCompute(target)) return { protocol: 'S3 Event Notifications', isConfigured: true };
    if (target === 'kms') return { protocol: 'SSE-KMS Encryption', isConfigured: true };
    if (target === 'logs') return { protocol: 'S3 Server Access Logging', isConfigured: true };
  }
  if (source === 'dynamodb') {
    if (['kinesis', 'events'].includes(target) || isCompute(target)) return { protocol: 'DynamoDB Streams', isConfigured: true };
    if (target === 'kms') return { protocol: 'KMS CMK Encryption', isConfigured: true };
  }
  if (source === 'rds') {
    if (target === 'secretsmanager') return { protocol: 'Secrets Rotation Integration', isConfigured: true };
    if (target === 'kms') return { protocol: 'KMS Storage Encryption', isConfigured: true };
    if (target === 'logs') return { protocol: 'RDS Database Log Export', isConfigured: true };
  }
  if (source === 'elasticache') {
    if (target === 'kms') return { protocol: 'KMS At-Rest Encryption', isConfigured: true };
    if (target === 'logs') return { protocol: 'Redis Slow Log Delivery', isConfigured: true };
  }
  if (source === 'iam' && (isCompute(target) || target === 'states')) {
    return { protocol: 'IAM Execution Role Attachment', isConfigured: true };
  }
  if (source === 'secretsmanager' && target === 'kms') {
    return { protocol: 'KMS Secret Encryption Key', isConfigured: true };
  }
  return undefined;
}
