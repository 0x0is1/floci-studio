import { CanvasNode, CanvasEdge } from '@/models/project';
import { createLog, TerminalLog } from './loggerService';
import { provisionResource } from './resourceProvisioner';
import { iamProvisioner } from './iamProvisioner';
import { checkVpcIsolation, planExecutionOrder } from './deployPreflight';

export interface ProvisionResult {
  nodeId: string;
  status: 'running' | 'error' | 'draft' | 'skipped';
  resourceId?: string;
  liveUrl?: string;
  port?: number;
  error?: string;
}

export type DeployProgressListener = (result: ProvisionResult) => void;

export class OrchestrationService {
  public async deployGraph(
    nodes: CanvasNode[],
    edges: CanvasEdge[],
    projectId?: string,
    onProgress?: DeployProgressListener
  ): Promise<{ results: ProvisionResult[]; logs: TerminalLog[] }> {
    const results: ProvisionResult[] = [];
    const logs: TerminalLog[] = [];
    const stateMap: Record<string, 'running' | 'error'> = {};
    const resourceMap: Record<string, string> = {};
    const portMap: Record<string, number> = {};
    const emit = (r: ProvisionResult) => { results.push(r); onProgress?.(r); };
    let hasFailed = false;

    const isolationErrors = checkVpcIsolation(nodes, edges, logs);
    if (isolationErrors) {
      for (const e of isolationErrors) emit({ nodeId: e.nodeId, status: 'error', error: e.error });
      return { results, logs };
    }

    const plan = planExecutionOrder(nodes, edges, logs);
    if ('error' in plan) {
      for (const n of nodes) emit({ nodeId: n.id, status: 'error', error: plan.error });
      return { results, logs };
    }

    await iamProvisioner.provisionProjectIam(nodes, edges, logs);

    for (const item of plan.ordered) {
      const { node, dependencies } = item;
      const type = node.data.serviceType;
      const config = node.data.config || {};
      const label = node.data.label || type;

      if (hasFailed) {
        const errMsg = `Skipped: deployment aborted after an earlier failure.`;
        logs.push(createLog(node.id, type, 'warn', `[SKIPPED] ${label}: ${errMsg}`));
        stateMap[node.id] = 'error';
        emit({ nodeId: node.id, status: 'skipped', error: errMsg });
        continue;
      }

      const failedDep = dependencies.find((d) => stateMap[d] === 'error');
      if (failedDep) {
        const errMsg = `Dependency '${failedDep}' failed. Blocking execution of '${label}'.`;
        logs.push(createLog(node.id, type, 'error', `[SEMAPHORE BLOCKED] ${errMsg}`));
        stateMap[node.id] = 'error';
        hasFailed = true;
        emit({ nodeId: node.id, status: 'error', error: errMsg });
        continue;
      }

      logs.push(createLog(node.id, type, 'info', `Provisioning ${label}...`));

      try {
        const edgeList = edges.map((e) => ({ source: e.source, target: e.target, data: e.data }));
        const res = await provisionResource({ nodeId: node.id, type, label, config, resourceMap, portMap, edges: edgeList, projectId, nodes }, logs);
        if (res.resourceId) resourceMap[node.id] = res.resourceId;
        if ((res as any).port) portMap[node.id] = (res as any).port;
        stateMap[node.id] = 'running';
        emit({ nodeId: node.id, status: 'running', resourceId: res.resourceId, liveUrl: (res as any).liveUrl, port: (res as any).port });
      } catch (err: any) {
        logs.push(createLog(node.id, type, 'error', `Provision failed for ${label}: ${err.message}`));
        stateMap[node.id] = 'error';
        hasFailed = true;
        emit({ nodeId: node.id, status: 'error', error: err.message });
      }
    }

    logs.push(createLog('system', 'orchestrator', 'info', `Execution complete. Total events logged: ${logs.length}.`));
    return { results, logs };
  }
}

export const orchestrationService = new OrchestrationService();
