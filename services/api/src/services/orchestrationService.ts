import { CanvasNode, CanvasEdge } from '@/models/project';
import { sortNodesTopologically } from './dagSorter';
import { createLog, TerminalLog } from './loggerService';
import { provisionResource } from './resourceProvisioner';
import { iamProvisioner } from './iamProvisioner';
import { getVpcConnectedNodeIds } from './vpcValidator';

export interface ProvisionResult {
  nodeId: string;
  status: 'running' | 'error' | 'draft';
  resourceId?: string;
  liveUrl?: string;
  port?: number;
  error?: string;
}

export class OrchestrationService {
  public async deployGraph(nodes: CanvasNode[], edges: CanvasEdge[], projectId?: string): Promise<{ results: ProvisionResult[]; logs: TerminalLog[] }> {
    const results: ProvisionResult[] = [];
    const logs: TerminalLog[] = [];
    const stateMap: Record<string, 'running' | 'error'> = {};
    const resourceMap: Record<string, string> = {};

    const vpcConnected = getVpcConnectedNodeIds(nodes, edges);
    const unconnected = nodes.filter((n) => !vpcConnected.has(n.id));
    if (unconnected.length > 0) {
      const names = unconnected.map((n) => n.data?.label || n.id).join(', ');
      const errMsg = `AWS Network Isolation Violation: [${names}] not connected to VPC & Subnet network. Deployment aborted. 0 resources provisioned.`;
      logs.push(createLog('system', 'vpc', 'error', `[VPC & SUBNET REQUIRED] ${errMsg}`));
      return {
        results: nodes.map((n) => ({
          nodeId: n.id,
          status: 'error',
          error: unconnected.some((u) => u.id === n.id) ? errMsg : 'Aborted due to network isolation violation',
        })),
        logs,
      };
    }

    const ordered = sortNodesTopologically(nodes, edges);
    logs.push(createLog('system', 'orchestrator', 'info', `DAG planned: ${ordered.length} nodes execution order.`));

    await iamProvisioner.provisionProjectIam(nodes, edges, logs);

    for (const item of ordered) {
      const { node, dependencies } = item;
      const type = node.data.serviceType;
      const config = node.data.config || {};
      const label = node.data.label || type;

      const failedDep = dependencies.find((d) => stateMap[d] === 'error');
      if (failedDep) {
        const errMsg = `Dependency '${failedDep}' failed. Blocking execution of '${label}'.`;
        logs.push(createLog(node.id, type, 'error', `[SEMAPHORE BLOCKED] ${errMsg}`));
        stateMap[node.id] = 'error';
        results.push({ nodeId: node.id, status: 'error', error: errMsg });
        continue;
      }

      logs.push(createLog(node.id, type, 'info', `Provisioning ${label}...`));

      try {
        const edgeList = edges.map((e) => ({ source: e.source, target: e.target, data: e.data }));
        const res = await provisionResource({ nodeId: node.id, type, label, config, resourceMap, edges: edgeList, projectId, nodes }, logs);
        if (res.resourceId) resourceMap[node.id] = res.resourceId;
        stateMap[node.id] = 'running';
        results.push({ nodeId: node.id, status: 'running', resourceId: res.resourceId, liveUrl: res.liveUrl, port: (res as any).port });
      } catch (err: any) {
        logs.push(createLog(node.id, type, 'error', `Provision failed for ${label}: ${err.message}`));
        stateMap[node.id] = 'error';
        results.push({ nodeId: node.id, status: 'error', error: err.message });
      }
    }

    logs.push(createLog('system', 'orchestrator', 'info', `Execution complete. Total events logged: ${logs.length}.`));
    return { results, logs };
  }
}

export const orchestrationService = new OrchestrationService();
