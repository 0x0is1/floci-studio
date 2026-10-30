import { app } from 'electron';
import path from 'path';
import { existsSync } from 'fs';
import { createSplashWindow } from '@/main/windowManager';
import { registerIpcHandlers } from '@/main/ipcRegistry';
import { cleanupProcesses } from '@/main/checks/serviceManager';

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.whenReady().then(() => {
    registerIpcHandlers();
    const win = createSplashWindow();

    const splashOut = path.join(__dirname, '../../splash/out/index.html');
    if (existsSync(splashOut)) {
      win.loadFile(splashOut);
    } else {
      win.loadURL('http://localhost:3002');
    }
  });

  app.on('window-all-closed', () => {
    cleanupProcesses();
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('before-quit', () => {
    cleanupProcesses();
  });
}
