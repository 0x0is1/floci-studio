import { CanvasNode, CanvasEdge } from '@/models/project';
import { sortNodesTopologically } from './dagSorter';
import { createLog, TerminalLog } from './loggerService';
import { getVpcConnectedNodeIds } from './vpcValidator';

export function checkVpcIsolation(nodes: CanvasNode[], edges: CanvasEdge[], logs: TerminalLog[]): { nodeId: string; error: string }[] | null {
  const vpcConnected = getVpcConnectedNodeIds(nodes, edges);
  const unconnected = nodes.filter((n) => !vpcConnected.has(n.id));
  if (unconnected.length === 0) return null;

  const names = unconnected.map((n) => n.data?.label || n.id).join(', ');
  const errMsg = `AWS Network Isolation Violation: [${names}] not connected to VPC & Subnet network. Deployment aborted. 0 resources provisioned.`;
  logs.push(createLog('system', 'vpc', 'error', `[VPC & SUBNET REQUIRED] ${errMsg}`));
  return nodes.map((n) => ({
    nodeId: n.id,
    error: unconnected.some((u) => u.id === n.id) ? errMsg : 'Aborted due to network isolation violation',
  }));
}

export function planExecutionOrder(
  nodes: CanvasNode[],
  edges: CanvasEdge[],
  logs: TerminalLog[]
): { ordered: ReturnType<typeof sortNodesTopologically> } | { error: string } {
  try {
    const ordered = sortNodesTopologically(nodes, edges);
    logs.push(createLog('system', 'orchestrator', 'info', `DAG planned: ${ordered.length} nodes execution order.`));
    return { ordered };
  } catch (err: any) {
    logs.push(createLog('system', 'orchestrator', 'error', `[CYCLE DETECTED] ${err.message}`));
    return { error: err.message };
  }
}
