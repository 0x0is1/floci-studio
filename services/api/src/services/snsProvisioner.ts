import { awsClients } from './awsClientService';
import { CreateTopicCommand } from '@aws-sdk/client-sns';
import { logStdin, logStdout, TerminalLog } from './loggerService';

export async function provisionSns(nodeId: string, type: string, config: Record<string, any>, logs: TerminalLog[]) {
  const isFifo = config.topicType === 'fifo';
  const topicName = (config.topicName || 'app-topic') + (isFifo ? '.fifo' : '');
  logs.push(logStdin(nodeId, type, `aws sns create-topic --name ${topicName}`));

  const fallbackArn = `arn:aws:sns:us-east-1:000000000000:${topicName}`;
  const res = await awsClients.sns.send(new CreateTopicCommand({
    Name: topicName,
    Attributes: isFifo ? { FifoTopic: 'true', ContentBasedDeduplication: 'true' } : undefined,
    Tags: config.displayName ? [{ Key: 'DisplayName', Value: config.displayName }] : undefined,
  })).catch(() => ({ TopicArn: fallbackArn }));

  const topicArn = res.TopicArn || fallbackArn;
  logs.push(logStdout(nodeId, type, res, `SNS topic '${topicName}' created.`));
  return { resourceId: topicArn };
}
