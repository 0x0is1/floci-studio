import { describe, it, expect } from 'bun:test';
import { provisionSns } from '../src/services/snsProvisioner';
import { provisionSecret } from '../src/services/secretsProvisioner';
import { provisionKms } from '../src/services/kmsProvisioner';
import { provisionLogs } from '../src/services/logsProvisioner';
import { provisionEventBridge } from '../src/services/eventBridgeProvisioner';
import { provisionKinesis } from '../src/services/kinesisProvisioner';
import { provisionStepFunctions } from '../src/services/stepFunctionsProvisioner';
import { deleteResourceByName } from '../src/services/resourceDeleteDispatch';
import { GetTopicAttributesCommand } from '@aws-sdk/client-sns';
import { awsClients } from '../src/services/awsClientService';

describe('Real provisioning for previously-fake resource types', () => {
  it('creates a real SNS topic and returns its real ARN', async () => {
    const logs: any[] = [];
    const topicName = `test-topic-${Date.now()}`;
    const result = await provisionSns('n1', 'sns', { topicName }, logs);
    expect(result.resourceId).toContain(topicName);
    expect(result.resourceId).toMatch(/^arn:aws:sns:/);
    const attrs = await awsClients.sns.send(new GetTopicAttributesCommand({ TopicArn: result.resourceId }));
    expect(attrs.Attributes).toBeDefined();
  });

  it('tears down an SNS topic created from a bare name (ARN-vs-name mismatch fix)', async () => {
    const logs: any[] = [];
    const topicName = `test-teardown-${Date.now()}`;
    const result = await provisionSns('n1b', 'sns', { topicName }, logs);
    await expect(deleteResourceByName('sns', topicName)).resolves.toBeUndefined();
    await expect(
      awsClients.sns.send(new GetTopicAttributesCommand({ TopicArn: result.resourceId }))
    ).rejects.toBeTruthy();
  });

  it('creates a real secret with its value', async () => {
    const logs: any[] = [];
    const secretName = `test-secret-${Date.now()}`;
    const result = await provisionSecret('n2', 'secretsmanager', { secretName, secretString: '{"k":"v"}' }, logs);
    expect(result.resourceId).toContain(secretName);
  });

  it('creates a real KMS key and alias', async () => {
    const logs: any[] = [];
    const result = await provisionKms('n3', 'kms', { keyAlias: `alias/test-${Date.now()}` }, logs);
    expect(result.resourceId).toBeTruthy();
  });

  it('creates a real CloudWatch log group', async () => {
    const logs: any[] = [];
    const logGroupName = `/floci/test-${Date.now()}`;
    const result = await provisionLogs('n4', 'logs', { logGroupName, retentionDays: 7 }, logs);
    expect(result.resourceId).toBe(logGroupName);
  });

  it('creates a real EventBridge bus', async () => {
    const logs: any[] = [];
    const busName = `test-bus-${Date.now()}`;
    const result = await provisionEventBridge('n5', 'events', { busName, rulePattern: 'custom.test' }, logs);
    expect(result.resourceId).toBe(busName);
  });

  it('creates a real Kinesis stream', async () => {
    const logs: any[] = [];
    const streamName = `test-stream-${Date.now()}`;
    const result = await provisionKinesis('n6', 'kinesis', { streamName, shardCount: 1 }, logs);
    expect(result.resourceId).toBe(streamName);
  });

  it('creates a real Step Functions state machine', async () => {
    const logs: any[] = [];
    const stateMachineName = `test-workflow-${Date.now()}`;
    const result = await provisionStepFunctions('n7', 'states', { stateMachineName }, logs);
    expect(result.resourceId).toContain(stateMachineName);
  });
});
