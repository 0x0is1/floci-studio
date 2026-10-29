import { Elysia, t } from 'elysia';
import { projectService } from '@/services/projectService';
import { ProjectSchema } from '@/models/project';

export const projectController = new Elysia({ prefix: '/api/projects' })
  .get('/', () => {
    return { success: true, data: projectService.listProjects() };
  })
  .post(
    '/',
    ({ body, set }) => {
      const { name, description } = body;
      const project = projectService.createProject({ name, description: description || '' });
      set.status = 201;
      return { success: true, data: project };
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        description: t.Optional(t.String()),
      }),
    }
  )
  .get('/:id', ({ params: { id }, set }) => {
    const project = projectService.getProject(id);
    if (!project) {
      set.status = 404;
      return { success: false, error: 'Project not found' };
    }
    return { success: true, data: project };
  })
  .put(
    '/:id',
    ({ params: { id }, body, set }) => {
      try {
        const validated = ProjectSchema.parse({
          ...body,
          id,
          updatedAt: body.updatedAt || new Date().toISOString(),
        });
        const saved = projectService.saveProject(validated);
        return { success: true, data: saved };
      } catch (err: any) {
        set.status = 400;
        return { success: false, error: err.message || 'Invalid project data' };
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        description: t.Optional(t.String()),
        nodes: t.Array(t.Any()),
        edges: t.Array(t.Any()),
        createdAt: t.String(),
        updatedAt: t.Optional(t.String()),
        status: t.Optional(t.String()),
        logs: t.Optional(t.Array(t.Any())),
      }),
    }
  )
  .delete('/:id', ({ params: { id }, set }) => {
    const deleted = projectService.deleteProject(id);
    if (!deleted) {
      set.status = 404;
      return { success: false, error: 'Project not found' };
    }
    return { success: true, message: 'Project deleted' };
  });
