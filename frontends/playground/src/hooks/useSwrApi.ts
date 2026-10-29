'use client';

import useSWR, { mutate } from 'swr';
import { fetchHealth, fetchRuntimeState, listProjects, getProject } from '@/lib/api/flociClient';

export function useFlociHealth() {
  return useSWR('/api/health', fetchHealth, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  });
}

export function useProjects() {
  const swr = useSWR('/api/projects', listProjects, {
    revalidateOnFocus: true,
    dedupingInterval: 2000,
  });

  const invalidateProjects = () => mutate('/api/projects');

  return {
    ...swr,
    projects: swr.data?.success && Array.isArray(swr.data.data) ? swr.data.data : [],
    invalidateProjects,
  };
}

export function useProjectData(projectId: string | null) {
  const key = projectId ? `/api/projects/${projectId}` : null;
  const swr = useSWR(key, () => (projectId ? getProject(projectId) : null), {
    revalidateOnFocus: false,
    dedupingInterval: 1000,
  });

  const invalidateProject = () => { if (key) mutate(key); };

  return {
    ...swr,
    project: swr.data?.success ? swr.data.data : null,
    invalidateProject,
  };
}

export function useRuntimeStateData(projectId?: string | null) {
  const key = projectId ? `/api/orchestrator/runtime-state?projectId=${projectId}` : '/api/orchestrator/runtime-state';
  const swr = useSWR(key, () => fetchRuntimeState(projectId || undefined), {
    refreshInterval: 4000,
    revalidateOnFocus: true,
  });

  const invalidateRuntime = () => mutate(key);

  return {
    ...swr,
    runtime: swr.data?.success ? swr.data : null,
    invalidateRuntime,
  };
}

