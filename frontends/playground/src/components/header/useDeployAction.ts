import { usePlaygroundStore } from '@/store/playgroundStore';
import { useBottomTrayStore } from '@/store/bottomTrayStore';
import { toast } from 'sonner';
import { validateVpcDeployment } from '@/lib/rules/vpcDeploymentValidator';
import { deployInfrastructureStream } from '@/lib/api/deployStreamClient';
import { useDeployProgressStore } from '@/store/deployProgressStore';
import { mutate } from 'swr';

export function useDeployAction(healthState: string) {
  const { activeProjectId, setExecuting, setDeployed, nodes, edges } = usePlaygroundStore();
  const { addLogs } = useBottomTrayStore();

  const handleDeploy = async () => {
    if (!activeProjectId) return;
    if (healthState !== 'healthy') {
      toast.error('Deployment Blocked', { description: healthState === 'docker_not_running' ? 'Docker services paused.' : 'Backend is unreachable.' });
      return;
    }
    const vpcCheck = validateVpcDeployment(nodes as any, edges as any);
    if (!vpcCheck.valid) {
      toast.error(vpcCheck.title || 'VPC Connection Required', { description: vpcCheck.description });
      return;
    }
    setExecuting(true);
    toast.info('Starting Deployment', { description: 'Executing DAG against Floci emulator...' });
    const { startDeploy, setNodeStatus, finishDeploy, reset: resetProgress } = useDeployProgressStore.getState();
    startDeploy(nodes.map((n) => n.id));
    let allSucceeded = false;
    try {
      await deployInfrastructureStream(nodes, edges, activeProjectId, {
        onNode: (r) => setNodeStatus(r.nodeId, r.status as any, r.error),
        onDone: (payload) => {
          if (payload.logs?.length) addLogs(payload.logs);
          if (payload.success && payload.results) {
            allSucceeded = payload.results.every((r: any) => r.status === 'running');
            const snap = nodes.map((n) => {
              const item = payload.results!.find((r: any) => r.nodeId === n.id);
              return item ? { ...n, data: { ...n.data, status: item.status === 'skipped' ? 'error' : item.status, liveUrl: item.liveUrl, config: item.port ? { ...n.data.config, port: item.port } : n.data.config } } : { ...n, data: { ...n.data, status: 'draft' as const } };
            });
            usePlaygroundStore.getState().setDeployedState(snap, [...edges]);
            setDeployed(true);
            mutate(`/api/orchestrator/runtime-state?projectId=${activeProjectId}`);
            mutate(`/api/projects/${activeProjectId}`);
            if (allSucceeded) toast.success('Deployment Complete', { description: 'AWS infrastructure is live on localhost!' });
            else toast.error('Deployment Partially Failed', { description: 'Some resources failed or were skipped. Check the Live tab.' });
          } else {
            toast.error('Deployment Failed', { description: payload.error || 'Docker services paused.' });
          }
        },
      });
    } catch (err: any) {
      toast.error('Deployment Failed', { description: err.message });
    } finally {
      setExecuting(false);
      if (allSucceeded) resetProgress(); else finishDeploy();
    }
  };

  return { handleDeploy };
}
