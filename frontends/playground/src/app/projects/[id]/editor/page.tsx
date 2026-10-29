'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useCanvasTabStore } from '@/store/canvasTabStore';
import { useProjectData } from '@/hooks/useSwrApi';
import { ProjectEditorView } from '@/components/canvas/ProjectEditorView';
import { ProjectRuntimeView } from '@/components/canvas/ProjectRuntimeView';

export default function DedicatedProjectEditorPage() {
  const params = useParams();
  const id = params?.id as string;
  const { switchProject, activeProjectId } = usePlaygroundStore();
  const { activeTab, setActiveTab } = useCanvasTabStore();
  useProjectData(id);

  useEffect(() => {
    document.title = activeTab === 'deployed' ? 'Floci Studio | Runtime' : 'Floci Studio | Editor';
  }, [activeTab]);

  useEffect(() => {
    setActiveTab('editor');
    if (id && activeProjectId !== id) {
      switchProject(id);
    }
  }, [id, activeProjectId, switchProject, setActiveTab]);

  return activeTab === 'deployed' ? <ProjectRuntimeView /> : <ProjectEditorView />;
}
