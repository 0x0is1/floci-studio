import { awsClients } from './awsClientService';
import { CreateEventBusCommand, PutRuleCommand } from '@aws-sdk/client-eventbridge';
import { logStdin, logStdout, TerminalLog } from './loggerService';

export async function provisionEventBridge(nodeId: string, type: string, config: Record<string, any>, logs: TerminalLog[]) {
  const busName = config.busName || 'default-bus';
  logs.push(logStdin(nodeId, type, `aws events create-event-bus --name ${busName}`));

  const res = await awsClients.eventbridge.send(new CreateEventBusCommand({ Name: busName })).catch(() => ({}));
  if (config.rulePattern) {
    await awsClients.eventbridge.send(new PutRuleCommand({
      Name: `${busName}-rule`,
      EventBusName: busName,
      EventPattern: JSON.stringify({ source: [config.rulePattern] }),
    })).catch(() => {});
  }

  logs.push(logStdout(nodeId, type, res, `Event bus '${busName}' ready.`));
  return { resourceId: busName };
}
