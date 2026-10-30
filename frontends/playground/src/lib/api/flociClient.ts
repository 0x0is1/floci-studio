import { API_BASE, safeFetch } from './flociFetch';

export async function fetchHealth() {
  const res = await safeFetch('/api/health', { cache: 'no-store' }, 2000);
  return res.ok && res.data ? res.data : { status: 'unreachable', error: res.error };
}

export async function fetchRuntimeState(projectId?: string) {
  const endpoint = projectId
    ? `/api/orchestrator/runtime-state?projectId=${encodeURIComponent(projectId)}`
    : '/api/orchestrator/runtime-state';
  const res = await safeFetch(endpoint, { cache: 'no-store' }, 3000);
  return res.ok && res.data ? res.data : { success: false, error: res.error };
}

export async function listProjects() {
  const res = await safeFetch('/api/projects', { cache: 'no-store' }, 3000);
  return res.ok && res.data ? res.data : { success: false, data: [], error: res.error };
}

export async function getProject(id: string) {
  const res = await safeFetch(`/api/projects/${id}`, { cache: 'no-store' }, 3000);
  return res.ok && res.data ? res.data : { success: false, error: res.error };
}

export async function createProject(name: string, description?: string) {
  const res = await safeFetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description }),
  }, 4000);
  return res.ok && res.data ? res.data : { success: false, error: res.error };
}

export async function saveProject(project: any) {
  const res = await safeFetch(`/api/projects/${project.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  }, 4000);
  return res.ok && res.data ? res.data : { success: false, error: res.error };
}

export async function deleteProject(id: string) {
  const res = await safeFetch(`/api/projects/${id}`, { method: 'DELETE' }, 4000);
  return res.ok && res.data ? res.data : { success: false, error: res.error };
}

export async function deployInfrastructure(nodes: any[], edges: any[], projectId?: string) {
  const res = await safeFetch('/api/orchestrator/deploy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nodes, edges, projectId }),
  }, 10000);
  return res.ok && res.data ? res.data : { success: false, error: res.error };
}

export async function teardownInfrastructure(params: any) {
  const body = Array.isArray(params) ? { ports: params } : params;
  const res = await safeFetch('/api/orchestrator/teardown', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }, 10000);
  return res.ok && res.data ? res.data : { success: false, error: res.error };
}

export async function listEc2Keys(projectId: string) {
  const res = await safeFetch(`/api/ec2/keys/${projectId}`, { cache: 'no-store' }, 3000);
  return res.ok && res.data ? res.data : { success: false, keys: [], error: res.error };
}

export async function generateEc2Key(projectId: string, keyName: string) {
  const res = await safeFetch('/api/ec2/keys/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId, keyName }),
  }, 4000);
  return res.ok && res.data ? res.data : { success: false, error: res.error };
}

export function getKeyDownloadUrl(projectId: string, keyName: string): string {
  return `${API_BASE}/api/ec2/keys/${projectId}/${keyName}/download`;
}

export async function executeEc2Command(params: { port: number; command: string; mode?: string; keyName?: string }) {
  const res = await safeFetch('/api/ec2/exec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  }, 6000);
  return res.ok && res.data ? res.data : { success: false, error: res.error };
}
