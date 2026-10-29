import { awsClients } from './awsClientService';
import { dockerService, dockerReq } from './dockerService';
import { ListObjectsV2Command, DeleteObjectCommand, DeleteBucketCommand } from '@aws-sdk/client-s3';
import { DeleteQueueCommand } from '@aws-sdk/client-sqs';
import { DeleteTableCommand } from '@aws-sdk/client-dynamodb';

export async function deleteS3Bucket(bucket: string): Promise<void> {
  try {
    const listRes = await awsClients.s3.send(new ListObjectsV2Command({ Bucket: bucket })).catch(() => null);
    if (listRes?.Contents?.length) {
      for (const obj of listRes.Contents) {
        if (obj.Key) {
          await awsClients.s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: obj.Key })).catch(() => {});
        }
      }
    }
    await awsClients.s3.send(new DeleteBucketCommand({ Bucket: bucket }));
  } catch {
    // Ignore if bucket doesn't exist
  }
}

export async function deleteSqsQueue(queueUrl: string): Promise<void> {
  await awsClients.sqs.send(new DeleteQueueCommand({ QueueUrl: queueUrl })).catch(() => {});
}

export async function deleteDynamoTable(tableName: string): Promise<void> {
  await awsClients.dynamodb.send(new DeleteTableCommand({ TableName: tableName })).catch(() => {});
}

export async function teardownSessionResources(params: {
  ports?: number[];
  buckets?: string[];
  queues?: string[];
  tables?: string[];
  projectId?: string;
}): Promise<void> {
  const { ports = [], buckets = [], queues = [], tables = [], projectId } = params;

  for (const bucket of buckets) {
    await deleteS3Bucket(bucket);
  }
  for (const queue of queues) {
    await deleteSqsQueue(queue);
  }
  for (const table of tables) {
    await deleteDynamoTable(table);
  }
  for (const port of ports) {
    await dockerService.stopEc2Web(port, projectId);
  }
  if (projectId) {
    await dockerService.stopEc2Web(undefined, projectId);
  } else {
    await purgeAllFlociResources();
  }
}

export async function purgeAllFlociResources(): Promise<void> {
  const list = await dockerReq('GET', '/containers/json?all=true');
  if (Array.isArray(list.body)) {
    for (const c of list.body) {
      const isEc2 = c.Names?.some((n: string) => n.includes('floci-ec2'));
      if (isEc2) {
        await dockerReq('DELETE', `/containers/${c.Id}?force=true`).catch(() => {});
      }
    }
  }
}