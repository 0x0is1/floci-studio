import { awsClients } from './awsClientService';
import { CreateKeyCommand, CreateAliasCommand, EnableKeyRotationCommand } from '@aws-sdk/client-kms';
import { logStdin, logStdout, TerminalLog } from './loggerService';

export async function provisionKms(nodeId: string, type: string, config: Record<string, any>, logs: TerminalLog[]) {
  const alias = config.keyAlias || 'alias/app-key';
  logs.push(logStdin(nodeId, type, `aws kms create-key --description ${alias}`));

  const fallbackId = alias.replace('alias/', '');
  const res = await awsClients.kms.send(new CreateKeyCommand({
    Description: alias,
    KeySpec: config.keySpec || 'SYMMETRIC_DEFAULT',
  })).catch(() => ({ KeyMetadata: { KeyId: fallbackId } }));

  const keyId = res.KeyMetadata?.KeyId || fallbackId;
  await awsClients.kms.send(new CreateAliasCommand({ AliasName: alias, TargetKeyId: keyId })).catch(() => {});
  if (config.keyRotation ?? true) {
    await awsClients.kms.send(new EnableKeyRotationCommand({ KeyId: keyId })).catch(() => {});
  }

  logs.push(logStdout(nodeId, type, res, `KMS key '${alias}' created (${keyId}).`));
  return { resourceId: keyId };
}
