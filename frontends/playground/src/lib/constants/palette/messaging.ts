import { AwsPaletteItem } from '@/types/aws';

export const MESSAGING_PALETTE_ITEMS: AwsPaletteItem[] = [
  {
    type: 'sqs',
    category: 'messaging',
    name: 'SQS Queue',
    description: 'Decoupled asynchronous message queue with retry and DLQ',
    flociStatus: 'ready',
    defaultConfig: { queueName: 'app-queue', queueType: 'standard', visibilityTimeout: 30, messageRetentionDays: 4 },
  },
  {
    type: 'sns',
    category: 'messaging',
    name: 'SNS Topic',
    description: 'High-throughput publish/subscribe pub/sub messaging topic',
    flociStatus: 'ready',
    defaultConfig: { topicName: 'app-topic', topicType: 'standard' },
  },
  {
    type: 'events',
    category: 'messaging',
    name: 'EventBridge Bus',
    description: 'Serverless event bus routing custom events to subscribers',
    flociStatus: 'ready',
    defaultConfig: { busName: 'default-bus', rulePattern: 'custom.events' },
  },
  {
    type: 'states',
    category: 'messaging',
    name: 'Step Functions',
    description: 'Visual workflow state machine orchestrating serverless tasks',
    flociStatus: 'ready',
    defaultConfig: { stateMachineName: 'order-workflow', type: 'STANDARD' },
  },
  {
    type: 'kinesis',
    category: 'messaging',
    name: 'Kinesis Stream',
    description: 'Real-time streaming ingestion at scale for metrics and clickstreams',
    flociStatus: 'ready',
    defaultConfig: { streamName: 'analytics-stream', shardCount: 1, retentionHours: 24 },
  },
];
