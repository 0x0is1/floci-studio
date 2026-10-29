import { dockerReq } from './dockerService';
import { awsClients } from './awsClientService';
import { projectService } from './projectService';
import { ListBucketsCommand } from '@aws-sdk/client-s3';
import { ListQueuesCommand } from '@aws-sdk/client-sqs';
import { ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { DescribeDBInstancesCommand } from '@aws-sdk/client-rds';
import { ListFunctionsCommand } from '@aws-sdk/client-lambda';

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

  const [s3Res, sqsRes, ddbRes, rdsRes, lamRes] = await Promise.all([
    awsClients.s3.send(new ListBucketsCommand({})).catch(() => ({ Buckets: [] })),
    awsClients.sqs.send(new ListQueuesCommand({})).catch(() => ({ QueueUrls: [] })),
    awsClients.dynamodb.send(new ListTablesCommand({})).catch(() => ({ TableNames: [] })),
    awsClients.rds.send(new DescribeDBInstancesCommand({})).catch(() => ({ DBInstances: [] })),
    awsClients.lambda.send(new ListFunctionsCommand({})).catch(() => ({ Functions: [] })),
  ]);

  const buckets = (s3Res.Buckets || []).map((b) => b.Name || '');
  const queues = sqsRes.QueueUrls || [];
  const tables = ddbRes.TableNames || [];
  const instances = (rdsRes.DBInstances || [])
    .filter((i) => i.DBInstanceStatus !== 'deleting' && i.DBInstanceStatus !== 'deleted')
    .map((i) => i.DBInstanceIdentifier || '');
  const functions = (lamRes.Functions || []).map((f) => f.FunctionName || '');

  const isRunning = projectId
    ? projectService.getProject(projectId)?.status === 'running'
    : runningPorts.length > 0;

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
  };
}