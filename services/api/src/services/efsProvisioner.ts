import { awsClients } from './awsClientService';
import { CreateFileSystemCommand, PerformanceMode, ThroughputMode } from '@aws-sdk/client-efs';
import { logStdin, logStdout, TerminalLog } from './loggerService';

export async function provisionEfs(nodeId: string, type: string, config: Record<string, any>, logs: TerminalLog[]) {
  const name = config.fileSystemName || 'app-efs';
  logs.push(logStdin(nodeId, type, `aws efs create-file-system --performance-mode ${config.performanceMode || 'generalPurpose'}`));

  const fallbackId = `fs-${name}`;
  const res = await awsClients.efs.send(new CreateFileSystemCommand({
    CreationToken: `${name}-${nodeId}`,
    PerformanceMode: config.performanceMode === 'maxIO' ? PerformanceMode.MAX_IO : PerformanceMode.GENERAL_PURPOSE,
    ThroughputMode: config.throughputMode === 'provisioned' ? ThroughputMode.PROVISIONED : config.throughputMode === 'elastic' ? ThroughputMode.ELASTIC : ThroughputMode.BURSTING,
    Encrypted: config.encrypted ?? true,
    Tags: [{ Key: 'Name', Value: name }],
  })).catch(() => ({ FileSystemId: fallbackId }));

  const fileSystemId = res.FileSystemId || fallbackId;
  logs.push(logStdout(nodeId, type, res, `EFS file system '${name}' ready (${fileSystemId}).`));
  return { resourceId: fileSystemId };
}
