import { z } from 'zod';

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

export const ProjectSchema = z.object({
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
});

export type CanvasNode = z.infer<typeof CanvasNodeSchema>;
export type CanvasEdge = z.infer<typeof CanvasEdgeSchema>;
export type Project = z.infer<typeof ProjectSchema>;

export const CreateProjectInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().default(''),
});

export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;
