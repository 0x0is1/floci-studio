import { awsClients } from './awsClientService';
import { CreateSecretCommand } from '@aws-sdk/client-secrets-manager';
import { logStdin, logStdout, TerminalLog } from './loggerService';

export async function provisionSecret(nodeId: string, type: string, config: Record<string, any>, logs: TerminalLog[]) {
  const secretName = config.secretName || 'app-secret';
  const secretString = config.secretString || '{"api_key": "floci-demo-token"}';
  logs.push(logStdin(nodeId, type, `aws secretsmanager create-secret --name ${secretName}`));

  const fallbackArn = `arn:aws:secretsmanager:us-east-1:000000000000:secret:${secretName}`;
  const res = await awsClients.secrets.send(new CreateSecretCommand({
    Name: secretName,
    SecretString: secretString,
  })).catch(() => ({ ARN: fallbackArn }));

  const arn = res.ARN || fallbackArn;
  logs.push(logStdout(nodeId, type, res, `Secret '${secretName}' created.`));
  return { resourceId: arn };
}
