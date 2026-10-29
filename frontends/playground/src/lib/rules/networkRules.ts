import { AwsServiceType, AwsEdgeData } from '@/types/aws';

export function checkNetworkRules(sourceType: AwsServiceType, targetType: AwsServiceType): { match: boolean; data?: AwsEdgeData } {
  if (sourceType === 'cloudfront') {
    if (targetType === 's3') return { match: true, data: { protocol: 'S3 Origin (OAC)', isConfigured: true } };
    if (targetType === 'alb' || targetType === 'ec2') return { match: true, data: { protocol: 'HTTP Custom Origin', port: 8080, isConfigured: true } };
    if (targetType === 'apigateway') return { match: true, data: { protocol: 'API Gateway Origin', isConfigured: true } };
  }

  if (sourceType === 'alb') {
    if (['ec2', 'lambda', 'ecs'].includes(targetType)) {
      return { match: true, data: { protocol: 'HTTP Target Group', port: 80, isConfigured: true } };
    }
  }

  if (sourceType === 'apigateway') {
    if (['lambda', 'ec2', 'sqs', 'states', 'logs'].includes(targetType)) {
      return { match: true, data: { protocol: 'API Gateway Integration', isConfigured: true } };
    }
  }

  if (sourceType === 'route53') {
    if (['cloudfront', 'alb', 'apigateway', 'ec2', 's3'].includes(targetType)) {
      return { match: true, data: { protocol: 'DNS Routing Record', isConfigured: true } };
    }
  }

  if (sourceType === 'vpc' && targetType === 'subnet') {
    return { match: true, data: { protocol: 'VPC CIDR Association', isConfigured: true } };
  }

  if (sourceType === 'subnet' && ['ec2', 'rds', 'ecs', 'elasticache', 'lambda', 'efs'].includes(targetType)) {
    return { match: true, data: { protocol: 'Subnet Placement', isConfigured: true } };
  }

  return { match: false };
}
