'use client';

import React, { useState } from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useBottomTrayStore } from '@/store/bottomTrayStore';
import { useCanvasTabStore } from '@/store/canvasTabStore';
import { useTheme } from '@/theme/ThemeProvider';
import { useServiceHealth } from '@/context/ServiceHealthContext';
import { PlaygroundHeaderNav } from './PlaygroundHeaderNav';
import { PlaygroundHeaderControls } from './PlaygroundHeaderControls';
import { toast } from 'sonner';
import { deployInfrastructure, teardownInfrastructure } from '@/lib/api/flociClient';
import { mutate } from 'swr';

export function PlaygroundHeader() {
  const { activeProjectId, isDirty, saveCurrentProject, isExecuting, setExecuting, isDeployed, setDeployed, updateNodeStatus, nodes, edges } = usePlaygroundStore();
  const { setActiveTab, addLogs } = useBottomTrayStore();
  const { healthState } = useServiceHealth();
  const { tokens } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const ok = await saveCurrentProject();
      if (ok) toast.success('Project Saved', { description: 'All configurations saved.' });
      else toast.error('Save Failed', { description: 'Backend service or Docker is offline.' });
    } finally { setIsSaving(false); }
  };

  const handleDeploy = async () => {
    if (!activeProjectId) return;
    if (healthState !== 'healthy') {
      toast.error('Deployment Blocked', { description: healthState === 'docker_not_running' ? 'Docker services paused.' : 'Backend is unreachable.' });
      return;
    }
    setExecuting(true); setActiveTab('terminal');
    toast.info('Starting Deployment', { description: 'Executing DAG against Floci emulator...' });
    nodes.forEach((n) => updateNodeStatus(n.id, 'deploying'));
    try {
      const res = await deployInfrastructure(nodes, edges, activeProjectId);
      if (res?.logs?.length) addLogs(res.logs);
      if (res?.success && res.results) {
        res.results.forEach((item: any) => updateNodeStatus(item.nodeId, item.status, item.liveUrl, item.port));
        setDeployed(true);
        useCanvasTabStore.getState().setActiveTab('deployed');
        mutate(`/api/orchestrator/runtime-state?projectId=${activeProjectId}`);
        mutate(`/api/projects/${activeProjectId}`);
        await saveCurrentProject().catch(() => {});
        toast.success('Deployment Complete', { description: 'AWS infrastructure is live on localhost!' });
      } else {
        nodes.forEach((n) => updateNodeStatus(n.id, 'error'));
        toast.error('Deployment Failed', { description: res?.error || 'Docker services paused or inactive.' });
      }
    } catch (err: any) {
      nodes.forEach((n) => updateNodeStatus(n.id, 'error'));
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
      usePlaygroundStore.setState({
        nodes: nodes.map((n) => ({ ...n, data: { ...n.data, status: 'draft' as const, liveUrl: undefined } })),
        isDeployed: false, isExecuting: false,
      });
      useCanvasTabStore.getState().setActiveTab('editor');
      mutate(`/api/orchestrator/runtime-state?projectId=${activeProjectId}`);
      mutate(`/api/projects/${activeProjectId}`);
      await saveCurrentProject().catch(() => {});
      toast.info('Playground Reset', { description: 'Infrastructure stopped and canvas unfrozen.' });
    } finally { setIsStopping(false); }
  };

  return (
    <header className="h-12 border-b px-4 flex items-center justify-between shrink-0 transition-colors sticky top-0 z-30" style={{ backgroundColor: tokens.headerBg, borderColor: tokens.border }}>
      <PlaygroundHeaderNav />
      <PlaygroundHeaderControls
        healthState={healthState} isExecuting={isExecuting} isDeployed={isDeployed} isDirty={isDirty}
        isSaving={isSaving} isStopping={isStopping} hasProject={Boolean(activeProjectId)} nodeCount={nodes.length}
        onSave={handleSave} onDeploy={handleDeploy} onStop={handleStop}
      />
    </header>
  );
}
