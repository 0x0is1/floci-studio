import { useState } from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useBottomTrayStore } from '@/store/bottomTrayStore';
import { useCanvasTabStore } from '@/store/canvasTabStore';
import { toast } from 'sonner';
import { validateVpcDeployment } from '@/lib/rules/vpcDeploymentValidator';
import { deployInfrastructure, teardownInfrastructure } from '@/lib/api/flociClient';
import { mutate } from 'swr';

export function useHeaderActions(healthState: string) {
  const { activeProjectId, saveCurrentProject, setExecuting, setDeployed, updateNodeStatus, nodes, edges } = usePlaygroundStore();
  const { setActiveTab, addLogs } = useBottomTrayStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const ok = await saveCurrentProject();
      if (ok) toast.success('Project Saved', { description: 'All configurations saved.' });
      else toast.error('Save Failed', { description: 'Backend service or Docker is offline.' });
    } finally { setIsSaving(false); }
  };

  const handleRefresh = async () => {
    if (!activeProjectId) return;
    setIsRefreshing(true);
    try {
      await Promise.all([
        mutate(`/api/projects/${activeProjectId}`),
        mutate('/api/projects'),
        mutate(`/api/orchestrator/runtime-state?projectId=${activeProjectId}`),
      ]);
      const ok = await usePlaygroundStore.getState().switchProject(activeProjectId);
      if (ok) {
        if (usePlaygroundStore.getState().isDeployed) useCanvasTabStore.getState().setActiveTab('deployed');
        toast.success('Project Refreshed', { description: 'Loaded latest state from disk.' });
      } else toast.error('Refresh Failed', { description: 'Could not load project state.' });
    } catch {
      toast.error('Refresh Failed', { description: 'Could not contact backend service.' });
    } finally { setIsRefreshing(false); }
  };

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
    setExecuting(true); setActiveTab('terminal');
    toast.info('Starting Deployment', { description: 'Executing DAG against Floci emulator...' });
    nodes.forEach((n) => updateNodeStatus(n.id, 'deploying'));
    try {
      const res = await deployInfrastructure(nodes, edges, activeProjectId);
      if (res?.logs?.length) addLogs(res.logs);
      if (res?.success && res.results) {
        const snap = nodes.map((n) => {
          const item = res.results.find((r: any) => r.nodeId === n.id);
          return item ? { ...n, data: { ...n.data, status: item.status, liveUrl: item.liveUrl, config: item.port ? { ...n.data.config, port: item.port } : n.data.config } } : { ...n, data: { ...n.data, status: 'draft' as const } };
        });
        usePlaygroundStore.getState().setDeployedState(snap, [...edges]);
        setDeployed(true); useCanvasTabStore.getState().setActiveTab('deployed');
        mutate(`/api/orchestrator/runtime-state?projectId=${activeProjectId}`);
        mutate(`/api/projects/${activeProjectId}`);
        toast.success('Deployment Complete', { description: 'AWS infrastructure is live on localhost!' });
      } else {
        toast.error('Deployment Failed', { description: res?.error || 'Docker services paused.' });
      }
    } catch (err: any) {
      toast.error('Deployment Failed', { description: err.message });
    } finally { setExecuting(false); }
  };

  const handleStop = async () => {
    if (!activeProjectId) return;
    setIsStopping(true);
    try {
      const ports = nodes.filter((n) => n.data.serviceType === 'ec2').map((n) => n.data.config?.port || 8080);
      const buckets = nodes.filter((n) => n.data.serviceType === 's3').map((n) => n.data.resourceId || n.data.config?.bucketName).filter(Boolean);
      const queues = nodes.filter((n) => n.data.serviceType === 'sqs').map((n) => n.data.resourceId || n.data.config?.queueName).filter(Boolean);
      await teardownInfrastructure({ ports, buckets, queues, projectId: activeProjectId }).catch(() => {});
      usePlaygroundStore.getState().clearDeployedState();
      useCanvasTabStore.getState().setActiveTab('editor');
      mutate(`/api/orchestrator/runtime-state?projectId=${activeProjectId}`);
      mutate(`/api/projects/${activeProjectId}`);
      await saveCurrentProject().catch(() => {});
      toast.info('Playground Reset', { description: 'Infrastructure stopped and canvas unfrozen.' });
    } finally { setIsStopping(false); }
  };

  return { isSaving, isStopping, isRefreshing, handleSave, handleRefresh, handleDeploy, handleStop };
}
