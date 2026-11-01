import { dockerReq } from './dockerService';

async function findContainerIp(predicate: (c: any) => boolean): Promise<string | null> {
  const list = await dockerReq('GET', '/containers/json');
  if (!Array.isArray(list.body)) return null;
  const matches = list.body.filter(predicate).sort((a: any, b: any) => (b.Created || 0) - (a.Created || 0));
  const match = matches[0];
  if (!match?.Id) return null;
  const inspect = await dockerReq('GET', `/containers/${match.Id}/json`);
  return inspect.body?.NetworkSettings?.Networks?.oss_floci_net?.IPAddress || null;
}

export async function findFlociRdsIp(): Promise<string | null> {
  return findContainerIp((c: any) =>
    c.Names?.some((n: string) => n.includes('floci-aws-rds-db')) || c.Labels?.['io.floci.service'] === 'rds'
  );
}

export async function findFlociElastiCacheIp(): Promise<string | null> {
  return findContainerIp((c: any) => c.Labels?.['floci.kind'] === 'elasticache');
}

/** Builds a shell snippet that forwards each raw-TCP downstream (RDS, ElastiCache, ...) to localhost:<port> inside the EC2 container. */
export async function buildTcpForwardScript(): Promise<string> {
  const forwards: Array<{ port: number; ip: string }> = [];
  const rdsIp = await findFlociRdsIp();
  if (rdsIp) forwards.push({ port: 5432, ip: rdsIp });
  const cacheIp = await findFlociElastiCacheIp();
  if (cacheIp) forwards.push({ port: 6379, ip: cacheIp });
  if (!forwards.length) return '';

  const listeners = forwards.map((f) => `socat TCP-LISTEN:${f.port},fork,reuseaddr TCP:${f.ip}:${f.port} &`).join(' ');
  return `(which socat >/dev/null 2>&1 || apk add --no-cache socat >/dev/null 2>&1) && (killall socat 2>/dev/null; ${listeners}); `;
}
