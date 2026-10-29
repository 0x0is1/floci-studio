import { CanvasNode, CanvasEdge } from '@/models/project';

export interface DagNodeLevel {
  level: number;
  node: CanvasNode;
  dependencies: string[];
}

export function sortNodesTopologically(nodes: CanvasNode[], edges: CanvasEdge[]): DagNodeLevel[] {
  const inDegree: Record<string, number> = {};
  const dependents: Record<string, string[]> = {};
  const dependencies: Record<string, string[]> = {};

  for (const node of nodes) {
    inDegree[node.id] = 0;
    dependents[node.id] = [];
    dependencies[node.id] = [];
  }

  // Edge from source to target means target depends on source
  for (const edge of edges) {
    if (inDegree[edge.target] !== undefined && inDegree[edge.source] !== undefined) {
      inDegree[edge.target]++;
      dependents[edge.source].push(edge.target);
      dependencies[edge.target].push(edge.source);
    }
  }

  const queue: Array<{ id: string; level: number }> = [];
  for (const node of nodes) {
    if (inDegree[node.id] === 0) {
      queue.push({ id: node.id, level: 0 });
    }
  }

  const ordered: DagNodeLevel[] = [];
  const levels: Record<string, number> = {};

  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    levels[id] = level;
    const node = nodes.find((n) => n.id === id);
    if (node) {
      ordered.push({ level, node, dependencies: dependencies[id] || [] });
    }

    for (const nextId of dependents[id] || []) {
      inDegree[nextId]--;
      if (inDegree[nextId] === 0) {
        queue.push({ id: nextId, level: level + 1 });
      }
    }
  }

  // If cycle detected, append remaining nodes
  for (const node of nodes) {
    if (!ordered.some((o) => o.node.id === node.id)) {
      ordered.push({ level: 99, node, dependencies: dependencies[node.id] || [] });
    }
  }

  return ordered.sort((a, b) => a.level - b.level);
}
