import { EC2Client } from '@aws-sdk/client-ec2';
import { S3Client } from '@aws-sdk/client-s3';
import { SQSClient } from '@aws-sdk/client-sqs';
import { RDSClient } from '@aws-sdk/client-rds';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { LambdaClient } from '@aws-sdk/client-lambda';
import { ElasticLoadBalancingV2Client } from '@aws-sdk/client-elastic-load-balancing-v2';
import { IAMClient } from '@aws-sdk/client-iam';
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';
import { config } from '@/config/env';

const clientConfig = {
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
};
