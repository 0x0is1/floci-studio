import { CanvasNode, CanvasEdge } from '@/models/project';

export function getBoilerplate(): { nodes: CanvasNode[]; edges: CanvasEdge[] } {
  const nodes: CanvasNode[] = [
    {
      id: 'vpc-default',
      type: 'custom',
      position: { x: 100, y: 140 },
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
      position: { x: 380, y: 140 },
      data: {
        serviceType: 'subnet',
        label: 'Default Subnet (172.31.1.0/24)',
        status: 'draft',
        config: { uuid: 'subnet-default', subnetId: 'subnet-default-1a', cidrBlock: '172.31.1.0/24', vpcId: 'vpc-default', isDefault: true },
      },
    },
  ];

  const edges: CanvasEdge[] = [
    {
      id: 'e-vpc-subnet',
      source: 'vpc-default',
      target: 'subnet-default',
      type: 'custom',
      data: { protocol: 'VPC CIDR Association', isConfigured: true },
    },
  ];

  return { nodes, edges };
}
