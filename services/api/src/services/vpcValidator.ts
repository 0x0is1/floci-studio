import { CanvasNode, CanvasEdge } from '@/models/project';

export function getVpcConnectedNodeIds(nodes: CanvasNode[], edges: CanvasEdge[]): Set<string> {
  const vpcIds = nodes.filter((n) => n.data.serviceType === 'vpc').map((n) => n.id);
  const subnetIds = nodes.filter((n) => n.data.serviceType === 'subnet').map((n) => n.id);

  if (vpcIds.length === 0 || subnetIds.length === 0) return new Set<string>();

  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n.id, []);
  for (const e of edges) {
    adj.get(e.source)?.push(e.target);
    adj.get(e.target)?.push(e.source);
  }

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

  const hasSubnetInVpc = subnetIds.some((sId) => connected.has(sId));
  if (!hasSubnetInVpc) return new Set<string>();

  return connected;
}

export function isAttachedToVpc(nodeId: string, nodes: CanvasNode[], edges: CanvasEdge[]): boolean {
  return getVpcConnectedNodeIds(nodes, edges).has(nodeId);
}
