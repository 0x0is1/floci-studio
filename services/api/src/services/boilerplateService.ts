import { CanvasNode, CanvasEdge } from '@/models/project';

export function getBoilerplate(): { nodes: CanvasNode[]; edges: CanvasEdge[] } {
  const ts = Date.now().toString().slice(-4);
  const nodes: CanvasNode[] = [
    {
      id: 'cf-1',
      type: 'custom',
      position: { x: 60, y: 160 },
      data: {
        serviceType: 'cloudfront',
        label: 'CloudFront CDN',
        status: 'draft',
        config: { uuid: crypto.randomUUID(), priceClass: 'PriceClass_100', defaultRootObject: 'index.html', viewerProtocolPolicy: 'redirect-to-https', networkAccess: 'public_external' },
      },
    },
    {
      id: 'ec2-1',
      type: 'custom',
      position: { x: 380, y: 160 },
      data: {
        serviceType: 'ec2',
        label: 'Production Web Server',
        status: 'draft',
        config: {
          uuid: crypto.randomUUID(),
          ami: 'ami-al2023',
          instanceType: 't3.micro',
          template: 'nginx',
          port: 8080,
          publicIp: true,
          rootVolumeSize: 20,
          name: `web-server-${ts}`,
          keyName: 'default-key',
          iamRole: 'ec2-production-role',
          iamPolicies: ['s3:GetObject', 's3:PutObject', 'sqs:SendMessage'],
        },
      },
    },
    {
      id: 's3-1',
      type: 'custom',
      position: { x: 720, y: 70 },
      data: {
        serviceType: 's3',
        label: 'Static Media Bucket',
        status: 'draft',
        config: { uuid: crypto.randomUUID(), bucketName: `assets-${ts}`, accessControl: 'private', versioning: false, encryption: 'AES256', networkAccess: 'public_external' },
      },
    },
    {
      id: 'sqs-1',
      type: 'custom',
      position: { x: 720, y: 250 },
      data: {
        serviceType: 'sqs',
        label: 'Background Job Queue',
        status: 'draft',
        config: { uuid: crypto.randomUUID(), queueName: `jobs-${ts}`, queueType: 'standard', visibilityTimeout: 30, messageRetentionDays: 4, networkAccess: 'vpc_only' },
      },
    },
  ];

  const edges: CanvasEdge[] = [
    {
      id: 'e-cf-ec2',
      source: 'cf-1',
      target: 'ec2-1',
      type: 'custom',
      data: { protocol: 'HTTP', port: 8080, isConfigured: true },
    },
    {
      id: 'e-ec2-s3',
      source: 'ec2-1',
      target: 's3-1',
      type: 'custom',
      data: { iamPolicy: 's3:PutObject,s3:GetObject', envVarName: 'S3_BUCKET_NAME', isConfigured: true },
    },
    {
      id: 'e-ec2-sqs',
      source: 'ec2-1',
      target: 'sqs-1',
      type: 'custom',
      data: { iamPolicy: 'sqs:SendMessage', envVarName: 'QUEUE_URL', isConfigured: true },
    },
  ];

  return { nodes, edges };
}
