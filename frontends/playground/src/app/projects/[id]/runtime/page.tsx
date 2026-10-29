'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useCanvasTabStore } from '@/store/canvasTabStore';
import { useProjectData, useRuntimeStateData } from '@/hooks/useSwrApi';
import { ProjectRuntimeView } from '@/components/canvas/ProjectRuntimeView';
import { ProjectEditorView } from '@/components/canvas/ProjectEditorView';

export default function DedicatedProjectRuntimePage() {
  const params = useParams();
  const id = params?.id as string;
  const { switchProject, activeProjectId } = usePlaygroundStore();
  const { activeTab, setActiveTab } = useCanvasTabStore();
  useProjectData(id);
  useRuntimeStateData(id);

  useEffect(() => {
    document.title = activeTab === 'editor' ? 'Floci Studio | Editor' : 'Floci Studio | Runtime';
  }, [activeTab]);

  useEffect(() => {
    setActiveTab('deployed');
    if (id && activeProjectId !== id) {
      switchProject(id);
    }
  }, [id, activeProjectId, switchProject, setActiveTab]);

  return activeTab === 'editor' ? <ProjectEditorView /> : <ProjectRuntimeView />;
}
