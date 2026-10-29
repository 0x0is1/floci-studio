const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4501';

export async function fetchFlociResources() {
  const res = await fetch(`${API_BASE}/api/floci/resources`, { cache: 'no-store' });
  return res.json();
}

export async function deleteFlociResource(service: string, id: string) {
  const res = await fetch(`${API_BASE}/api/floci/resources/${service}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function purgeAllFlociResources() {
  const res = await fetch(`${API_BASE}/api/floci/resources/purge-all`, { method: 'POST' });
  return res.json();
}
