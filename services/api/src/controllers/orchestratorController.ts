import { Elysia, t } from 'elysia';
import { orchestrationService } from '@/services/orchestrationService';
import { getRuntimeState } from '@/services/runtimeStateService';
import { teardownSessionResources } from '@/services/resourceTeardownService';
import { projectService } from '@/services/projectService';

export const orchestratorController = new Elysia({ prefix: '/api/orchestrator' })
  .get('/runtime-state', async ({ query }) => {
    return await getRuntimeState(query?.projectId);
  }, {
    query: t.Object({
      projectId: t.Optional(t.String()),
    }),
  })
  .post(
    '/deploy',
    async ({ body }) => {
      const { nodes, edges, projectId } = body;
      const { results, logs } = await orchestrationService.deployGraph(nodes as any, edges as any, projectId);
      if (projectId) {
        const proj = projectService.getProject(projectId);
        if (proj) {
          const deployedNodes = (nodes || []).map((n: any) => {
            const r = results.find((res) => res.nodeId === n.id);
            return r ? { ...n, data: { ...n.data, status: r.status, liveUrl: r.liveUrl } } : n;
          });
          projectService.saveProject({ ...proj, deployedNodes, deployedEdges: edges || [], logs, status: 'running' });
        }
      }
      return { success: true, results, logs };
    },
    {
      body: t.Object({
        nodes: t.Array(t.Any()),
        edges: t.Array(t.Any()),
        projectId: t.Optional(t.String()),
      }),
    }
  )
  .post(
    '/teardown',
    async ({ body }) => {
      const { ports, buckets, queues, tables, projectId } = body;
      await teardownSessionResources({ ports, buckets, queues, tables, projectId });
      if (projectId) {
        const proj = projectService.getProject(projectId);
        if (proj) {
          projectService.saveProject({ ...proj, deployedNodes: [], deployedEdges: [], status: 'draft' });
        }
      }
      return { success: true, message: 'Resources cleaned up' };
    },
    {
      body: t.Object({
        ports: t.Optional(t.Array(t.Number())),
        buckets: t.Optional(t.Array(t.String())),
        queues: t.Optional(t.Array(t.String())),
        tables: t.Optional(t.Array(t.String())),
        projectId: t.Optional(t.String()),
      }),
    }
  );