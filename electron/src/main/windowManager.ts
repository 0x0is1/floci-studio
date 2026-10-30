import { BrowserWindow, screen, Menu, app } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

export function createSplashWindow(): BrowserWindow {
  const appDir = app.getAppPath();
  const iconPath = path.join(appDir, 'assets/icon.ico');
  const preloadPath = path.join(appDir, 'dist/preload/index.js');

  Menu.setApplicationMenu(null);

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const winWidth = Math.round(width * 0.8);
  const winHeight = Math.round(height * 0.8);

  mainWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    minWidth: 800,
    minHeight: 600,
    center: true,
    resizable: true,
    fullscreenable: true,
    autoHideMenuBar: true,
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

  mainWindow.removeMenu();
  mainWindow.setMenu(null);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.once('ready-to-show', () => mainWindow?.show());

  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F11' && input.type === 'keyDown') {
      mainWindow?.setFullScreen(!mainWindow.isFullScreen());
      event.preventDefault();
    }
  });

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, _errorDescription, validatedURL) => {
    if (errorCode === -3) return;
    const errorHtml = path.join(appDir, 'assets/error.html');
    mainWindow?.loadFile(errorHtml, { query: { url: validatedURL } });
  });

  return mainWindow;
}

export function launchMainStudio(): void {
  if (!mainWindow) return;
  mainWindow.loadURL('http://localhost:3000');
}
