import fs from 'node:fs';
import path from 'node:path';
import { awsClients } from './awsClientService';
import { ListKeysCommand, DescribeKeyCommand, ScheduleKeyDeletionCommand } from '@aws-sdk/client-kms';
import { DescribeKeyPairsCommand, DeleteKeyPairCommand } from '@aws-sdk/client-ec2';
import { ListRolesCommand, ListRolePoliciesCommand, DeleteRolePolicyCommand, DeleteRoleCommand } from '@aws-sdk/client-iam';

export async function purgeKmsKeys(): Promise<void> {
  try {
    const res = await awsClients.kms.send(new ListKeysCommand({})).catch(() => ({ Keys: [] }));
    for (const k of res.Keys || []) {
      if (!k.KeyId) continue;
      const desc = await awsClients.kms.send(new DescribeKeyCommand({ KeyId: k.KeyId })).catch(() => null);
      if (desc?.KeyMetadata?.KeyManager === 'CUSTOMER') {
        await awsClients.kms.send(new ScheduleKeyDeletionCommand({ KeyId: k.KeyId, PendingWindowInDays: 7 })).catch(() => {});
      }
    }
  } catch {}
}

export async function purgeEc2KeyPairs(): Promise<void> {
  try {
    const res = await awsClients.ec2.send(new DescribeKeyPairsCommand({})).catch(() => ({ KeyPairs: [] }));
    for (const kp of res.KeyPairs || []) {
      if (kp.KeyName) await awsClients.ec2.send(new DeleteKeyPairCommand({ KeyName: kp.KeyName })).catch(() => {});
    }
  } catch {}
  try {
    const keysDir = path.resolve('services/data/keys');
    if (fs.existsSync(keysDir)) fs.rmSync(keysDir, { recursive: true, force: true });
  } catch {}
}

export async function purgeIamRoles(): Promise<void> {
  try {
    const res = await awsClients.iam.send(new ListRolesCommand({})).catch(() => ({ Roles: [] }));
    for (const r of res.Roles || []) {
      if (r.RoleName && !r.RoleName.startsWith('AWS') && !r.RoleName.startsWith('aws-')) {
        const pols = await awsClients.iam.send(new ListRolePoliciesCommand({ RoleName: r.RoleName })).catch(() => ({ PolicyNames: [] }));
        for (const p of pols.PolicyNames || []) {
          await awsClients.iam.send(new DeleteRolePolicyCommand({ RoleName: r.RoleName, PolicyName: p })).catch(() => {});
        }
        await awsClients.iam.send(new DeleteRoleCommand({ RoleName: r.RoleName })).catch(() => {});
      }
    }
  } catch {}
}

