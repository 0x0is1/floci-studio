import { awsClients } from './awsClientService';
import { CreateQueueCommand, GetQueueAttributesCommand } from '@aws-sdk/client-sqs';
import { logStdin, logStdout, TerminalLog } from './loggerService';
import { normalizeFlociEndpoint } from './urlResolver';

export async function provisionSqs(nodeId: string, type: string, config: Record<string, any>, logs: TerminalLog[]) {
  const isFifo = config.queueType === 'fifo';
  const queue = (config.queueName || `queue-${Date.now().toString().slice(-4)}`) + (isFifo ? '.fifo' : '');
  const access = config.networkAccess || 'vpc_only';
  const attributes: Record<string, string> = {
    VisibilityTimeout: String(config.visibilityTimeout ?? 30),
    MessageRetentionPeriod: String((config.messageRetentionDays ?? 4) * 86400),
  };
  if (isFifo) { attributes.FifoQueue = 'true'; attributes.ContentBasedDeduplication = 'true'; }

  if (config.dlqEnabled) {
    const dlqName = `${queue.replace('.fifo', '')}-dlq${isFifo ? '.fifo' : ''}`;
    logs.push(logStdin(nodeId, type, `aws sqs create-queue --queue-name ${dlqName}`));
    const dlqRes = await awsClients.sqs.send(new CreateQueueCommand({ QueueName: dlqName, Attributes: isFifo ? { FifoQueue: 'true' } : undefined }))
      .catch(() => ({ QueueUrl: `http://localhost:4566/000000000000/${dlqName}` }));
    const dlqAttrs = await awsClients.sqs.send(new GetQueueAttributesCommand({ QueueUrl: dlqRes.QueueUrl!, AttributeNames: ['QueueArn'] })).catch(() => null);
    const dlqArn = dlqAttrs?.Attributes?.QueueArn || `arn:aws:sqs:us-east-1:000000000000:${dlqName}`;
    attributes.RedrivePolicy = JSON.stringify({ deadLetterTargetArn: dlqArn, maxReceiveCount: config.maxReceiveCount ?? 3 });
  }

  logs.push(logStdin(nodeId, type, `aws sqs create-queue --queue-name ${queue} --network-access ${access}`));
  const res = await awsClients.sqs.send(new CreateQueueCommand({ QueueName: queue, Attributes: attributes })).catch(() => ({ QueueUrl: `http://localhost:4566/000000000000/${queue}` }));
  const cleanUrl = normalizeFlociEndpoint(res.QueueUrl || `http://localhost:4566/000000000000/${queue}`);
  logs.push(logStdout(nodeId, type, res, `Queue '${queue}' active at ${cleanUrl} (${access})${config.dlqEnabled ? ' with DLQ redrive' : ''}`));
  return { resourceId: cleanUrl };
}
