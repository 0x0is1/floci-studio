import { projectService } from './projectService';
import { ProvisionResult } from './orchestrationService';
import { TerminalLog } from './loggerService';

export function persistDeployResult(projectId: string | undefined, nodes: any[], edges: any[], results: ProvisionResult[], logs: TerminalLog[]): void {
  if (!projectId) return;
  const proj = projectService.getProject(projectId);
  if (!proj) return;

  const deployedNodes = (nodes || []).map((n: any) => {
    const r = results.find((res) => res.nodeId === n.id);
    return r ? { ...n, data: { ...n.data, status: r.status === 'skipped' ? 'error' : r.status, liveUrl: r.liveUrl } } : n;
  });
  projectService.saveProject({ ...proj, deployedNodes, deployedEdges: edges || [], logs, status: 'running' });
}
