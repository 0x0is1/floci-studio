import { AwsPaletteItem } from '@/types/aws';

export const NETWORKING_PALETTE_ITEMS: AwsPaletteItem[] = [
  {
    type: 'cloudfront',
    category: 'networking',
    name: 'CloudFront CDN',
    description: 'Global low-latency content delivery network distribution',
    flociStatus: 'ready',
    defaultConfig: { priceClass: 'PriceClass_100', defaultRootObject: 'index.html', viewerProtocolPolicy: 'redirect-to-https' },
  },
  {
    type: 'alb',
    category: 'networking',
    name: 'App Load Balancer',
    description: 'Layer-7 load balancer routing HTTP/HTTPS traffic to targets',
    flociStatus: 'ready',
    defaultConfig: { scheme: 'internet-facing', port: 80, protocol: 'HTTP', algorithm: 'round_robin' },
  },
  {
    type: 'apigateway',
    category: 'networking',
    name: 'API Gateway',
    description: 'Managed REST/HTTP API endpoints routing to Lambda or EC2',
    flociStatus: 'ready',
    defaultConfig: { protocolType: 'HTTP', corsEnabled: true },
  },
  {
    type: 'vpc',
    category: 'networking',
    name: 'VPC Network',
    description: 'Isolated virtual cloud network with private IP range',
    flociStatus: 'ready',
    defaultConfig: { cidrBlock: '10.0.0.0/16', enableDnsHostnames: true },
  },
  {
    type: 'subnet',
    category: 'networking',
    name: 'VPC Subnet',
    description: 'Sub-range of VPC IP addresses assigned to Availability Zone',
    flociStatus: 'ready',
    defaultConfig: { cidrBlock: '10.0.1.0/24', availabilityZone: 'us-east-1a' },
  },
  {
    type: 'route53',
    category: 'networking',
    name: 'Route 53 DNS',
    description: 'Scalable cloud Domain Name System (DNS) web traffic routing',
    flociStatus: 'ready',
    defaultConfig: { domainName: 'example.com', recordType: 'A', ttl: 300 },
  },
];
