import { create } from 'zustand';

export interface CommandEntry {
  id: string;
  prompt: string;
  command: string;
  output: string;
}

interface Ec2SessionState {
  history: CommandEntry[];
  addCommand: (entry: CommandEntry) => void;
  clearHistory: () => void;
}

export const useEc2SessionStore = create<Ec2SessionState>((set) => ({
  history: [],
  addCommand: (entry) => set((s) => ({ history: [...s.history, entry] })),
  clearHistory: () => set({ history: [] }),
}));
