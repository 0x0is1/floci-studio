import type { Node, Edge } from '@xyflow/react';
import type { AwsNodeData, AwsEdgeData } from '@/types/aws';

export interface VpcValidationResult {
  valid: boolean;
  title?: string;
  description?: string;
}

export function validateVpcDeployment(
  nodes: Node<AwsNodeData>[],
  edges: Edge<AwsEdgeData>[]
): VpcValidationResult {
  const vpcNodes = nodes.filter((n) => n.data?.serviceType === 'vpc');
  const subnetNodes = nodes.filter((n) => n.data?.serviceType === 'subnet');

  if (vpcNodes.length === 0 || subnetNodes.length === 0) {
    return {
      valid: false,
      title: 'VPC & Subnet Required',
      description: 'A Default VPC and Subnet are mandatory for AWS infrastructure deployment.',
    };
  }

  const vpcIds = new Set(vpcNodes.map((n) => n.id));
  const hasVpcSubnetLink = edges.some(
    (e) => (vpcIds.has(e.source) && subnetNodes.some((s) => s.id === e.target)) ||
           (vpcIds.has(e.target) && subnetNodes.some((s) => s.id === e.source))
  );

  if (!hasVpcSubnetLink) {
    return {
      valid: false,
      title: 'VPC & Subnet Disconnected',
      description: 'The Default Subnet must be connected to the Default VPC.',
    };
  }

  const adj = new Map<string, string[]>();
  nodes.forEach((n) => adj.set(n.id, []));
  edges.forEach((e) => {
    adj.get(e.source)?.push(e.target);
    adj.get(e.target)?.push(e.source);
  });

  const connected = new Set<string>(vpcIds);
  const queue = [...vpcIds];
  while (queue.length > 0) {
    const curr = queue.shift()!;
    for (const neighbor of adj.get(curr) || []) {
      if (!connected.has(neighbor)) {
        connected.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  const unconnected = nodes.filter((n) => !connected.has(n.id));
  if (unconnected.length > 0) {
    const names = unconnected.map((n) => n.data?.label || n.id).join(', ');
    return {
      valid: false,
      title: 'VPC Connection Required',
      description: `The following resources are not connected to the VPC & Subnet network: ${names}. Connect them before deploying.`,
    };
  }

  return { valid: true };
}
