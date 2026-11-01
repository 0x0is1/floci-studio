import { dockerService, dockerReq } from './dockerService';
import { stopContainer } from './containerRuntime';
import { ListObjectsV2Command, DeleteObjectCommand, DeleteBucketCommand } from '@aws-sdk/client-s3';
import { DeleteQueueCommand } from '@aws-sdk/client-sqs';
import { DeleteTableCommand } from '@aws-sdk/client-dynamodb';
import { DescribeInstancesCommand, TerminateInstancesCommand } from '@aws-sdk/client-ec2';
import { purgeKmsKeys, purgeEc2KeyPairs, purgeIamRoles } from './deepPurgeService';
import { deleteResourceByName } from './resourceDeleteDispatch';
import { awsClients } from './awsClientService';

export async function terminateRunningEc2Instances(): Promise<void> {
  const described = await awsClients.ec2.send(new DescribeInstancesCommand({
    Filters: [{ Name: 'instance-state-name', Values: ['running', 'pending'] }],
  })).catch(() => null);
  const instanceIds = (described?.Reservations || [])
    .flatMap((r) => r.Instances || [])
    .map((i) => i.InstanceId)
    .filter((id): id is string => Boolean(id));
  if (instanceIds.length) {
    await awsClients.ec2.send(new TerminateInstancesCommand({ InstanceIds: instanceIds })).catch(() => {});
  }
}

export async function deleteS3Bucket(bucket: string): Promise<void> {
  try {
    const list = await awsClients.s3.send(new ListObjectsV2Command({ Bucket: bucket })).catch(() => null);
    if (list?.Contents?.length) {
      for (const obj of list.Contents) {
        if (obj.Key) await awsClients.s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: obj.Key })).catch(() => {});
      }
    }
    await awsClients.s3.send(new DeleteBucketCommand({ Bucket: bucket }));
  } catch {}
}

export async function deleteSqsQueue(queueUrl: string): Promise<void> {
  await awsClients.sqs.send(new DeleteQueueCommand({ QueueUrl: queueUrl })).catch(() => {});
}

export async function deleteDynamoTable(tableName: string): Promise<void> {
  await awsClients.dynamodb.send(new DeleteTableCommand({ TableName: tableName })).catch(() => {});
}

export { deleteResourceByName };

export async function teardownSessionResources(params: {
  ports?: number[]; buckets?: string[]; queues?: string[]; tables?: string[];
  rdsInstances?: string[]; lambdaFunctions?: string[]; snsTopics?: string[]; secrets?: string[];
  logGroups?: string[]; eventBuses?: string[]; kinesisStreams?: string[]; stateMachines?: string[];
  fileSystems?: string[]; hostedZones?: string[]; projectId?: string;
}): Promise<void> {
  const {
    ports = [], buckets = [], queues = [], tables = [],
    rdsInstances = [], lambdaFunctions = [], snsTopics = [], secrets = [], logGroups = [], eventBuses = [],
    kinesisStreams = [], stateMachines = [], fileSystems = [], hostedZones = [],
    projectId,
  } = params;
  for (const b of buckets) await deleteS3Bucket(b);
  for (const q of queues) await deleteSqsQueue(q);
  for (const t of tables) await deleteDynamoTable(t);
  for (const r of rdsInstances) await deleteResourceByName('rds', r);
  for (const fn of lambdaFunctions) await deleteResourceByName('lambda', fn);
  for (const sn of snsTopics) await deleteResourceByName('sns', sn);
  for (const sc of secrets) await deleteResourceByName('secrets', sc);
  for (const lg of logGroups) await deleteResourceByName('logs', lg);
  for (const eb of eventBuses) await deleteResourceByName('eventbridge', eb);
  for (const ks of kinesisStreams) await deleteResourceByName('kinesis', ks);
  for (const sm of stateMachines) await deleteResourceByName('states', sm);
  for (const fs of fileSystems) await deleteResourceByName('efs', fs);
  for (const hz of hostedZones) await deleteResourceByName('route53', hz);
  for (const p of ports) await dockerService.stopEc2Web(p, projectId);
  if (ports.length) await terminateRunningEc2Instances();
  if (projectId) {
    await dockerService.stopEc2Web(undefined, projectId);
    await stopContainer('floci-ecs', undefined, projectId);
    await stopContainer('floci-elasticache', undefined, projectId);
  } else {
    await purgeAllFlociResources();
  }
}

export async function purgeAllFlociResources(): Promise<void> {
  const list = await dockerReq('GET', '/containers/json?all=true');
  if (Array.isArray(list.body)) {
    for (const c of list.body) {
      if (c.Names?.some((n: string) => n.includes('floci-ec2') || n.includes('floci-ecs') || n.includes('floci-elasticache'))) {
        await dockerReq('DELETE', `/containers/${c.Id}?force=true`).catch(() => {});
      }
    }
  }
  await purgeKmsKeys();
  await purgeEc2KeyPairs();
  await purgeIamRoles();
}
