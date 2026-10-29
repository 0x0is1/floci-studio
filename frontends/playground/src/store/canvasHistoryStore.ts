import { create } from 'zustand';
import { AppNode, AppEdge, usePlaygroundStore } from './playgroundStore';

interface CanvasSnapshot {
  nodes: AppNode[];
  edges: AppEdge[];
}

interface HistoryState {
  past: CanvasSnapshot[];
  future: CanvasSnapshot[];
  pushSnapshot: (nodes: AppNode[], edges: AppEdge[]) => void;
  undo: () => void;
  redo: () => void;
}

export const useCanvasHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],
  pushSnapshot: (nodes, edges) => {
    set((state) => ({
      past: [...state.past.slice(-25), { nodes, edges }],
      future: [],
    }));
  },
  undo: () => {
    const { past, future } = get();
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    const store = usePlaygroundStore.getState();
    const current: CanvasSnapshot = { nodes: store.nodes, edges: store.edges };

    set({ past: newPast, future: [current, ...future] });
    store.setNodes(previous.nodes);
    store.setEdges(previous.edges);
  },
  redo: () => {
    const { past, future } = get();
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);

    const store = usePlaygroundStore.getState();
    const current: CanvasSnapshot = { nodes: store.nodes, edges: store.edges };

    set({ past: [...past, current], future: newFuture });
    store.setNodes(next.nodes);
    store.setEdges(next.edges);
  },
}));

