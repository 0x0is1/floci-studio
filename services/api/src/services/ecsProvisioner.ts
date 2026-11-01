import { awsClients } from './awsClientService';
import { CreateClusterCommand } from '@aws-sdk/client-ecs';
import { logStdin, logStdout, TerminalLog } from './loggerService';
import { resolveInjectedEnvVars } from './envResolver';
import { launchContainer } from './containerRuntime';
import { findAvailablePort } from './portFinder';

export async function provisionEcs(
  nodeId: string,
  type: string,
  label: string,
  config: Record<string, any>,
  logs: TerminalLog[],
  edges: Array<{ source: string; target: string; data?: any }>,
  resourceMap: Record<string, string>,
  nodes: any[] | undefined,
  projectId?: string
) {
  const cluster = config.clusterName || 'default-ecs-cluster';
  const envVars = resolveInjectedEnvVars(nodeId, edges, resourceMap, nodes);
  logs.push(logStdin(nodeId, type, `aws ecs create-cluster --cluster-name ${cluster}`));

  try {
    await awsClients.ecs.send(new CreateClusterCommand({ clusterName: cluster }));
  } catch {}

  const image = config.image || 'nginx:alpine';
  const containerPort = Number(config.containerPort) || 80;
  const requestedPort = Number(config.hostPort) || 8090;
  const { port, wasReallocated } = await findAvailablePort(requestedPort);
  const pid = projectId || 'default';
  const containerName = `floci-ecs-${pid}-${nodeId}-${port}`;

  const launched = await launchContainer({
    namePrefix: 'floci-ecs',
    containerName,
    image,
    containerPort,
    hostPort: port,
    env: envVars,
    labels: { 'floci.project': pid, 'floci.node': nodeId, 'floci.port': String(port), 'floci.kind': 'ecs' },
  });

  const liveUrl = `http://localhost:${port}`;
  const msg = launched
    ? `ECS Cluster '${cluster}' task '${image}' running on host port ${port} -> ${liveUrl}${wasReallocated ? ' (reallocated)' : ''}.`
    : `ECS Cluster '${cluster}' active (task container failed to launch - check Docker).`;
  logs.push(logStdout(nodeId, type, { cluster, image, port, envCount: Object.keys(envVars).length }, msg, 'docker'));

  return { resourceId: `arn:aws:ecs:us-east-1:000000000000:cluster/${cluster}`, liveUrl: launched ? liveUrl : undefined, port: launched ? port : undefined };
}
