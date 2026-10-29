const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4501';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/api/health`, { cache: 'no-store' });
  return res.json();
}

export async function fetchRuntimeState(projectId?: string) {
  const url = projectId ? `${API_BASE}/api/orchestrator/runtime-state?projectId=${encodeURIComponent(projectId)}` : `${API_BASE}/api/orchestrator/runtime-state`;
  const res = await fetch(url, { cache: 'no-store' });
  return res.json();
}

export async function listProjects() {
  const res = await fetch(`${API_BASE}/api/projects`, { cache: 'no-store' });
  return res.json();
}

export async function getProject(id: string) {
  const res = await fetch(`${API_BASE}/api/projects/${id}`, { cache: 'no-store' });
  return res.json();
}

export async function createProject(name: string, description?: string) {
  const res = await fetch(`${API_BASE}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description }),
  });
  return res.json();
}

export async function saveProject(project: any) {
  const res = await fetch(`${API_BASE}/api/projects/${project.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
  return res.json();
}

export async function deleteProject(id: string) {
  const res = await fetch(`${API_BASE}/api/projects/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function deployInfrastructure(nodes: any[], edges: any[], projectId?: string) {
  const res = await fetch(`${API_BASE}/api/orchestrator/deploy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nodes, edges, projectId }),
  });
  return res.json();
}

export async function teardownInfrastructure(
  params: number[] | { ports?: number[]; buckets?: string[]; queues?: string[]; tables?: string[]; projectId?: string }
) {
  const body = Array.isArray(params) ? { ports: params } : params;
  const res = await fetch(`${API_BASE}/api/orchestrator/teardown`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function listEc2Keys(projectId: string) {
  const res = await fetch(`${API_BASE}/api/ec2/keys/${projectId}`, { cache: 'no-store' });
  return res.json();
}

export async function generateEc2Key(projectId: string, keyName: string) {
  const res = await fetch(`${API_BASE}/api/ec2/keys/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId, keyName }),
  });
  return res.json();
}

export function getKeyDownloadUrl(projectId: string, keyName: string) {
  return `${API_BASE}/api/ec2/keys/${projectId}/${keyName}/download`;
}

export async function executeEc2Command(params: { port: number; command: string; mode?: string; keyName?: string }) {
  const res = await fetch(`${API_BASE}/api/ec2/exec`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}