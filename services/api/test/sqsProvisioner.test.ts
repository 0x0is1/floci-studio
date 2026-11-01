import { describe, it, expect } from 'bun:test';
import { provisionSqs } from '../src/services/sqsProvisioner';
import { GetQueueAttributesCommand } from '@aws-sdk/client-sqs';
import { awsClients } from '../src/services/awsClientService';

describe('provisionSqs DLQ redrive policy', () => {
  it('creates a DLQ and attaches a RedrivePolicy to the main queue', async () => {
    const logs: any[] = [];
    const queueName = `test-dlq-main-${Date.now()}`;
    const result = await provisionSqs('node-1', 'sqs', {
      queueName,
      dlqEnabled: true,
      maxReceiveCount: 5,
    }, logs);

    expect(result.resourceId).toContain(queueName);

    const attrs = await awsClients.sqs.send(new GetQueueAttributesCommand({
      QueueUrl: result.resourceId,
      AttributeNames: ['RedrivePolicy'],
    }));

    const redrive = JSON.parse(attrs.Attributes?.RedrivePolicy || '{}');
    expect(redrive.maxReceiveCount).toBe(5);
    expect(redrive.deadLetterTargetArn).toContain(`${queueName}-dlq`);
  });

  it('marks a FIFO queue with the .fifo suffix and FifoQueue attribute', async () => {
    const logs: any[] = [];
    const queueName = `test-fifo-${Date.now()}`;
    const result = await provisionSqs('node-2', 'sqs', { queueName, queueType: 'fifo' }, logs);
    expect(result.resourceId).toContain(`${queueName}.fifo`);
  });
});
