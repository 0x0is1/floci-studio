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

export function createTerminalLog(params: {
  nodeId: string;
  serviceType: string;
  type: LogType;
  source?: LogSource;
  command?: string;
  message: string;
  rawOutput?: any;
}): TerminalLog {
  const d = new Date();
  const time = d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0');
  const rawStr = params.rawOutput
    ? typeof params.rawOutput === 'string'
      ? params.rawOutput
      : JSON.stringify(params.rawOutput, null, 2)
    : undefined;

  return {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: time,
    source: params.source || 'system',
    type: params.type,
    nodeId: params.nodeId,
    serviceType: params.serviceType,
    command: params.command,
    message: params.message,
    rawOutput: rawStr,
  };
}

export function createLog(
  nodeId: string,
  serviceType: string,
  type: LogType,
  message: string,
  source: LogSource = 'system',
  rawOutput?: any,
  command?: string
): TerminalLog {
  return createTerminalLog({ nodeId, serviceType, type, message, source, rawOutput, command });
}

export function logStdin(nodeId: string, serviceType: string, command: string, source: LogSource = 'aws-sdk'): TerminalLog {
  return createTerminalLog({
    nodeId,
    serviceType,
    type: 'stdin',
    source,
    command,
    message: `$ ${command}`,
  });
}

export function logStdout(nodeId: string, serviceType: string, rawOutput: any, message: string, source: LogSource = 'aws-sdk'): TerminalLog {
  return createTerminalLog({
    nodeId,
    serviceType,
    type: 'stdout',
    source,
    message,
    rawOutput,
  });
}
