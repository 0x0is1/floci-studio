import React from 'react';
import { Ec2ConfigForm } from './Ec2ConfigForm';
import { S3ConfigForm } from './S3ConfigForm';
import { RdsConfigForm } from './RdsConfigForm';
import { DynamoDbConfigForm } from './DynamoDbConfigForm';
import { SqsConfigForm } from './SqsConfigForm';
import { LambdaConfigForm } from './LambdaConfigForm';
import { AlbConfigForm } from './AlbConfigForm';
import { ApiGatewayConfigForm } from './ApiGatewayConfigForm';
import { VpcConfigForm } from './VpcConfigForm';
import { SubnetConfigForm } from './SubnetConfigForm';
import { CloudFrontConfigForm } from './CloudFrontConfigForm';
import { BedrockConfigForm } from './BedrockConfigForm';
import { EcsConfigForm } from './EcsConfigForm';
import { SnsConfigForm } from './SnsConfigForm';
import { SecretsConfigForm } from './SecretsConfigForm';
import { EventBridgeConfigForm } from './EventBridgeConfigForm';
import { ElastiCacheConfigForm } from './ElastiCacheConfigForm';
import { KmsConfigForm } from './KmsConfigForm';
import { LogsConfigForm } from './LogsConfigForm';
import { StepFunctionsConfigForm } from './StepFunctionsConfigForm';
import { KinesisConfigForm } from './KinesisConfigForm';
import { Route53ConfigForm } from './Route53ConfigForm';
import { EfsConfigForm } from './EfsConfigForm';
import { GenericServiceConfigForm } from './GenericServiceConfigForm';
import { TestRunnerConfigForm } from './TestRunnerConfigForm';

interface FormProps {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

const SERVICE_CONFIG_FORMS: Record<string, React.ComponentType<FormProps>> = {
  ec2: Ec2ConfigForm,
  s3: S3ConfigForm,
  rds: RdsConfigForm,
  dynamodb: DynamoDbConfigForm,
  sqs: SqsConfigForm,
  lambda: LambdaConfigForm,
  alb: AlbConfigForm,
  apigateway: ApiGatewayConfigForm,
  vpc: VpcConfigForm,
  subnet: SubnetConfigForm,
  cloudfront: CloudFrontConfigForm,
  bedrock: BedrockConfigForm,
  ecs: EcsConfigForm,
  sns: SnsConfigForm,
  secretsmanager: SecretsConfigForm,
  events: EventBridgeConfigForm,
  elasticache: ElastiCacheConfigForm,
  kms: KmsConfigForm,
  logs: LogsConfigForm,
  states: StepFunctionsConfigForm,
  kinesis: KinesisConfigForm,
  route53: Route53ConfigForm,
  efs: EfsConfigForm,
  testrunner: TestRunnerConfigForm,
};

export function renderServiceConfigForm(serviceType: string, config: Record<string, any>, onChange: (key: string, val: any) => void) {
  const Form = SERVICE_CONFIG_FORMS[serviceType];
  if (Form) return <Form config={config} onChange={onChange} />;
  return <GenericServiceConfigForm config={config} serviceType={serviceType} onChange={onChange} />;
}
