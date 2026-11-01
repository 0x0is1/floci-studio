import { awsClients } from './awsClientService';
import { dockerService } from './dockerService';
import { DeleteClusterCommand } from '@aws-sdk/client-ecs';
import { DeleteCacheClusterCommand } from '@aws-sdk/client-elasticache';
import { DeleteDBInstanceCommand } from '@aws-sdk/client-rds';
import { DeleteFunctionCommand } from '@aws-sdk/client-lambda';
import { DeleteTopicCommand } from '@aws-sdk/client-sns';
import { DeleteSecretCommand } from '@aws-sdk/client-secrets-manager';
import { DeleteLogGroupCommand } from '@aws-sdk/client-cloudwatch-logs';
import { DeleteEventBusCommand } from '@aws-sdk/client-eventbridge';
import { ScheduleKeyDeletionCommand } from '@aws-sdk/client-kms';
import { DeleteKeyPairCommand } from '@aws-sdk/client-ec2';
import { DeleteStreamCommand } from '@aws-sdk/client-kinesis';
import { DeleteStateMachineCommand } from '@aws-sdk/client-sfn';
import { DeleteFileSystemCommand } from '@aws-sdk/client-efs';
import { DeleteHostedZoneCommand } from '@aws-sdk/client-route-53';
import { deleteS3Bucket, deleteSqsQueue, deleteDynamoTable, terminateRunningEc2Instances } from './resourceTeardownService';

export async function deleteResourceByName(service: string, rawId: string): Promise<void> {
  const id = decodeURIComponent(rawId);
  if (service === 's3') await deleteS3Bucket(id);
  else if (service === 'sqs') await deleteSqsQueue(id);
  else if (service === 'dynamodb') await deleteDynamoTable(id);
  else if (service === 'ec2') { await dockerService.stopEc2Web(Number(id) || 8080); await terminateRunningEc2Instances(); }
  else if (service === 'rds') await awsClients.rds.send(new DeleteDBInstanceCommand({ DBInstanceIdentifier: id, SkipFinalSnapshot: true })).catch(() => {});
  else if (service === 'lambda') await awsClients.lambda.send(new DeleteFunctionCommand({ FunctionName: id })).catch(() => {});
  else if (service === 'sns') {
    const topicArn = id.startsWith('arn:') ? id : `arn:aws:sns:us-east-1:000000000000:${id}`;
    await awsClients.sns.send(new DeleteTopicCommand({ TopicArn: topicArn })).catch(() => {});
  }
  else if (service === 'secrets') await awsClients.secrets.send(new DeleteSecretCommand({ SecretId: id, ForceDeleteWithoutRecovery: true })).catch(() => {});
  else if (service === 'logs') await awsClients.logs.send(new DeleteLogGroupCommand({ logGroupName: id })).catch(() => {});
  else if (service === 'eventbridge') await awsClients.eventbridge.send(new DeleteEventBusCommand({ Name: id })).catch(() => {});
  else if (service === 'kms') await awsClients.kms.send(new ScheduleKeyDeletionCommand({ KeyId: id, PendingWindowInDays: 7 })).catch(() => {});
  else if (service === 'keypair') await awsClients.ec2.send(new DeleteKeyPairCommand({ KeyName: id })).catch(() => {});
  else if (service === 'ecs') await awsClients.ecs.send(new DeleteClusterCommand({ cluster: id })).catch(() => {});
  else if (service === 'elasticache') await awsClients.elasticache.send(new DeleteCacheClusterCommand({ CacheClusterId: id })).catch(() => {});
  else if (service === 'kinesis') await awsClients.kinesis.send(new DeleteStreamCommand({ StreamName: id })).catch(() => {});
  else if (service === 'states') {
    const stateMachineArn = id.startsWith('arn:') ? id : `arn:aws:states:us-east-1:000000000000:stateMachine:${id}`;
    await awsClients.states.send(new DeleteStateMachineCommand({ stateMachineArn })).catch(() => {});
  }
  else if (service === 'efs') await awsClients.efs.send(new DeleteFileSystemCommand({ FileSystemId: id })).catch(() => {});
  else if (service === 'route53') await awsClients.route53.send(new DeleteHostedZoneCommand({ Id: id })).catch(() => {});
}
