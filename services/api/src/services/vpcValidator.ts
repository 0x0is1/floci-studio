import { CanvasNode, CanvasEdge } from '@/models/project';

const NETWORK_SERVICES = new Set(['ec2', 'rds', 'ecs', 'alb', 'elasticache', 'efs', 'subnet']);

export function requiresVpc(serviceType: string): boolean {
  return NETWORK_SERVICES.has(serviceType);
}

export function isAttachedToVpc(nodeId: string, nodes: CanvasNode[], edges: CanvasEdge[]): boolean {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const targetNode = nodeMap.get(nodeId);
  if (!targetNode) return false;
  if (targetNode.data.serviceType === 'vpc') return true;

  const connectedEdges = edges.filter((e) => e.source === nodeId || e.target === nodeId);
  for (const edge of connectedEdges) {
    const peerId = edge.source === nodeId ? edge.target : edge.source;
    const peer = nodeMap.get(peerId);
    if (peer?.data.serviceType === 'vpc') return true;
    if (peer?.data.serviceType === 'subnet') {
      const subnetEdges = edges.filter((e) => e.source === peerId || e.target === peerId);
      for (const se of subnetEdges) {
        const vpcPeerId = se.source === peerId ? se.target : se.source;
        if (nodeMap.get(vpcPeerId)?.data.serviceType === 'vpc') return true;
      }
    }
  }
  return false;
}

