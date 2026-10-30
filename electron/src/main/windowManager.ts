import { BrowserWindow } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

export function createSplashWindow(): BrowserWindow {
  const iconPath = path.join(__dirname, '../../assets/icon.ico');
  const preloadPath = path.join(__dirname, '../preload/index.js');
  mainWindow = new BrowserWindow({
    width: 580,
    height: 720,
    minWidth: 500,
    minHeight: 600,
    resizable: true,
    show: false,
    backgroundColor: '#09090b',
    icon: iconPath,
    title: 'Floci Studio',
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.once('ready-to-show', () => mainWindow?.show());

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, _errorDescription, validatedURL) => {
    if (errorCode === -3) return;
    const errorHtml = path.join(__dirname, '../../assets/error.html');
    mainWindow?.loadFile(errorHtml, { query: { url: validatedURL } });
  });

  return mainWindow;
}

export function launchMainStudio(): void {
  if (!mainWindow) return;
  mainWindow.loadURL('http://localhost:3000');
  mainWindow.setSize(1400, 900);
  mainWindow.center();
}
