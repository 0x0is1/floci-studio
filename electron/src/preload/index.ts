import { contextBridge, ipcRenderer } from 'electron';
import type { CheckStep } from '@/main/types';

contextBridge.exposeInMainWorld('electronAPI', {
  startChecks: (): Promise<boolean> => ipcRenderer.invoke('checks:start'),
  launchStudio: (): Promise<boolean> => ipcRenderer.invoke('checks:launch'),
  restartChecks: (): Promise<boolean> => ipcRenderer.invoke('app:restart-checks'),
  onCheckProgress: (callback: (step: CheckStep) => void): void => {
    ipcRenderer.on('check:progress', (_event, step) => callback(step));
  },
  offCheckProgress: (): void => {
    ipcRenderer.removeAllListeners('check:progress');
  },
});
