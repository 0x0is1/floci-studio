import { describe, expect, it } from 'bun:test';
import { checkDockerInstalled, checkDockerRunning, checkBunInstalled, checkInternetConnection } from '@/main/checks/systemChecker';
import { checkNodeModulesExist } from '@/main/checks/nodeModulesChecker';
import { pingUrl, checkFrontendHealth } from '@/main/checks/healthChecker';

describe('Electron System Checkers', () => {
  it('detects bun runtime successfully', async () => {
    const res = await checkBunInstalled();
    expect(res.ok).toBe(true);
    expect(res.version).toBeDefined();
  });

  it('detects docker cli installation', async () => {
    const res = await checkDockerInstalled();
    expect(res.ok).toBe(true);
    expect(res.detail).toContain('Docker');
  });

  it('checks docker daemon running state', async () => {
    const res = await checkDockerRunning();
    expect(typeof res.ok).toBe('boolean');
  });

  it('checks internet connectivity without crashing', async () => {
    const res = await checkInternetConnection();
    expect(typeof res.ok).toBe('boolean');
    expect(res.detail).toBeDefined();
  });

  it('validates node_modules exist in backend and frontend', () => {
    const { backend, frontend, allExist } = checkNodeModulesExist();
    expect(typeof backend).toBe('boolean');
    expect(typeof frontend).toBe('boolean');
    expect(typeof allExist).toBe('boolean');
  });

  it('validates compiled static studio frontend bundle', async () => {
    const res = await checkFrontendHealth();
    expect(res.ok).toBe(true);
    expect(res.detail).toContain('Studio bundle verified');
  });

  it('handles unreachable urls gracefully without crashing', async () => {
    const result = await pingUrl('http://127.0.0.1:59999/unreachable', 200);
    expect(result).toBe(false);
  });
});


