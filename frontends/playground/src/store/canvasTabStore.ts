import { create } from 'zustand';

export type CanvasTab = 'editor' | 'deployed';

interface CanvasTabState {
  activeTab: CanvasTab;
  setActiveTab: (tab: CanvasTab) => void;
}

export const useCanvasTabStore = create<CanvasTabState>((set) => ({
  activeTab: 'editor',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
