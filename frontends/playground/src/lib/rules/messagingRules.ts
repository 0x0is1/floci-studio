import { AwsServiceType, AwsEdgeData } from '@/types/aws';

export function checkMessagingRules(sourceType: AwsServiceType, targetType: AwsServiceType): { match: boolean; data?: AwsEdgeData } {
  if (sourceType === 'sqs') {
    if (['lambda', 'ec2', 'ecs'].includes(targetType)) {
      return { match: true, data: { protocol: 'SQS Poller / Trigger', isConfigured: true } };
    }
    if (targetType === 'kms') {
      return { match: true, data: { protocol: 'KMS CMK Encryption', isConfigured: true } };
    }
  }

  if (sourceType === 'sns') {
    if (targetType === 'sqs') {
      return { match: true, data: { protocol: 'SQS Fanout Subscription', isConfigured: true } };
    }
    if (targetType === 'lambda') {
      return { match: true, data: { protocol: 'Lambda Subscription', isConfigured: true } };
    }
    if (targetType === 'kms') {
      return { match: true, data: { protocol: 'KMS SSE Encryption', isConfigured: true } };
    }
  }

  if (sourceType === 'events') {
    if (['lambda', 'sqs', 'sns', 'states', 'kinesis', 'logs'].includes(targetType)) {
      return { match: true, data: { protocol: 'EventBridge Target', isConfigured: true } };
    }
  }

  if (sourceType === 'states') {
    if (['lambda', 'sqs', 'sns', 'dynamodb', 'ecs', 'events', 'logs'].includes(targetType)) {
      return { match: true, data: { protocol: 'Workflow Task Execution', isConfigured: true } };
    }
  }

  if (sourceType === 'kinesis') {
    if (targetType === 'lambda') {
      return { match: true, data: { protocol: 'Kinesis Stream Consumer', isConfigured: true } };
    }
    if (targetType === 's3') {
      return { match: true, data: { protocol: 'Kinesis Firehose S3 Delivery', isConfigured: true } };
    }
    if (targetType === 'kms') {
      return { match: true, data: { protocol: 'KMS Stream Encryption', isConfigured: true } };
    }
  }

  return { match: false };
}
