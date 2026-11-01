import { awsClients } from './awsClientService';
import { CreateStreamCommand, IncreaseStreamRetentionPeriodCommand } from '@aws-sdk/client-kinesis';
import { logStdin, logStdout, TerminalLog } from './loggerService';

export async function provisionKinesis(nodeId: string, type: string, config: Record<string, any>, logs: TerminalLog[]) {
  const streamName = config.streamName || 'app-stream';
  const shardCount = Number(config.shardCount) || 1;
  logs.push(logStdin(nodeId, type, `aws kinesis create-stream --stream-name ${streamName} --shard-count ${shardCount}`));

  const res = await awsClients.kinesis.send(new CreateStreamCommand({ StreamName: streamName, ShardCount: shardCount })).catch(() => ({}));
  const retentionHours = Number(config.retentionHours ?? 24);
  if (retentionHours > 24) {
    await awsClients.kinesis.send(new IncreaseStreamRetentionPeriodCommand({ StreamName: streamName, RetentionPeriodHours: retentionHours })).catch(() => {});
  }

  logs.push(logStdout(nodeId, type, res, `Kinesis stream '${streamName}' ready (${shardCount} shards).`));
  return { resourceId: streamName };
}
