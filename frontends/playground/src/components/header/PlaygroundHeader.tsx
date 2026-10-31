'use client';

import React from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { useServiceHealth } from '@/context/ServiceHealthContext';
import { PlaygroundHeaderNav } from './PlaygroundHeaderNav';
import { PlaygroundHeaderControls } from './PlaygroundHeaderControls';
import { useHeaderActions } from './useHeaderActions';

export function PlaygroundHeader() {
  const { activeProjectId, isDirty, isExecuting, isDeployed, nodes } = usePlaygroundStore();
  const { healthState } = useServiceHealth();
  const { tokens } = useTheme();
  const { isSaving, isStopping, isRefreshing, handleSave, handleRefresh, handleDeploy, handleStop } = useHeaderActions(healthState);

  return (
    <header className="h-12 border-b px-4 flex items-center justify-between shrink-0 transition-colors sticky top-0 z-30" style={{ backgroundColor: tokens.headerBg, borderColor: tokens.border }}>
      <PlaygroundHeaderNav />
      <PlaygroundHeaderControls
        healthState={healthState} isExecuting={isExecuting} isDeployed={isDeployed} isDirty={isDirty}
        isSaving={isSaving} isStopping={isStopping} isRefreshing={isRefreshing} hasProject={Boolean(activeProjectId)} nodeCount={nodes.length}
        onSave={handleSave} onRefresh={handleRefresh} onDeploy={handleDeploy} onStop={handleStop}
      />
    </header>
  );
}
