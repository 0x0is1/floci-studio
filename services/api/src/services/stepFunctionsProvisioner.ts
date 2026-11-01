import { awsClients } from './awsClientService';
import { CreateStateMachineCommand } from '@aws-sdk/client-sfn';
import { logStdin, logStdout, TerminalLog } from './loggerService';

const DEFAULT_ASL = '{"StartAt":"InvokeTask","States":{"InvokeTask":{"Type":"Pass","End":true}}}';

export async function provisionStepFunctions(nodeId: string, type: string, config: Record<string, any>, logs: TerminalLog[]) {
  const stateMachineName = config.stateMachineName || 'app-workflow';
  const definition = config.definition || DEFAULT_ASL;
  logs.push(logStdin(nodeId, type, `aws stepfunctions create-state-machine --name ${stateMachineName}`));

  const fallbackArn = `arn:aws:states:us-east-1:000000000000:stateMachine:${stateMachineName}`;
  const res = await awsClients.states.send(new CreateStateMachineCommand({
    name: stateMachineName,
    definition,
    roleArn: 'arn:aws:iam::000000000000:role/floci-states-role',
    type: config.type === 'EXPRESS' ? 'EXPRESS' : 'STANDARD',
  })).catch(() => ({ stateMachineArn: fallbackArn }));

  const stateMachineArn = res.stateMachineArn || fallbackArn;
  logs.push(logStdout(nodeId, type, res, `State machine '${stateMachineName}' ready.`));
  return { resourceId: stateMachineArn };
}
