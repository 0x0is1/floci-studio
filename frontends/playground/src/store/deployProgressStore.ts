import { create } from 'zustand';

export type DeployNodeStatus = 'deploying' | 'running' | 'error' | 'skipped';

interface DeployProgressState {
  isDeploying: boolean;
  progress: Record<string, { status: DeployNodeStatus; error?: string }>;
  startDeploy: (nodeIds: string[]) => void;
  setNodeStatus: (nodeId: string, status: DeployNodeStatus, error?: string) => void;
  finishDeploy: () => void;
  reset: () => void;
}

export const useDeployProgressStore = create<DeployProgressState>((set) => ({
  isDeploying: false,
  progress: {},

  startDeploy: (nodeIds) =>
    set({
      isDeploying: true,
      progress: Object.fromEntries(nodeIds.map((id) => [id, { status: 'deploying' as const }])),
    }),
  setNodeStatus: (nodeId, status, error) =>
    set((s) => ({ progress: { ...s.progress, [nodeId]: { status, error } } })),
  finishDeploy: () => set({ isDeploying: false }),
  reset: () => set({ isDeploying: false, progress: {} }),
}));
