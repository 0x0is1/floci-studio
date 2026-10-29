import { AwsServiceType, AwsEdgeData } from '@/types/aws';

export function checkComputeRules(sourceType: AwsServiceType, targetType: AwsServiceType): { match: boolean; data?: AwsEdgeData } {
  const isCompute = sourceType === 'ec2' || sourceType === 'lambda' || sourceType === 'ecs' || sourceType === 'batch';

  if (isCompute) {
    if (targetType === 's3' || targetType === 's3tables' || targetType === 's3vectors') {
      return { match: true, data: { iamPolicy: 's3:PutObject,s3:GetObject', envVarName: 'S3_BUCKET_NAME', isConfigured: true } };
    }
    if (targetType === 'rds' || targetType === 'docdb' || targetType === 'redshift') {
      return { match: true, data: { protocol: 'TCP', port: 5432, envVarName: 'DATABASE_URL', isConfigured: true } };
    }
    if (targetType === 'dynamodb' || targetType === 'elasticache' || targetType === 'memorydb') {
      return { match: true, data: { iamPolicy: 'dynamodb:GetItem,dynamodb:PutItem', envVarName: 'DATABASE_TABLE', isConfigured: true } };
    }
    if (targetType === 'sqs') {
      return { match: true, data: { iamPolicy: 'sqs:SendMessage,sqs:ReceiveMessage', envVarName: 'QUEUE_URL', isConfigured: true } };
    }
    if (targetType === 'sns') {
      return { match: true, data: { iamPolicy: 'sns:Publish', envVarName: 'TOPIC_ARN', isConfigured: true } };
    }
    if (targetType === 'secretsmanager') {
      return { match: true, data: { iamPolicy: 'secretsmanager:GetSecretValue', envVarName: 'SECRET_ID', isConfigured: true } };
    }
    if (targetType === 'bedrock') {
      return { match: true, data: { iamPolicy: 'bedrock:InvokeModel', envVarName: 'MODEL_ID', isConfigured: true } };
    }
    if (targetType === 'lambda' && sourceType !== 'lambda') {
      return { match: true, data: { iamPolicy: 'lambda:InvokeFunction', envVarName: 'FUNCTION_NAME', isConfigured: true } };
    }
  }

  return { match: false };
}

export function checkNetworkRules(sourceType: AwsServiceType, targetType: AwsServiceType): { match: boolean; data?: AwsEdgeData } {
  if (sourceType === 'cloudfront') {
    if (targetType === 's3') {
      return { match: true, data: { protocol: 'S3 Origin (OAC)', isConfigured: true } };
    }
    if (targetType === 'alb' || targetType === 'ec2') {
      return { match: true, data: { protocol: 'Custom Origin', port: 8080, isConfigured: true } };
    }
    if (targetType === 'apigateway' || targetType === 'apigatewayv2') {
      return { match: true, data: { protocol: 'API Gateway Origin', isConfigured: true } };
    }
  }
  if (sourceType === 'vpc' && targetType === 'subnet') {
    return { match: true, data: { protocol: 'VPC Association', isConfigured: true } };
  }
  if (sourceType === 'subnet' && (targetType === 'ec2' || targetType === 'rds' || targetType === 'ecs')) {
    return { match: true, data: { protocol: 'Subnet Placement', isConfigured: true } };
  }
  return { match: false };
}