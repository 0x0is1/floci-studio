import { dockerReq } from './dockerService';
import { awsClients } from './awsClientService';
import { projectService } from './projectService';
import { ListBucketsCommand } from '@aws-sdk/client-s3';
import { ListQueuesCommand } from '@aws-sdk/client-sqs';
import { ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { DescribeDBInstancesCommand } from '@aws-sdk/client-rds';
import { ListFunctionsCommand } from '@aws-sdk/client-lambda';
import { ListTopicsCommand } from '@aws-sdk/client-sns';
import { ListSecretsCommand } from '@aws-sdk/client-secrets-manager';
import { ListKeysCommand, DescribeKeyCommand } from '@aws-sdk/client-kms';
import { DescribeLogGroupsCommand } from '@aws-sdk/client-cloudwatch-logs';
import { ListEventBusesCommand } from '@aws-sdk/client-eventbridge';

export async function getRuntimeState(projectId?: string) {
  const list = await dockerReq('GET', '/containers/json');
  const runningPorts: number[] = [];
  const projectContainers: Array<{ projectId: string; nodeId: string; port: number }> = [];

  if (Array.isArray(list.body)) {
    for (const c of list.body) {
      const name = c.Names?.[0]?.replace(/^\//, '') || '';
      const isEc2 = name.includes('floci-ec2');
      const cProject = c.Labels?.['floci.project'];
      const cNode = c.Labels?.['floci.node'] || '';
      const isMatch = isEc2 && (!projectId || cProject === projectId || name.includes(`-${projectId}-`));

      if (isMatch && Array.isArray(c.Ports)) {
        for (const p of c.Ports) {
          if (p.PrivatePort === 80 && p.PublicPort) {
            runningPorts.push(p.PublicPort);
            projectContainers.push({ projectId: cProject || projectId || '', nodeId: cNode, port: p.PublicPort });
          }
        }
      }
    }
  }

  const [s3R, sqsR, ddbR, rdsR, lamR, snsR, secR, kmsR, logR, ebR] = await Promise.all([
    awsClients.s3.send(new ListBucketsCommand({})).catch(() => ({ Buckets: [] })),
    awsClients.sqs.send(new ListQueuesCommand({})).catch(() => ({ QueueUrls: [] })),
    awsClients.dynamodb.send(new ListTablesCommand({})).catch(() => ({ TableNames: [] })),
    awsClients.rds.send(new DescribeDBInstancesCommand({})).catch(() => ({ DBInstances: [] })),
    awsClients.lambda.send(new ListFunctionsCommand({})).catch(() => ({ Functions: [] })),
    awsClients.sns.send(new ListTopicsCommand({})).catch(() => ({ Topics: [] })),
    awsClients.secrets.send(new ListSecretsCommand({})).catch(() => ({ SecretList: [] })),
    awsClients.kms.send(new ListKeysCommand({})).catch(() => ({ Keys: [] })),
    awsClients.logs.send(new DescribeLogGroupsCommand({})).catch(() => ({ logGroups: [] })),
    awsClients.eventbridge.send(new ListEventBusesCommand({})).catch(() => ({ EventBuses: [] })),
  ]);

  const buckets = (s3R.Buckets || []).map((b) => b.Name || '');
  const queues = sqsR.QueueUrls || [];
  const tables = ddbR.TableNames || [];
  const instances = (rdsR.DBInstances || []).filter((i) => i.DBInstanceStatus !== 'deleted').map((i) => i.DBInstanceIdentifier || '');
  const functions = (lamR.Functions || []).map((f) => f.FunctionName || '');
  const topics = (snsR.Topics || []).map((t) => t.TopicArn || '');
  const secrets = (secR.SecretList || []).map((s) => s.Name || '');
  const keyDescs = await Promise.all((kmsR.Keys || []).map((k) => k.KeyId ? awsClients.kms.send(new DescribeKeyCommand({ KeyId: k.KeyId })).catch(() => null) : null));
  const keys = keyDescs.filter((d: any) => d?.KeyMetadata?.KeyManager === 'CUSTOMER').map((d: any) => d?.KeyMetadata?.KeyId || '');
  const logGroups = (logR.logGroups || []).map((l) => l.logGroupName || '');
  const buses = (ebR.EventBuses || []).map((b) => b.Name || '');

  const isRunning = projectId ? projectService.getProject(projectId)?.status === 'running' : runningPorts.length > 0;

  return {
    success: true,
    projectId: projectId || null,
    isDeployed: isRunning,
    runningPorts,
    projectContainers,
    ec2: { runningPorts },
    s3: { buckets },
    sqs: { queues },
    dynamodb: { tables },
    rds: { instances },
    lambda: { functions },
    sns: { topics },
    secrets: { secrets },
    kms: { keys },
    logs: { logGroups },
    eventbridge: { buses },
  };
}
