export function normalizeFlociEndpoint(rawUrl: string, targetEndpoint?: string): string {
  if (!rawUrl) return targetEndpoint || 'http://localhost:4566';
  if (rawUrl.includes('amazonaws.com') || (!rawUrl.includes('floci') && !rawUrl.includes('4566') && !rawUrl.includes('localhost.floci.io'))) {
    return rawUrl;
  }
  const defaultTarget = targetEndpoint || process.env.FLOCI_PUBLIC_ENDPOINT || 'http://localhost:4566';
  const cleanTarget = defaultTarget.replace(/\/+$/, '');
  return rawUrl.replace(/https?:\/\/(floci|oss-floci|floci-api|localhost\.floci\.io)(:\d+)?/, cleanTarget);
}

export function buildS3Urls(bucket: string, endpoint: string) {
  const name = bucket.replace(/^.*[\/\\]/, '');
  const cleanEndpoint = normalizeFlociEndpoint(endpoint);
  const url = cleanEndpoint.includes('amazonaws.com') ? `https://${name}.s3.amazonaws.com` : `${cleanEndpoint}/${name}`;
  return { name, url };
}

export function buildSqsUrls(queue: string, endpoint: string) {
  const cleanEndpoint = normalizeFlociEndpoint(endpoint);
  const cleanQueue = normalizeFlociEndpoint(queue, cleanEndpoint);
  const url = cleanQueue.startsWith('http') ? cleanQueue : `${cleanEndpoint}/000000000000/${queue}`;
  const name = queue.split('/').pop() || queue;
  return { name, url };
}

export function buildRdsUrls(db: string, cfg: Record<string, any> = {}) {
  const engine = cfg.engine || 'postgres';
  const proto = engine.includes('mysql') ? 'mysql' : 'postgres';
  const port = cfg.port || (proto === 'mysql' ? 3306 : 5432);
  const user = cfg.username || 'admin';
  const pass = cfg.password || 'Password123!';
  const host = cfg.endpoint || cfg.host || process.env.RDS_HOST || 'localhost';
  const name = cfg.dbName || cfg.databaseName || db || 'app';
  return {
    endpoint: `${host}:${port}`,
    databaseUrl: `${proto}://${user}:${pass}@${host}:${port}/${name}`,
    dbName: name,
    user,
    port: String(port),
  };
}
