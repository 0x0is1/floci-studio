import { AwsPaletteItem } from '@/types/aws';

export const ANALYTICS_PALETTE_ITEMS: AwsPaletteItem[] = [
  {
    type: 'logs',
    category: 'analytics',
    name: 'CloudWatch Logs',
    description: 'Centralized log stream monitoring and telemetry storage',
    flociStatus: 'ready',
    defaultConfig: { logGroupName: '/aws/app-logs', retentionInDays: 14 },
  },
  {
    type: 'bedrock',
    category: 'analytics',
    name: 'Amazon Bedrock AI',
    description: 'Serverless LLM foundation models for generative AI inference',
    flociStatus: 'ready',
    defaultConfig: { modelId: 'anthropic.claude-3-sonnet', temperature: 0.7, maxTokens: 2048 },
  },
];
