export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4501';

export type ApiFailureType = 'backend_down' | 'timeout' | 'error';
type FailureListener = (info: { type: ApiFailureType; message: string; path: string }) => void;
const listeners = new Set<FailureListener>();

export function onApiFailure(listener: FailureListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyApiFailure(type: ApiFailureType, message: string, path: string): void {
  listeners.forEach((fn) => fn({ type, message, path }));
}

export async function safeFetch<T = any>(
  path: string,
  options?: RequestInit,
  timeoutMs = 3000
): Promise<{ ok: boolean; data?: T; error?: string }> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  try {
    const res = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) {
      notifyApiFailure('error', `HTTP ${res.status}: ${res.statusText}`, path);
      return { ok: false, error: `HTTP ${res.status}: ${res.statusText}` };
    }
    const data = await res.json().catch(() => ({}));
    return { ok: true, data };
  } catch (err: any) {
    const isTimeout = err?.name === 'TimeoutError' || err?.message?.toLowerCase().includes('timeout');
    const type = isTimeout ? 'timeout' : 'backend_down';
    notifyApiFailure(type, err?.message || 'Connection failed', path);
    return { ok: false, error: isTimeout ? 'Request timed out' : 'Backend connection refused' };
  }
}

