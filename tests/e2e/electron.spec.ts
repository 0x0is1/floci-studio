import { test, expect, _electron as electron } from '@playwright/test';
import path from 'path';

test.describe('Electron Desktop Application', () => {
  test('launches splash screen and renders preflight interface at 80% screen', async () => {
    const electronDir = path.resolve(__dirname, '../../electron');
    const exePath = path.resolve(electronDir, 'node_modules/electron/dist/electron.exe');
    const cleanEnv = { ...process.env, PLAYWRIGHT_TEST: '1' };
    delete cleanEnv.ELECTRON_RUN_AS_NODE;

    const electronApp = await electron.launch({
      executablePath: exePath,
      args: [electronDir],
      env: cleanEnv,
    });

    const window = await electronApp.firstWindow();
    expect(await window.title()).toBe('Floci Studio');

    const metrics = await electronApp.evaluate(({ BrowserWindow, screen }) => {
      const win = BrowserWindow.getAllWindows()[0];
      const display = screen.getPrimaryDisplay();
      return {
        winWidth: win.getBounds().width,
        winHeight: win.getBounds().height,
        screenWidth: display.workAreaSize.width,
        screenHeight: display.workAreaSize.height,
        menuBarVisible: win.isMenuBarVisible(),
        fullScreenable: win.isFullScreenable(),
      };
    });

    expect(metrics.winWidth).toBeGreaterThan(700);
    expect(metrics.menuBarVisible).toBe(false);
    expect(metrics.fullScreenable).toBe(true);

    await window.waitForSelector('h1', { timeout: 15000 });
    const heading = await window.textContent('h1');
    expect(heading).toContain('Floci Studio');

    await window.waitForSelector('text=Bun Runtime');
    const appText = await window.textContent('body');
    expect(appText).toContain('Bun Runtime');
    expect(appText).toContain('Docker CLI');

    await electronApp.close();
  });
});
