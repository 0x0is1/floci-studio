import { describe, it, expect, afterAll } from 'bun:test';
import { rmSync } from 'node:fs';
import { join } from 'node:path';
import { config } from '../src/config/env';
import { saveTestFile, getTestDir } from '../src/services/testRunnerFileService';
import { runTests } from '../src/services/testRunnerExecService';
import { dockerReq } from '../src/services/dockerService';

const projectId = `tr-test-${Date.now()}`;
const nodeId = 'tr-node';

afterAll(() => {
  rmSync(join(config.dataDir, 'projects', projectId), { recursive: true, force: true });
});

describe('Test Runner node: file-backed Docker execution', () => {
  it('reports no recognized test files when the upload directory is empty', async () => {
    getTestDir(projectId, nodeId);
    const result = await runTests(projectId, nodeId, 'external');
    expect(result.success).toBe(false);
    expect(result.ran).toEqual([]);
  });

  it('runs an uploaded pytest file inside floci-testrunner and reports a pass', async () => {
    const ping = await dockerReq('GET', '/_ping');
    if (ping.status !== 200) return;
    const passing = 'def test_ok():\n    assert 1 + 1 == 2\n';
    await saveTestFile(projectId, nodeId, 'test_pass.py', new File([passing], 'test_pass.py'));
    const result = await runTests(projectId, nodeId, 'external');
    expect(result.ran).toContain('pytest');
    expect(result.success).toBe(true);
    expect(result.exitCode).toBe(0);
  }, 60000);

  it('runs an uploaded pytest file inside floci-testrunner and reports a failure', async () => {
    const ping = await dockerReq('GET', '/_ping');
    if (ping.status !== 200) return;
    const failingProject = `${projectId}-fail`;
    const failing = 'def test_bad():\n    assert 1 == 2\n';
    await saveTestFile(failingProject, nodeId, 'test_fail.py', new File([failing], 'test_fail.py'));
    const result = await runTests(failingProject, nodeId, 'external');
    expect(result.ran).toContain('pytest');
    expect(result.success).toBe(false);
    expect(result.exitCode).not.toBe(0);
    rmSync(join(config.dataDir, 'projects', failingProject), { recursive: true, force: true });
  }, 60000);
});
