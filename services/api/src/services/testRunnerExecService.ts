import { dockerReq } from './dockerService';
import { parseDockerStream } from './dockerStreamParser';
import { readTestFilesForRun } from './testRunnerFileService';

export interface TestRunResult {
  success: boolean;
  ran: string[];
  output: string;
  exitCode: number;
}

const EXIT_MARKER = 'FLOCI_TESTRUNNER_EXIT';
const POLL_INTERVAL_MS = 1000;
const MAX_WAIT_MS = 180000;

function buildRunScript(files: Array<{ name: string }>): { script: string; ran: string[] } {
  const names = files.map((f) => f.name);
  const steps: string[] = [];
  const ran: string[] = [];

  if (names.includes('main.py')) {
    steps.push(`python main.py`);
    ran.push('main.py');
  }
  if (names.some((n) => n.startsWith('test_') && n.endsWith('.py')) || names.includes('conftest.py')) {
    steps.push(`pytest -v`);
    ran.push('pytest');
  }
  if (names.some((n) => n.endsWith('.hurl'))) {
    steps.push(`hurl --test *.hurl`);
    ran.push('hurl');
  }

  const body = steps.map((s) => `${s}; [ $? -ne 0 ] && RC=1`).join('\n');
  const script = `cd /tests\nRC=0\n${body}\necho ${EXIT_MARKER}:$RC`;
  return { script, ran };
}

async function waitForExit(containerId: string): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < MAX_WAIT_MS) {
    const res = await dockerReq('GET', `/containers/${containerId}/json`);
    if (res.body?.State?.Status === 'exited') return;
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
}

export async function runTests(projectId: string, nodeId: string, networkAccess: string): Promise<TestRunResult> {
  const files = readTestFilesForRun(projectId, nodeId);
  const { script, ran } = buildRunScript(files);

  if (ran.length === 0) {
    return { success: false, ran: [], output: 'No recognized test files found (expected main.py, test_*.py/conftest.py, or *.hurl).', exitCode: 1 };
  }

  const writeLines = files
    .map((f) => `echo '${f.content.toString('base64')}' | base64 -d > '/tests/${f.name}'`)
    .join(' && ');

  const containerName = `floci-testrunner-${projectId}-${nodeId}-${Date.now()}`;
  const cmd = ['sh', '-c', `mkdir -p /tests && ${writeLines} && ${script}`];

  const createRes = await dockerReq('POST', `/containers/create?name=${containerName}`, {
    Image: 'floci-testrunner:latest',
    Cmd: cmd,
    Labels: { 'floci.project': projectId, 'floci.node': nodeId, 'floci.kind': 'testrunner' },
    HostConfig: {
      NetworkMode: networkAccess === 'vpc_only' ? 'oss_floci_net' : 'bridge',
      AutoRemove: false,
    },
  });

  if (createRes.status !== 201 || !createRes.body?.Id) {
    return { success: false, ran, output: 'Error: failed to create test runner container.', exitCode: 1 };
  }
  const containerId = createRes.body.Id;

  await dockerReq('POST', `/containers/${containerId}/start`);
  await waitForExit(containerId);

  const logsRes = await dockerReq('GET', `/containers/${containerId}/logs?stdout=true&stderr=true`);
  const rawOutput = parseDockerStream(logsRes.body);
  await dockerReq('DELETE', `/containers/${containerId}?force=true`);

  const markerMatch = rawOutput.match(new RegExp(`${EXIT_MARKER}:(\\d+)`));
  const exitCode = markerMatch ? Number(markerMatch[1]) : 1;
  const output = rawOutput.replace(new RegExp(`${EXIT_MARKER}:\\d+\\n?`), '').trim();

  return { success: exitCode === 0, ran, output, exitCode };
}
