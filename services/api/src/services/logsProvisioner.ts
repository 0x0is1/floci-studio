import { awsClients } from './awsClientService';
import { CreateLogGroupCommand, PutRetentionPolicyCommand } from '@aws-sdk/client-cloudwatch-logs';
import { logStdin, logStdout, TerminalLog } from './loggerService';

export async function provisionLogs(nodeId: string, type: string, config: Record<string, any>, logs: TerminalLog[]) {
  const logGroupName = config.logGroupName || '/floci/app';
  logs.push(logStdin(nodeId, type, `aws logs create-log-group --log-group-name ${logGroupName}`));

  const res = await awsClients.logs.send(new CreateLogGroupCommand({ logGroupName })).catch(() => ({}));
  const retentionDays = Number(config.retentionDays ?? 14);
  if (retentionDays > 0) {
    await awsClients.logs.send(new PutRetentionPolicyCommand({ logGroupName, retentionInDays: retentionDays })).catch(() => {});
  }

  logs.push(logStdout(nodeId, type, res, `Log group '${logGroupName}' ready.`));
  return { resourceId: logGroupName };
}
