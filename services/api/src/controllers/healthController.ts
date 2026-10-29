import { Elysia } from 'elysia';
import { flociProbeService } from '@/services/flociProbeService';

export const healthController = new Elysia({ prefix: '/api/health' })
  .get('/', async () => {
    const floci = await flociProbeService.checkHealth();
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      floci,
    };
  });
