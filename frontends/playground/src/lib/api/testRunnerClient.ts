import { safeFetch } from './flociFetch';

export async function listTestFiles(projectId: string, nodeId: string) {
  const res = await safeFetch(`/api/testrunner/${projectId}/${nodeId}/files`, { cache: 'no-store' }, 4000);
  return res.ok && res.data ? res.data : { success: false, files: [], error: res.error };
}

export async function uploadTestFile(projectId: string, nodeId: string, file: File) {
  const form = new FormData();
  form.append('file', file);
  const res = await safeFetch(`/api/testrunner/${projectId}/${nodeId}/files`, { method: 'POST', body: form }, 15000);
  return res.ok && res.data ? res.data : { success: false, error: res.error };
}

export async function deleteTestFile(projectId: string, nodeId: string, filename: string) {
  const res = await safeFetch(`/api/testrunner/${projectId}/${nodeId}/files/${encodeURIComponent(filename)}`, { method: 'DELETE' }, 5000);
  return res.ok && res.data ? res.data : { success: false, error: res.error };
}

export async function runTestRunner(projectId: string, nodeId: string, networkAccess: string) {
  const res = await safeFetch(`/api/testrunner/${projectId}/${nodeId}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ networkAccess }),
  }, 200000);
  return res.ok && res.data ? res.data : { success: false, error: res.error };
}
