import { Elysia } from 'elysia';
import { flociProbeService } from '@/services/flociProbeService';
import { checkDockerStatus } from '@/services/dockerHealthService';

export const healthController = new Elysia({ prefix: '/api/health' })
  .get('/', async () => {
    const [floci, docker] = await Promise.all([
      flociProbeService.checkHealth(),
      checkDockerStatus(),
    ]);
    const isDegraded = docker.status !== 'running' || floci.status !== 'connected';
    return {
      status: isDegraded ? 'degraded' : 'ok',
      timestamp: new Date().toISOString(),
      docker,
      floci,
    };
  });
