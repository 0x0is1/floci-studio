import { listProjects, getProject, saveProject, createProject, deleteProject, fetchRuntimeState } from '@/lib/api/flociClient';
import { reconcileNodeStates } from '@/lib/state/stateRecovery';
import { useBottomTrayStore } from '@/store/bottomTrayStore';
import { mutate } from 'swr';

export interface ProjectStateSlice {
  projects: Array<{ id: string; name: string; updatedAt: string; status: string }>;
  activeProjectId: string | null;
  projectName: string;
  isDirty: boolean;
  loadProjects: () => Promise<void>;
  switchProject: (id: string) => Promise<boolean>;
  closeProject: (skipConfirm?: boolean) => void;
  createNewProject: (name: string) => Promise<boolean>;
  deleteProjectById: (id: string) => Promise<boolean>;
  saveCurrentProject: () => Promise<boolean>;
}

export const createProjectSlice = (set: any, get: any) => ({
  projects: [],
  activeProjectId: null,
  projectName: '',
  isDirty: false,

  loadProjects: async () => {
    const res = await listProjects();
    if (res?.success && Array.isArray(res.data)) set({ projects: res.data });
  },

  switchProject: async (id: string): Promise<boolean> => {
    const res = await getProject(id);
    if (res?.success && res.data) {
      const runtime = await fetchRuntimeState(id).catch(() => null);
      const { nodes: updatedNodes, isDeployed } = reconcileNodeStates(res.data.nodes || [], runtime, res.data.edges || [], res.data.status);
      useBottomTrayStore.getState().setLogs(res.data.logs || []);
      set({
        activeProjectId: id, projectName: res.data.name,
        nodes: updatedNodes, edges: res.data.edges || [],
        isDeployed, isDirty: false, selectedNodeId: null, selectedEdgeId: null,
      });
      return true;
    }
    return false;
  },

  closeProject: (skipConfirm?: boolean) => {
    const { isDirty, isDeployed } = get();
    if (!skipConfirm && (isDirty || isDeployed)) {
      const ok = typeof window !== 'undefined' ? window.confirm('You have unsaved changes or active infrastructure. Do you want to leave this project?') : true;
      if (!ok) return;
    }
    useBottomTrayStore.getState().clearLogs();
    set({
      activeProjectId: null, projectName: '',
      nodes: [], edges: [], isDeployed: false, isDirty: false, selectedNodeId: null, selectedEdgeId: null,
    });
  },

  createNewProject: async (name: string): Promise<boolean> => {
    const res = await createProject(name);
    if (res?.success && res.data?.id) {
      mutate('/api/projects');
      await get().loadProjects();
      await get().switchProject(res.data.id);
      return true;
    }
    return false;
  },

  deleteProjectById: async (id: string): Promise<boolean> => {
    const res = await deleteProject(id);
    mutate('/api/projects');
    if (get().activeProjectId === id) get().closeProject(true);
    await get().loadProjects();
    return Boolean(res?.success);
  },

  saveCurrentProject: async (): Promise<boolean> => {
    const { activeProjectId, projectName, nodes, edges, isDeployed } = get();
    if (!activeProjectId) return false;
    const now = new Date().toISOString();
    const currentLogs = useBottomTrayStore.getState().logs || [];
    const res = await saveProject({
      id: activeProjectId, name: projectName, nodes, edges,
      createdAt: now, updatedAt: now, status: isDeployed ? 'running' : 'draft',
      logs: currentLogs,
    });
    if (res?.success) {
      set({ isDirty: false });
      mutate('/api/projects');
      mutate(`/api/projects/${activeProjectId}`);
      await get().loadProjects();
      return true;
    }
    return false;
  },
});
