import { create } from 'zustand';

interface CanvasHoverState {
  hoveredNodeId: string | null;
  setHoveredNodeId: (id: string | null) => void;
}

export const useCanvasHoverStore = create<CanvasHoverState>((set) => ({
  hoveredNodeId: null,
  setHoveredNodeId: (id) => set({ hoveredNodeId: id }),
}));
