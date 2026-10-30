import { app, protocol } from 'electron';
import path from 'path';
import { existsSync } from 'fs';
import { createSplashWindow, getMainWindow } from '@/main/windowManager';
import { registerIpcHandlers } from '@/main/ipcRegistry';
import { cleanupProcesses } from '@/main/checks/serviceManager';
import { setupAppProtocol, getSplashDir } from '@/main/protocolHandler';

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

const isTestEnv = process.env.NODE_ENV === 'test' || process.env.PLAYWRIGHT_TEST === '1';
const gotTheLock = isTestEnv ? true : app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.whenReady().then(() => {
    setupAppProtocol();
    registerIpcHandlers();
    const win = createSplashWindow();

    const splashIndex = path.join(getSplashDir(), 'index.html');
    if (existsSync(splashIndex)) {
      win.loadURL('app://splash/index.html');
    } else {
      win.loadURL('http://localhost:3002');
    }
  });

  app.on('second-instance', () => {
    const current = getMainWindow();
    if (current) {
      if (current.isMinimized()) current.restore();
      current.focus();
    }
  });

  app.on('window-all-closed', () => {
    cleanupProcesses();
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('before-quit', () => cleanupProcesses());
}
