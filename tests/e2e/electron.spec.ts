import { test, expect, _electron as electron } from '@playwright/test';
import path from 'path';

test.describe('Electron Desktop Application', () => {
  test('launches splash screen and renders preflight interface', async () => {
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

    const metrics = await electronApp.evaluate(({ BrowserWindow }) => {
      const win = BrowserWindow.getAllWindows()[0];
      return {
        winWidth: win.getBounds().width,
        winHeight: win.getBounds().height,
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

    await window.waitForSelector('text=Docker CLI');
    const appText = await window.textContent('body');
    expect(appText).toContain('Docker CLI');
    expect(appText).toContain('Docker Engine');

    await electronApp.close();
  });

  test('loads static studio HTML interface under app:// protocol', async () => {
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
    await window.goto('app://studio/index.html');
    await window.waitForLoadState('domcontentloaded');

    const url = window.url();
    expect(url).toContain('app://studio');

    await electronApp.close();
  });
});
