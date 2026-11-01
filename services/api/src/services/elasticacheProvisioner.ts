import { awsClients } from './awsClientService';
import { CreateCacheClusterCommand } from '@aws-sdk/client-elasticache';
import { logStdin, logStdout, TerminalLog } from './loggerService';
import { launchContainer } from './containerRuntime';
import { findAvailablePort } from './portFinder';

export async function provisionElastiCache(
  nodeId: string,
  type: string,
  config: Record<string, any>,
  logs: TerminalLog[],
  projectId?: string
) {
  const clusterId = (config.clusterName || `cache-${Date.now().toString().slice(-4)}`).toLowerCase();
  const engine = config.engine === 'memcached' ? 'memcached' : 'redis';
  const requestedPort = Number(config.port) || (engine === 'memcached' ? 11211 : 6379);
  logs.push(logStdin(nodeId, type, `aws elasticache create-cache-cluster --cache-cluster-id ${clusterId} --engine ${engine}`));

  try {
    await awsClients.elasticache.send(new CreateCacheClusterCommand({
      CacheClusterId: clusterId,
      Engine: engine,
      CacheNodeType: config.nodeType || 'cache.t3.micro',
      NumCacheNodes: engine === 'redis' ? 1 : Number(config.numCacheNodes) || 1,
    }));
  } catch {}

  const { port, wasReallocated } = await findAvailablePort(requestedPort);
  const pid = projectId || 'default';
  const image = engine === 'memcached' ? 'memcached:alpine' : 'redis:7-alpine';
  const launched = await launchContainer({
    namePrefix: 'floci-elasticache',
    containerName: `floci-elasticache-${pid}-${nodeId}-${port}`,
    image,
    containerPort: engine === 'memcached' ? 11211 : 6379,
    hostPort: port,
    labels: { 'floci.project': pid, 'floci.node': nodeId, 'floci.port': String(port), 'floci.kind': 'elasticache' },
  });

  const msg = launched
    ? `ElastiCache ${engine} cluster '${clusterId}' running on host port ${port}${wasReallocated ? ' (reallocated)' : ''}.`
    : `ElastiCache cluster '${clusterId}' active (container failed to launch - check Docker).`;
  logs.push(logStdout(nodeId, type, { clusterId, engine, port }, msg, 'docker'));

  return { resourceId: clusterId, liveUrl: launched ? `${engine}://localhost:${port}` : undefined, port: launched ? port : undefined };
}
