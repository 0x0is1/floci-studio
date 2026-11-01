import { CanvasNode, CanvasEdge } from '@/models/project';

export function getBoilerplate(): { nodes: CanvasNode[]; edges: CanvasEdge[] } {
  const nodes: CanvasNode[] = [
    {
      id: 'vpc-default',
      type: 'custom',
      position: { x: 60, y: 260 },
      data: {
        serviceType: 'vpc',
        label: 'Default VPC',
        status: 'draft',
        config: { uuid: 'vpc-default', vpcId: 'vpc-default', cidrBlock: '172.31.0.0/16', isDefault: true },
      },
    },
    {
      id: 'subnet-default',
      type: 'custom',
      position: { x: 340, y: 260 },
      data: {
        serviceType: 'subnet',
        label: 'Default Subnet (172.31.1.0/24)',
        status: 'draft',
        config: { uuid: 'subnet-default', subnetId: 'subnet-default-1a', cidrBlock: '172.31.1.0/24', vpcId: 'vpc-default', isDefault: true },
      },
    },
    {
      id: 'client-default',
      type: 'custom',
      position: { x: 340, y: 40 },
      data: { serviceType: 'client', label: 'Browser Client', status: 'draft', config: { requestMethod: 'GET', requestPath: '/' } },
    },
    {
      id: 'ec2-default',
      type: 'custom',
      position: { x: 620, y: 140 },
      data: {
        serviceType: 'ec2',
        label: 'Web Server',
        status: 'draft',
        config: { ami: 'ami-al2023', instanceType: 't3.micro', template: 'nginx', port: 8080, publicIp: true, rootVolumeSize: 20 },
      },
    },
    {
      id: 's3-default',
      type: 'custom',
      position: { x: 900, y: 40 },
      data: {
        serviceType: 's3',
        label: 'App Storage Bucket',
        status: 'draft',
        config: { bucketName: 'app-storage', accessControl: 'private', versioning: false, encryption: 'AES256', networkAccess: 'public_external' },
      },
    },
    {
      id: 'sqs-default',
      type: 'custom',
      position: { x: 900, y: 240 },
      data: {
        serviceType: 'sqs',
        label: 'App Queue',
        status: 'draft',
        config: { queueName: 'app-queue', queueType: 'standard', visibilityTimeout: 30, messageRetentionDays: 4 },
      },
    },
  ];

  const edges: CanvasEdge[] = [
    { id: 'e-vpc-subnet', source: 'vpc-default', target: 'subnet-default', type: 'custom', data: { protocol: 'VPC CIDR Association', isConfigured: true } },
    { id: 'e-subnet-ec2', source: 'subnet-default', target: 'ec2-default', type: 'custom', data: { protocol: 'Subnet Placement', isConfigured: true } },
    { id: 'e-client-ec2', source: 'client-default', target: 'ec2-default', type: 'custom', data: { protocol: 'Direct Client Call', isConfigured: true } },
    { id: 'e-ec2-s3', source: 'ec2-default', target: 's3-default', type: 'custom', data: { iamPolicy: 's3:PutObject,s3:GetObject', envVarName: 'S3_BUCKET_NAME', isConfigured: true } },
    { id: 'e-ec2-sqs', source: 'ec2-default', target: 'sqs-default', type: 'custom', data: { iamPolicy: 'sqs:SendMessage,sqs:ReceiveMessage', envVarName: 'QUEUE_URL', isConfigured: true } },
  ];

  return { nodes, edges };
}
