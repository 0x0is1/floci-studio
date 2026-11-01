import { Elysia, t } from 'elysia';
import { orchestrationService } from '@/services/orchestrationService';
import { persistDeployResult } from '@/services/deployPersistService';

export const deployStreamController = new Elysia({ prefix: '/api/orchestrator' }).post(
  '/deploy-stream',
  async ({ body, set }) => {
    const { nodes, edges, projectId } = body;
    set.headers['Content-Type'] = 'text/event-stream';
    set.headers['Cache-Control'] = 'no-cache';
    set.headers['Connection'] = 'keep-alive';

    const stream = new ReadableStream({
      async start(controller) {
        const send = (event: string, data: any) => {
          controller.enqueue(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
        };
        try {
          const { results, logs } = await orchestrationService.deployGraph(nodes as any, edges as any, projectId, (r) => send('node', r));
          persistDeployResult(projectId, nodes, edges, results, logs);
          send('done', { success: true, results, logs });
        } catch (err: any) {
          send('done', { success: false, error: err.message });
        } finally {
          controller.close();
        }
      },
    });
    return new Response(stream);
  },
  {
    body: t.Object({
      nodes: t.Array(t.Any()),
      edges: t.Array(t.Any()),
      projectId: t.Optional(t.String()),
    }),
  }
);
