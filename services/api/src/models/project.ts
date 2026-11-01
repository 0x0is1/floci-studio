import { z } from 'zod';
import { validateConnection } from '@shared/connectionMatrix';

export const CanvasNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({ x: z.number(), y: z.number() }),
  data: z.record(z.any()),
});

export const CanvasEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.string().optional(),
  sourceHandle: z.string().optional().nullable(),
  targetHandle: z.string().optional().nullable(),
  data: z.record(z.any()).optional(),
});

function validateEdges(nodes: z.infer<typeof CanvasNodeSchema>[], edges: z.infer<typeof CanvasEdgeSchema>[], ctx: z.RefinementCtx, path: (string | number)[]) {
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  edges.forEach((edge, i) => {
    const source = nodeById.get(edge.source);
    const target = nodeById.get(edge.target);
    if (!source || !target) return;
    const result = validateConnection(source.data.serviceType, target.data.serviceType);
    if (!result.allowed) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: result.reason || 'Invalid AWS connection', path: [...path, i] });
    }
  });
}

export const ProjectSchema = z
  .object({
    id: z.string(),
    name: z.string().min(1),
    description: z.string().default(''),
    nodes: z.array(CanvasNodeSchema).default([]),
    edges: z.array(CanvasEdgeSchema).default([]),
    deployedNodes: z.array(CanvasNodeSchema).optional().default([]),
    deployedEdges: z.array(CanvasEdgeSchema).optional().default([]),
    createdAt: z.string(),
    updatedAt: z.string().optional().default(() => new Date().toISOString()),
    status: z.enum(['draft', 'deploying', 'running', 'error']).default('draft'),
    logs: z.array(z.any()).optional().default([]),
  })
  .superRefine((project, ctx) => {
    validateEdges(project.nodes, project.edges, ctx, ['edges']);
    if (project.deployedNodes && project.deployedEdges) {
      validateEdges(project.deployedNodes, project.deployedEdges, ctx, ['deployedEdges']);
    }
  });

export type CanvasNode = z.infer<typeof CanvasNodeSchema>;
export type CanvasEdge = z.infer<typeof CanvasEdgeSchema>;
export type Project = z.infer<typeof ProjectSchema>;

export const CreateProjectInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().default(''),
});

export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;
