import { ipcMain, shell } from 'electron';
import { runFullPreflight } from '@/main/checks/orchestrateChecks';
import { getMainWindow, launchMainStudio } from '@/main/windowManager';
import type { CheckStep } from '@/main/types';

export function registerIpcHandlers(): void {
  ipcMain.handle('checks:start', async () => {
    const win = getMainWindow();
    const success = await runFullPreflight((step: CheckStep) => {
      win?.webContents.send('check:progress', step);
    });
    return success;
  });

  ipcMain.handle('checks:launch', () => {
    launchMainStudio();
    return true;
  });

  ipcMain.handle('app:restart-checks', async () => {
    const win = getMainWindow();
    const success = await runFullPreflight((step: CheckStep) => {
      win?.webContents.send('check:progress', step);
    });
    return success;
  });

  ipcMain.handle('app:open-external', async (_event, url: string) => {
    if (typeof url === 'string' && /^(https?|mailto):/i.test(url)) {
      await shell.openExternal(url);
      return true;
    }
    return false;
  });
}

