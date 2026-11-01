export type AwsServiceCategory =
  | 'client'
  | 'compute'
  | 'storage'
  | 'database'
  | 'networking'
  | 'messaging'
  | 'security'
  | 'analytics';

export type AwsServiceType = string;

export interface AwsPaletteItem {
  type: AwsServiceType;
  category: AwsServiceCategory;
  name: string;
  description: string;
  flociStatus: 'ready' | 'beta' | 'alpha';
  defaultConfig: Record<string, any>;
}

export type NodeExecutionStatus = 'draft' | 'deploying' | 'running' | 'error';

export interface AwsNodeData extends Record<string, unknown> {
  serviceType: AwsServiceType;
  label: string;
  status: NodeExecutionStatus;
  config: Record<string, any>;
  liveUrl?: string;
  resourceId?: string;
  errorMessage?: string;
}

export interface AwsEdgeData extends Record<string, unknown> {
  protocol?: string;
  port?: number;
  iamPolicy?: string;
  envVarName?: string;
  isConfigured: boolean;
}

export type LogType = 'stdin' | 'stdout' | 'info' | 'success' | 'warn' | 'error';
export type LogSource = 'aws-sdk' | 'docker' | 'system' | 'runtime';

export interface TerminalLog {
  id: string;
  timestamp: string;
  source: LogSource;
  type: LogType;
  nodeId: string;
  serviceType: string;
  command?: string;
  message: string;
  rawOutput?: string;
}
