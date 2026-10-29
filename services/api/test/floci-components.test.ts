import { describe, expect, test } from 'bun:test';
import {
  CreateBucketCommand,
  ListBucketsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  CreateQueueCommand,
  GetQueueUrlCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import {
  DescribeInstancesCommand,
  EC2Client,
  RunInstancesCommand,
} from '@aws-sdk/client-ec2';

const flociConfig = {
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
  credentials: { accessKeyId: 'test', secretAccessKey: 'test' },
};

describe('Floci Real Component Testing', () => {
  test('S3: Create Bucket and Put Object', async () => {
    const s3 = new S3Client({ ...flociConfig, forcePathStyle: true });
    const bucketName = `test-bucket-${Date.now()}`;

    const createRes = await s3.send(new CreateBucketCommand({ Bucket: bucketName }));
    expect(createRes.$metadata.httpStatusCode).toBe(200);

    const putRes = await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: 'index.html',
        Body: '<h1>Hello Floci S3</h1>',
        ContentType: 'text/html',
      })
    );
    expect(putRes.$metadata.httpStatusCode).toBe(200);

    const listRes = await s3.send(new ListBucketsCommand({}));
    const exists = listRes.Buckets?.some((b) => b.Name === bucketName);
    expect(exists).toBe(true);
  });

  test('SQS: Create Queue and Send Message', async () => {
    const sqs = new SQSClient(flociConfig);
    const queueName = `test-queue-${Date.now()}`;

    const createRes = await sqs.send(new CreateQueueCommand({ QueueName: queueName }));
    expect(createRes.QueueUrl).toBeDefined();

    const sendRes = await sqs.send(
      new SendMessageCommand({
        QueueUrl: createRes.QueueUrl,
        MessageBody: JSON.stringify({ event: 'USER_REGISTERED', timestamp: Date.now() }),
      })
    );
    expect(sendRes.MessageId).toBeDefined();
  });

  test('DynamoDB: Create Table', async () => {
    const ddb = new DynamoDBClient(flociConfig);
    const tableName = `TestTable_${Date.now()}`;

    const createRes = await ddb.send(
      new CreateTableCommand({
        TableName: tableName,
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        BillingMode: 'PAY_PER_REQUEST',
      })
    );
    expect(createRes.TableDescription?.TableName).toBe(tableName);
  });

  test('EC2: Run Instance and Describe', async () => {
    const ec2 = new EC2Client(flociConfig);

    const runRes = await ec2.send(
      new RunInstancesCommand({
        ImageId: 'ami-12345678',
        InstanceType: 't3.micro',
        MinCount: 1,
        MaxCount: 1,
        TagSpecifications: [
          {
            ResourceType: 'instance',
            Tags: [{ Key: 'Name', Value: 'Playground-Web-Server' }],
          },
        ],
      })
    );
    const instanceId = runRes.Instances?.[0]?.InstanceId;
    expect(instanceId).toBeDefined();

    const descRes = await ec2.send(
      new DescribeInstancesCommand({ InstanceIds: [instanceId!] })
    );
    const instance = descRes.Reservations?.[0]?.Instances?.[0];
    expect(instance?.InstanceId).toBe(instanceId);
  });
});
