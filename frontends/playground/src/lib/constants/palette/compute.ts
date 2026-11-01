import { AwsPaletteItem } from '@/types/aws';

export const COMPUTE_PALETTE_ITEMS: AwsPaletteItem[] = [
  {
    type: 'ec2',
    category: 'compute',
    name: 'EC2 Instance',
    description: 'Virtual compute server running Linux web, API or container workloads',
    flociStatus: 'ready',
    defaultConfig: { ami: 'ami-al2023', instanceType: 't3.micro', template: 'nginx', port: 8080, publicIp: true, rootVolumeSize: 20 },
  },
  {
    type: 'lambda',
    category: 'compute',
    name: 'Lambda Function',
    description: 'Event-driven serverless code execution without provisioning servers',
    flociStatus: 'ready',
    defaultConfig: { functionName: 'app-fn', runtime: 'nodejs20.x', memorySize: 256, timeout: 15, handler: 'index.handler' },
  },
  {
    type: 'ecs',
    category: 'compute',
    name: 'ECS Container',
    description: 'Managed Docker container service on serverless AWS Fargate',
    flociStatus: 'ready',
    defaultConfig: { clusterName: 'prod-cluster', launchType: 'FARGATE', image: 'nginx:alpine', containerPort: 80, cpu: 256, memory: 512, desiredCount: 1 },
  },
  {
    type: 'testrunner',
    category: 'compute',
    name: 'Test Runner',
    description: 'Runs uploaded pytest/hurl/Playwright test files against deployed resources',
    flociStatus: 'ready',
    defaultConfig: { networkAccess: 'vpc_only' },
  },
];
