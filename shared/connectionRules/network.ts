import { EdgeData, isCompute } from './types';

export function networkRule(source: string, target: string): EdgeData | undefined {
  if (source === 'cloudfront') {
    if (target === 's3') return { protocol: 'S3 Origin (OAC)', isConfigured: true };
    if (['alb', 'ec2', 'ecs'].includes(target)) return { protocol: 'HTTP Custom Origin', port: 8080, isConfigured: true };
    if (target === 'apigateway') return { protocol: 'API Gateway Origin', isConfigured: true };
  }
  if (source === 'alb' && isCompute(target)) return { protocol: 'HTTP Target Group', port: 80, isConfigured: true };
  if (source === 'apigateway' && ['lambda', 'ec2', 'ecs', 'sqs', 'states', 'logs'].includes(target)) {
    return { protocol: 'API Gateway Integration', isConfigured: true };
  }
  if (source === 'route53' && ['cloudfront', 'alb', 'apigateway', 'ec2', 'ecs', 's3'].includes(target)) {
    return { protocol: 'DNS Routing Record', isConfigured: true };
  }
  if (source === 'client' && ['alb', 'apigateway', 'cloudfront', 'route53', 'ec2', 'ecs', 'lambda'].includes(target)) {
    return { protocol: 'Direct Client Call', isConfigured: true };
  }
  const placementTargets = ['ec2', 'rds', 'ecs', 'alb', 'elasticache', 'lambda', 'efs', 'client', 'testrunner'];
  if (source === 'vpc' && (target === 'subnet' || placementTargets.includes(target))) {
    return { protocol: 'VPC Network Association', isConfigured: true };
  }
  if (source === 'subnet' && placementTargets.includes(target)) {
    return { protocol: 'Subnet Placement', isConfigured: true };
  }
  return undefined;
}
