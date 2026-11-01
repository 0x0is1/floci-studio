import React from 'react';
import {
  AmazonCloudFront, AmazonApiGateway, AmazonEc2, AmazonSimpleStorageService,
  AmazonSimpleQueueService, AmazonRds, AmazonDynamoDb, AwsLambda, ElasticLoadBalancing,
  AmazonElasticContainerService, AmazonElasticKubernetesService, AmazonSimpleNotificationService,
  AmazonEventBridge, AwsStepFunctions, AmazonBedrock, AwsSecretsManager,
  AwsKeyManagementService, AmazonCloudWatch, AmazonElastiCache, AmazonKinesis,
  AmazonRoute53, AmazonEfs,
} from '@aws-icons/react/architecture-service';
import { VirtualPrivateCloudVpc, PublicSubnet } from '@aws-icons/react/architecture-group';
import { FaAws, FaFlask } from 'react-icons/fa6';

interface IconProps {
  type: string;
  size?: number;
  className?: string;
}

export function AwsIcon({ type, size = 20, className = '' }: IconProps) {
  const c = `inline-flex items-center justify-center shrink-0 ${className}`;

  switch (type) {
    case 'cloudfront': return <span className={c}><AmazonCloudFront width={size} height={size} /></span>;
    case 'apigateway': case 'apigatewayv2': return <span className={c}><AmazonApiGateway width={size} height={size} /></span>;
    case 'alb': return <span className={c}><ElasticLoadBalancing width={size} height={size} /></span>;
    case 'vpc': return <span className={c}><VirtualPrivateCloudVpc width={size} height={size} /></span>;
    case 'subnet': return <span className={c}><PublicSubnet width={size} height={size} /></span>;
    case 'ec2': return <span className={c}><AmazonEc2 width={size} height={size} /></span>;
    case 's3': case 's3tables': case 's3vectors': return <span className={c}><AmazonSimpleStorageService width={size} height={size} /></span>;
    case 'rds': return <span className={c}><AmazonRds width={size} height={size} /></span>;
    case 'dynamodb': return <span className={c}><AmazonDynamoDb width={size} height={size} /></span>;
    case 'sqs': return <span className={c}><AmazonSimpleQueueService width={size} height={size} /></span>;
    case 'lambda': return <span className={c}><AwsLambda width={size} height={size} /></span>;
    case 'ecs': return <span className={c}><AmazonElasticContainerService width={size} height={size} /></span>;
    case 'eks': return <span className={c}><AmazonElasticKubernetesService width={size} height={size} /></span>;
    case 'sns': return <span className={c}><AmazonSimpleNotificationService width={size} height={size} /></span>;
    case 'events': case 'scheduler': case 'pipes': return <span className={c}><AmazonEventBridge width={size} height={size} /></span>;
    case 'states': return <span className={c}><AwsStepFunctions width={size} height={size} /></span>;
    case 'bedrock': return <span className={c}><AmazonBedrock width={size} height={size} /></span>;
    case 'secretsmanager': return <span className={c}><AwsSecretsManager width={size} height={size} /></span>;
    case 'kms': return <span className={c}><AwsKeyManagementService width={size} height={size} /></span>;
    case 'logs': case 'monitoring': return <span className={c}><AmazonCloudWatch width={size} height={size} /></span>;
    case 'elasticache': return <span className={c}><AmazonElastiCache width={size} height={size} /></span>;
    case 'kinesis': return <span className={c}><AmazonKinesis width={size} height={size} /></span>;
    case 'route53': return <span className={c}><AmazonRoute53 width={size} height={size} /></span>;
    case 'efs': return <span className={c}><AmazonEfs width={size} height={size} /></span>;
    case 'testrunner': return <span className={c}><FaFlask className="text-fuchsia-400" style={{ width: size, height: size }} /></span>;
    default: return <span className={c}><FaAws className="text-amber-500" style={{ width: size, height: size }} /></span>;
  }
}