export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4501';

export type ApiFailureType = 'backend_down' | 'timeout' | 'error';

export interface ApiFailureDetails {
  type: ApiFailureType;
  message: string;
  path: string;
  status?: number;
}

type FailureListener = (info: ApiFailureDetails) => void;
const listeners = new Set<FailureListener>();

export function onApiFailure(listener: FailureListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyApiFailure(type: ApiFailureType, message: string, path: string, status?: number): void {
  listeners.forEach((fn) => fn({ type, message, path, status }));
}

export async function safeFetch<T = any>(
  path: string,
  options?: RequestInit,
  timeoutMs = 3000
): Promise<{ ok: boolean; data?: T; error?: string; status?: number }> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  try {
    const res = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) {
      notifyApiFailure('error', `HTTP ${res.status}: ${res.statusText}`, path, res.status);
      return { ok: false, error: `HTTP ${res.status}: ${res.statusText}`, status: res.status };
    }
    const data = await res.json().catch(() => ({}));
    return { ok: true, data, status: res.status };
  } catch (err: any) {
    const isTimeout = err?.name === 'TimeoutError' || err?.message?.toLowerCase().includes('timeout');
    const type = isTimeout ? 'timeout' : 'backend_down';
    notifyApiFailure(type, err?.message || 'Connection failed', path, 0);
    return { ok: false, error: isTimeout ? 'Request timed out' : 'Backend connection refused', status: 0 };
  }
}
