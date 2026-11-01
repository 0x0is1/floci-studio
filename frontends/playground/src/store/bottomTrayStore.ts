import { create } from 'zustand';
import { TerminalLog } from '@/types/aws';

export type BottomTabType = 'terminal' | 'live' | 'ec2-terminal';
export type LogFilterType = 'all' | 'commands' | 'errors' | 'docker';

interface BottomTrayState {
  isOpen: boolean;
  activeTab: BottomTabType;
  filter: LogFilterType;
  logs: TerminalLog[];

  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
  setActiveTab: (tab: BottomTabType) => void;
  setFilter: (filter: LogFilterType) => void;
  addLogs: (newLogs: TerminalLog[]) => void;
  setLogs: (logs: TerminalLog[]) => void;
  clearLogs: () => void;
  clearLogsForNodes: (nodeIds: string[]) => void;
}

export const useBottomTrayStore = create<BottomTrayState>((set) => ({
  isOpen: true,
  activeTab: 'terminal',
  filter: 'all',
  logs: [],

  setOpen: (open) => set({ isOpen: open }),
  toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
  setActiveTab: (activeTab) => set({ activeTab, isOpen: true }),
  setFilter: (filter) => set({ filter }),
  addLogs: (newLogs) => set((s) => ({ logs: [...s.logs, ...newLogs] })),
  setLogs: (logs) => set({ logs }),
  clearLogs: () => set({ logs: [] }),
  clearLogsForNodes: (nodeIds) => set((s) => ({ logs: s.logs.filter((l) => !nodeIds.includes(l.nodeId)) })),
}));
