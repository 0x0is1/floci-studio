'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useCanvasTabStore } from '@/store/canvasTabStore';
import { useProjectData } from '@/hooks/useSwrApi';
import { ProjectEditorView } from '@/components/canvas/ProjectEditorView';
import { ProjectRuntimeView } from '@/components/canvas/ProjectRuntimeView';
import { toast } from 'sonner';

export function DedicatedProjectEditorClient() {
  const params = useParams();
  const paramId = params?.id as string | undefined;
  const pathId = typeof window !== 'undefined' ? window.location.pathname.match(/\/projects\/([^/]+)/)?.[1] : undefined;
  const id = (paramId && paramId !== 'default' ? paramId : pathId) || usePlaygroundStore.getState().activeProjectId || '';

  const { switchProject, activeProjectId } = usePlaygroundStore();
  const { activeTab, setActiveTab } = useCanvasTabStore();
  useProjectData(id);

  useEffect(() => {
    document.title = activeTab === 'deployed' ? 'Floci Studio | Runtime' : 'Floci Studio | Editor';
  }, [activeTab]);

  useEffect(() => {
    setActiveTab('editor');
    if (id && activeProjectId !== id) {
      switchProject(id).then((ok) => {
        if (!ok) toast.error('Failed to load project', { description: 'Backend service or Docker is offline.' });
      });
    }
  }, [id, activeProjectId, switchProject, setActiveTab]);

  return activeTab === 'deployed' ? <ProjectRuntimeView /> : <ProjectEditorView />;
}
