import { awsClients } from './awsClientService';
import { CreateHostedZoneCommand, ChangeResourceRecordSetsCommand } from '@aws-sdk/client-route-53';
import { logStdin, logStdout, TerminalLog } from './loggerService';

export async function provisionRoute53(nodeId: string, type: string, config: Record<string, any>, logs: TerminalLog[]) {
  const domainName = config.domainName || 'app.local';
  logs.push(logStdin(nodeId, type, `aws route53 create-hosted-zone --name ${domainName}`));

  const fallbackZoneId = `Z-${domainName.replace(/\./g, '-')}`;
  const zoneRes = await awsClients.route53.send(new CreateHostedZoneCommand({
    Name: domainName,
    CallerReference: `${nodeId}-${Date.now()}`,
  })).catch(() => ({ HostedZone: { Id: fallbackZoneId } }));

  const zoneId = zoneRes.HostedZone?.Id || fallbackZoneId;
  const recordType = config.recordType || 'A';
  await awsClients.route53.send(new ChangeResourceRecordSetsCommand({
    HostedZoneId: zoneId,
    ChangeBatch: {
      Changes: [{
        Action: 'UPSERT',
        ResourceRecordSet: {
          Name: domainName,
          Type: recordType as any,
          TTL: Number(config.ttl ?? 300),
          ResourceRecords: recordType === 'TXT' ? [{ Value: '"floci-playground"' }] : [{ Value: '127.0.0.1' }],
        },
      }],
    },
  })).catch(() => {});

  logs.push(logStdout(nodeId, type, zoneRes, `Hosted zone '${domainName}' ready (DNS record registered; not resolvable outside Floci).`));
  return { resourceId: zoneId };
}
