import { EdgeData, isCompute } from './types';

export function messagingRule(source: string, target: string): EdgeData | undefined {
  if (source === 'sqs') {
    if (isCompute(target)) return { protocol: 'SQS Poller / Trigger', isConfigured: true };
    if (target === 'kms') return { protocol: 'KMS CMK Encryption', isConfigured: true };
  }
  if (source === 'sns') {
    if (target === 'sqs') return { protocol: 'SQS Fanout Subscription', isConfigured: true };
    if (isCompute(target)) return { protocol: 'SNS Subscription', isConfigured: true };
    if (target === 'kms') return { protocol: 'KMS SSE Encryption', isConfigured: true };
  }
  if (source === 'events' && (['sqs', 'sns', 'states', 'kinesis', 'logs'].includes(target) || isCompute(target))) {
    return { protocol: 'EventBridge Target', isConfigured: true };
  }
  if (source === 'states' && (['sqs', 'sns', 'dynamodb', 'events', 'logs'].includes(target) || isCompute(target))) {
    return { protocol: 'Workflow Task Execution', isConfigured: true };
  }
  if (source === 'kinesis') {
    if (target === 's3') return { protocol: 'Kinesis Firehose S3 Delivery', isConfigured: true };
    if (target === 'kms') return { protocol: 'KMS Stream Encryption', isConfigured: true };
    if (isCompute(target)) return { protocol: 'Kinesis Stream Consumer', isConfigured: true };
  }
  return undefined;
}
