import { EC2Client } from '@aws-sdk/client-ec2';
import { S3Client } from '@aws-sdk/client-s3';
import { SQSClient } from '@aws-sdk/client-sqs';
import { RDSClient } from '@aws-sdk/client-rds';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { LambdaClient } from '@aws-sdk/client-lambda';
import { ElasticLoadBalancingV2Client } from '@aws-sdk/client-elastic-load-balancing-v2';
import { IAMClient } from '@aws-sdk/client-iam';
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';
import { SNSClient } from '@aws-sdk/client-sns';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { KMSClient } from '@aws-sdk/client-kms';
import { CloudWatchLogsClient } from '@aws-sdk/client-cloudwatch-logs';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { ECSClient } from '@aws-sdk/client-ecs';
import { ElastiCacheClient } from '@aws-sdk/client-elasticache';
import { Route53Client } from '@aws-sdk/client-route-53';
import { KinesisClient } from '@aws-sdk/client-kinesis';
import { SFNClient } from '@aws-sdk/client-sfn';
import { EFSClient } from '@aws-sdk/client-efs';
import { config } from '@/config/env';

export const clientConfig = {
  region: config.awsRegion,
  endpoint: config.flociEndpoint,
  credentials: {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey,
  },
};

export const awsClients = {
  ec2: new EC2Client(clientConfig),
  s3: new S3Client({ ...clientConfig, forcePathStyle: true }),
  sqs: new SQSClient(clientConfig),
  rds: new RDSClient(clientConfig),
  dynamodb: new DynamoDBClient(clientConfig),
  lambda: new LambdaClient(clientConfig),
  alb: new ElasticLoadBalancingV2Client(clientConfig),
  iam: new IAMClient(clientConfig),
  bedrockRuntime: new BedrockRuntimeClient(clientConfig),
  sns: new SNSClient(clientConfig),
  secrets: new SecretsManagerClient(clientConfig),
  kms: new KMSClient(clientConfig),
  logs: new CloudWatchLogsClient(clientConfig),
  eventbridge: new EventBridgeClient(clientConfig),
  ecs: new ECSClient(clientConfig),
  elasticache: new ElastiCacheClient(clientConfig),
  route53: new Route53Client(clientConfig),
  kinesis: new KinesisClient(clientConfig),
  states: new SFNClient(clientConfig),
  efs: new EFSClient(clientConfig),
};
