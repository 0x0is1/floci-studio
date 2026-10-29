import { dockerReq } from './dockerService';

export async function findAvailablePort(preferredPort: number): Promise<{ port: number; wasReallocated: boolean }> {
  const list = await dockerReq('GET', '/containers/json');
  const usedPorts = new Set<number>();

  if (Array.isArray(list.body)) {
    for (const c of list.body) {
      if (c.Names?.some((n: string) => n.includes(`floci-ec2-web-${preferredPort}`))) {
        continue;
      }
      for (const p of c.Ports || []) {
        if (p.PublicPort) usedPorts.add(p.PublicPort);
      }
    }
  }

  if (!usedPorts.has(preferredPort)) {
    return { port: preferredPort, wasReallocated: false };
  }

  for (let candidate = preferredPort + 1; candidate < preferredPort + 100; candidate++) {
    if (!usedPorts.has(candidate)) {
      return { port: candidate, wasReallocated: true };
    }
  }

  return { port: preferredPort, wasReallocated: false };
}
