import { app, protocol, net } from 'electron';
import path from 'path';
import { pathToFileURL } from 'url';
import { existsSync } from 'fs';
import { createSplashWindow } from '@/main/windowManager';
import { registerIpcHandlers } from '@/main/ipcRegistry';
import { cleanupProcesses } from '@/main/checks/serviceManager';

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
    const splashOut = path.join(app.getAppPath(), 'splash/out');

    protocol.handle('app', (request) => {
      const parsed = new URL(request.url);
      let pathname = decodeURIComponent(parsed.pathname);
      if (!pathname || pathname === '/') {
        pathname = '/index.html';
      }
      const targetFile = path.join(splashOut, pathname);
      return net.fetch(pathToFileURL(targetFile).toString());
    });

    registerIpcHandlers();
    const win = createSplashWindow();

    if (existsSync(path.join(splashOut, 'index.html'))) {
      win.loadURL('app://studio/index.html');
    } else {
      win.loadURL('http://localhost:3002');
    }
  });

  app.on('window-all-closed', () => {
    cleanupProcesses();
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('before-quit', () => cleanupProcesses());
}
