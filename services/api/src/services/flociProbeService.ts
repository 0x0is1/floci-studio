import { config } from '@/config/env';

export interface FlociHealthStatus {
  status: 'connected' | 'unreachable';
  endpoint: string;
  services?: Record<string, string>;
  latencyMs?: number;
  error?: string;
}

export class FlociProbeService {
  public async checkHealth(): Promise<FlociHealthStatus> {
    const start = Date.now();
    try {
      const res = await fetch(`${config.flociEndpoint}/_floci/health`, {
        signal: AbortSignal.timeout(3000),
      });

      if (!res.ok) {
        return {
          status: 'unreachable',
          endpoint: config.flociEndpoint,
          error: `HTTP ${res.status}: ${res.statusText}`,
        };
      }

      const data = (await res.json().catch(() => ({}))) as any;
      return {
        status: 'connected',
        endpoint: config.flociEndpoint,
        services: data?.services || {},
        latencyMs: Date.now() - start,
      };
    } catch (err: any) {
      return {
        status: 'unreachable',
        endpoint: config.flociEndpoint,
        error: err.message || 'Connection refused',
      };
    }
  }
}

export const flociProbeService = new FlociProbeService();
