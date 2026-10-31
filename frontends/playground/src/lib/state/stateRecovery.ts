import { AppNode, AppEdge } from '@/store/playgroundStore';
import { NodeExecutionStatus } from '@/types/aws';

export function reconcileNodeStates(
  nodes: AppNode[],
  runtime: any,
  edges: AppEdge[] = [],
  projectStatus?: string
): { nodes: AppNode[]; isDeployed: boolean } {
  if (projectStatus !== 'running') {
    const draftNodes = nodes.map((n) => ({
      ...n,
      data: { ...n.data, status: 'draft' as const, liveUrl: undefined },
    }));
    return { nodes: draftNodes, isDeployed: false };
  }

  const runningPorts: number[] = runtime?.ec2?.runningPorts || [];
  const buckets: string[] = runtime?.s3?.buckets || [];
  const queues: string[] = runtime?.sqs?.queues || [];
  const tables: string[] = runtime?.dynamodb?.tables || [];
  const instances: string[] = runtime?.rds?.instances || [];
  const functions: string[] = runtime?.lambda?.functions || [];

  const updatedNodes = nodes.map((node) => {
    const type = node.data.serviceType;
    const cfg = node.data.config || {};
    let isRunning = node.data.status === 'running';
    let liveUrl = node.data.liveUrl;
    let resourceId = node.data.resourceId;

    if (type === 'vpc' || type === 'subnet') {
      isRunning = true;
    } else if (type === 'ec2') {
      const port = Number(cfg.port) || 8080;
      isRunning = isRunning || runningPorts.includes(port) || Boolean(runtime?.isDeployed);
      if (isRunning) liveUrl = liveUrl || `http://localhost:${port}`;
    } else if (type === 's3') {
      const name = cfg.bucketName;
      isRunning = isRunning || Boolean(name && buckets.includes(name));
      if (isRunning) resourceId = resourceId || name;
    } else if (type === 'sqs') {
      const name = cfg.queueName;
      const found = queues.find((q) => name && q.includes(name));
      isRunning = isRunning || Boolean(found);
      if (isRunning) resourceId = resourceId || found;
    } else if (type === 'dynamodb') {
      const name = cfg.tableName;
      isRunning = isRunning || Boolean(name && tables.includes(name));
      if (isRunning) resourceId = resourceId || name;
    } else if (type === 'rds') {
      const name = (cfg.dbName || '').toLowerCase();
      isRunning = isRunning || Boolean(name && instances.includes(name));
      if (isRunning) resourceId = resourceId || name;
    } else if (type === 'lambda') {
      const name = cfg.functionName;
      isRunning = isRunning || Boolean(name && functions.includes(name));
    } else if (type === 'bedrock' || type === 'secrets' || type === 'sns' || type === 'kms' || type === 'ecs') {
      isRunning = true;
    }

    const status: NodeExecutionStatus = isRunning ? 'running' : 'draft';
    return {
      ...node,
      data: { ...node.data, status, liveUrl: isRunning ? liveUrl : undefined, resourceId: isRunning ? resourceId : undefined },
    };
  });

  const finalNodes = updatedNodes.map((node) => {
    const type = node.data.serviceType;
    if (type === 'cloudfront' || type === 'alb') {
      const targetEdge = edges.find((e) => e.source === node.id);
      const targetNode = targetEdge ? updatedNodes.find((n) => n.id === targetEdge.target) : null;
      const isRunning = Boolean(targetNode?.data.status === 'running');
      return {
        ...node,
        data: { ...node.data, status: (isRunning ? 'running' : 'draft') as NodeExecutionStatus, liveUrl: isRunning ? node.data.liveUrl : undefined },
      };
    }
    return node;
  });

  const isDeployed = projectStatus === 'running' || finalNodes.some((n) => n.data.status === 'running');
  return { nodes: finalNodes, isDeployed };
}
