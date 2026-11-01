import { useState } from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useBottomTrayStore } from '@/store/bottomTrayStore';
import { useCanvasTabStore } from '@/store/canvasTabStore';
import { toast } from 'sonner';
import { teardownInfrastructure } from '@/lib/api/flociClient';
import { useDeployProgressStore } from '@/store/deployProgressStore';
import { useDeployAction } from './useDeployAction';
import { mutate } from 'swr';

export function useHeaderActions(healthState: string) {
  const { activeProjectId, saveCurrentProject, nodes } = usePlaygroundStore();
  const { clearLogsForNodes } = useBottomTrayStore();
  const { handleDeploy } = useDeployAction(healthState);
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

  const handleStop = async () => {
    if (!activeProjectId) return;
    setIsStopping(true);
    try {
      const byType = (type: string, key: string) => nodes.filter((n) => n.data.serviceType === type).map((n) => n.data.config?.[key]).filter(Boolean);
      const ports = nodes.filter((n) => n.data.serviceType === 'ec2').map((n) => n.data.config?.port || 8080);
      const buckets = byType('s3', 'bucketName');
      const queues = byType('sqs', 'queueName');
      const tables = byType('dynamodb', 'tableName');
      const rdsInstances = byType('rds', 'dbName');
      const lambdaFunctions = byType('lambda', 'functionName');
      const snsTopics = byType('sns', 'topicName');
      const secrets = byType('secretsmanager', 'secretName');
      const logGroups = byType('logs', 'logGroupName');
      const eventBuses = byType('events', 'busName');
      const kinesisStreams = byType('kinesis', 'streamName');
      const stateMachines = byType('states', 'stateMachineName');
      let teardownFailed = false;
      await teardownInfrastructure({
        ports, buckets, queues, tables, rdsInstances, lambdaFunctions, snsTopics, secrets, logGroups, eventBuses,
        kinesisStreams, stateMachines,
        projectId: activeProjectId,
      }).catch(() => { teardownFailed = true; });
      usePlaygroundStore.getState().clearDeployedState();
      useDeployProgressStore.getState().reset();
      const ec2NodeIds = nodes.filter((n) => n.data.serviceType === 'ec2').map((n) => n.id);
      clearLogsForNodes(ec2NodeIds);
      useCanvasTabStore.getState().setActiveTab('editor');
      mutate(`/api/orchestrator/runtime-state?projectId=${activeProjectId}`);
      mutate(`/api/projects/${activeProjectId}`);
      await saveCurrentProject().catch(() => {});
      if (teardownFailed) toast.error('Teardown Incomplete', { description: 'Backend could not confirm resources were removed. Check Docker/Floci status.' });
      else toast.info('Playground Reset', { description: 'Infrastructure stopped and canvas unfrozen.' });
    } finally { setIsStopping(false); }
  };

  return { isSaving, isStopping, isRefreshing, handleSave, handleRefresh, handleDeploy, handleStop };
}
