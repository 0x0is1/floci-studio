import { awsClients } from './awsClientService';
import { dockerService, dockerReq } from './dockerService';
import { ListObjectsV2Command, DeleteObjectCommand, DeleteBucketCommand } from '@aws-sdk/client-s3';
import { DeleteQueueCommand } from '@aws-sdk/client-sqs';
import { DeleteTableCommand } from '@aws-sdk/client-dynamodb';
import { DeleteDBInstanceCommand } from '@aws-sdk/client-rds';
import { DeleteFunctionCommand } from '@aws-sdk/client-lambda';
import { DeleteTopicCommand } from '@aws-sdk/client-sns';
import { DeleteSecretCommand } from '@aws-sdk/client-secrets-manager';
import { DeleteLogGroupCommand } from '@aws-sdk/client-cloudwatch-logs';
import { DeleteEventBusCommand } from '@aws-sdk/client-eventbridge';

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

export async function deleteResourceByName(service: string, rawId: string): Promise<void> {
  const id = decodeURIComponent(rawId);
  if (service === 's3') await deleteS3Bucket(id);
  else if (service === 'sqs') await deleteSqsQueue(id);
  else if (service === 'dynamodb') await deleteDynamoTable(id);
  else if (service === 'ec2') await dockerService.stopEc2Web(Number(id) || 8080);
  else if (service === 'rds') await awsClients.rds.send(new DeleteDBInstanceCommand({ DBInstanceIdentifier: id, SkipFinalSnapshot: true })).catch(() => {});
  else if (service === 'lambda') await awsClients.lambda.send(new DeleteFunctionCommand({ FunctionName: id })).catch(() => {});
  else if (service === 'sns') await awsClients.sns.send(new DeleteTopicCommand({ TopicArn: id })).catch(() => {});
  else if (service === 'secrets') await awsClients.secrets.send(new DeleteSecretCommand({ SecretId: id, ForceDeleteWithoutRecovery: true })).catch(() => {});
  else if (service === 'logs') await awsClients.logs.send(new DeleteLogGroupCommand({ logGroupName: id })).catch(() => {});
  else if (service === 'eventbridge') await awsClients.eventbridge.send(new DeleteEventBusCommand({ Name: id })).catch(() => {});
}

export async function teardownSessionResources(params: {
  ports?: number[]; buckets?: string[]; queues?: string[]; tables?: string[]; projectId?: string;
}): Promise<void> {
  const { ports = [], buckets = [], queues = [], tables = [], projectId } = params;
  for (const b of buckets) await deleteS3Bucket(b);
  for (const q of queues) await deleteSqsQueue(q);
  for (const t of tables) await deleteDynamoTable(t);
  for (const p of ports) await dockerService.stopEc2Web(p, projectId);
  if (projectId) await dockerService.stopEc2Web(undefined, projectId);
  else await purgeAllFlociResources();
}

export async function purgeAllFlociResources(): Promise<void> {
  const list = await dockerReq('GET', '/containers/json?all=true');
  if (Array.isArray(list.body)) {
    for (const c of list.body) {
      if (c.Names?.some((n: string) => n.includes('floci-ec2'))) await dockerReq('DELETE', `/containers/${c.Id}?force=true`).catch(() => {});
    }
  }
}
