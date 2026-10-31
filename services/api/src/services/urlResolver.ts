export function buildS3Urls(bucket: string, endpoint: string) {
  const name = bucket.replace(/^.*[\/\\]/, '');
  return { name, url: `${endpoint}/${name}` };
}

export function buildSqsUrls(queue: string, endpoint: string) {
  const url = queue.startsWith('http') ? queue : `${endpoint}/000000000000/${queue}`;
  const name = queue.split('/').pop() || queue;
  return { name, url };
}

export function buildRdsUrls(db: string, cfg: Record<string, any> = {}) {
  const engine = cfg.engine || 'postgres';
  const proto = engine.includes('mysql') ? 'mysql' : 'postgres';
  const port = cfg.port || (proto === 'mysql' ? 3306 : 5432);
  const user = cfg.username || 'admin';
  const pass = cfg.password || 'Password123!';
  const host = process.env.RDS_HOST || 'localhost';
  const name = cfg.dbName || db || 'app';
  return {
    endpoint: `${host}:${port}`,
    databaseUrl: `${proto}://${user}:${pass}@${host}:${port}/${name}`,
    dbName: name,
    user,
    port: String(port),
  };
}

