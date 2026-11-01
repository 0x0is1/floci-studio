import { execSync } from 'node:child_process';
import path from 'node:path';

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const FIXTURE = 'services/data/projects/proj-starter.json';

/** Restores the shared proj-starter fixture to its committed state so canvas-mutating specs never leak nodes/edges across test runs. */
export function resetStarterFixture() {
  execSync(`git checkout -- ${FIXTURE}`, { cwd: REPO_ROOT });
}
