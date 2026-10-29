import { describe, expect, test } from 'bun:test';
import { SNSClient, CreateTopicCommand, PublishCommand } from '@aws-sdk/client-sns';
import { SecretsManagerClient, CreateSecretCommand, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { KMSClient, CreateKeyCommand, DescribeKeyCommand } from '@aws-sdk/client-kms';
import { CloudWatchLogsClient, CreateLogGroupCommand, PutRetentionPolicyCommand } from '@aws-sdk/client-cloudwatch-logs';
import { EventBridgeClient, CreateEventBusCommand } from '@aws-sdk/client-eventbridge';
import { SFNClient, CreateStateMachineCommand } from '@aws-sdk/client-sfn';
import { KinesisClient, CreateStreamCommand, DescribeStreamCommand } from '@aws-sdk/client-kinesis';

const cfg = {
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
  credentials: { accessKeyId: 'test', secretAccessKey: 'test' },
};

describe('Floci Extended Services Wire Protocol Verification', () => {
  test('SNS: Create Topic and Publish Message', async () => {
    const sns = new SNSClient(cfg);
    const topicRes = await sns.send(new CreateTopicCommand({ Name: `test-topic-${Date.now()}` }));
    expect(topicRes.TopicArn).toBeDefined();
    const pubRes = await sns.send(new PublishCommand({ TopicArn: topicRes.TopicArn, Message: 'Hello Floci SNS' }));
    expect(pubRes.MessageId).toBeDefined();
  });

  test('Secrets Manager: Create Secret and Read Value', async () => {
    const sm = new SecretsManagerClient(cfg);
    const name = `test-secret-${Date.now()}`;
    const createRes = await sm.send(new CreateSecretCommand({ Name: name, SecretString: JSON.stringify({ key: 'val123' }) }));
    expect(createRes.ARN).toBeDefined();
    const getRes = await sm.send(new GetSecretValueCommand({ SecretId: name }));
    expect(getRes.SecretString).toContain('val123');
  });

  test('KMS: Create Key and Describe', async () => {
    const kms = new KMSClient(cfg);
    const keyRes = await kms.send(new CreateKeyCommand({ Description: 'Test Floci KMS Key', KeyUsage: 'ENCRYPT_DECRYPT' }));
    const keyId = keyRes.KeyMetadata?.KeyId;
    expect(keyId).toBeDefined();
    const descRes = await kms.send(new DescribeKeyCommand({ KeyId: keyId! }));
    expect(descRes.KeyMetadata?.KeyId).toBe(keyId);
  });

  test('CloudWatch Logs: Create Log Group and Retention', async () => {
    const logs = new CloudWatchLogsClient(cfg);
    const groupName = `/aws/test-group-${Date.now()}`;
    const createRes = await logs.send(new CreateLogGroupCommand({ logGroupName: groupName }));
    expect(createRes.$metadata.httpStatusCode).toBe(200);
    const retRes = await logs.send(new PutRetentionPolicyCommand({ logGroupName: groupName, retentionInDays: 7 }));
    expect(retRes.$metadata.httpStatusCode).toBe(200);
  });

  test('EventBridge: Create Event Bus', async () => {
    const eb = new EventBridgeClient(cfg);
    const busRes = await eb.send(new CreateEventBusCommand({ Name: `bus-${Date.now()}` }));
    expect(busRes.EventBusArn).toBeDefined();
  });

  test('Step Functions: Create State Machine', async () => {
    const sfn = new SFNClient(cfg);
    const def = JSON.stringify({
      Comment: 'Test State Machine',
      StartAt: 'PassState',
      States: { PassState: { Type: 'Pass', End: true } },
    });
    const sfnRes = await sfn.send(new CreateStateMachineCommand({
      name: `sm-${Date.now()}`,
      definition: def,
      roleArn: 'arn:aws:iam::000000000000:role/sfn-role',
    }));
    expect(sfnRes.stateMachineArn).toBeDefined();
  });

  test('Kinesis: Create Stream and Describe', async () => {
    const kin = new KinesisClient(cfg);
    const streamName = `stream-${Date.now()}`;
    await kin.send(new CreateStreamCommand({ StreamName: streamName, ShardCount: 1 }));
    const desc = await kin.send(new DescribeStreamCommand({ StreamName: streamName }));
    expect(desc.StreamDescription?.StreamName).toBe(streamName);
  });
});
