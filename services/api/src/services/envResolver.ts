export function resolveInjectedEnvVars(
  nodeId: string,
  edges: Array<{ source: string; target: string; data?: { envVarName?: string } }>,
  resourceMap: Record<string, string>
): Record<string, string> {
  const env: Record<string, string> = {};
  for (const edge of edges) {
    if (edge.source === nodeId && resourceMap[edge.target]) {
      const key = edge.data?.envVarName || 'RESOURCE_TARGET';
      env[key] = resourceMap[edge.target];
    }
  }
  return env;
}

