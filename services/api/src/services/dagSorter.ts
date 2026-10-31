import { CanvasNode, CanvasEdge } from '@/models/project';

export interface DagNodeLevel {
  level: number;
  node: CanvasNode;
  dependencies: string[];
}

const SERVICE_TIERS: Record<string, number> = {
  vpc: 1, subnet: 2, iam: 10, kms: 10, secretsmanager: 10, secrets: 10,
  s3: 20, sqs: 20, sns: 20, dynamodb: 20, rds: 20, elasticache: 20, efs: 20, kinesis: 20, bedrock: 20,
  ec2: 30, ecs: 30, lambda: 30,
  alb: 40, apigateway: 40, cloudfront: 50, route53: 60,
};

export function getServiceTier(serviceType: string): number {
  return SERVICE_TIERS[serviceType] || 25;
}

export function sortNodesTopologically(nodes: CanvasNode[], edges: CanvasEdge[]): DagNodeLevel[] {
  const inDegree: Record<string, number> = {};
  const dependents: Record<string, string[]> = {};
  const dependencies: Record<string, string[]> = {};
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  for (const node of nodes) {
    inDegree[node.id] = 0;
    dependents[node.id] = [];
    dependencies[node.id] = [];
  }

  for (const edge of edges) {
    const srcNode = nodeMap.get(edge.source);
    const tgtNode = nodeMap.get(edge.target);
    if (!srcNode || !tgtNode) continue;

    const srcTier = getServiceTier(srcNode.data.serviceType);
    const tgtTier = getServiceTier(tgtNode.data.serviceType);

    // If source tier is higher than target tier (e.g. EC2(30) -> SQS(20)),
    // the lower tier resource (SQS) must be provisioned before the consumer (EC2).
    const [prereq, consumer] = srcTier > tgtTier ? [edge.target, edge.source] : [edge.source, edge.target];

    if (inDegree[consumer] !== undefined && inDegree[prereq] !== undefined) {
      inDegree[consumer]++;
      dependents[prereq].push(consumer);
      dependencies[consumer].push(prereq);
    }
  }

  const queue: Array<{ id: string; level: number }> = [];
  for (const node of nodes) {
    if (inDegree[node.id] === 0) queue.push({ id: node.id, level: 0 });
  }

  // Sort initial queue by tier
  queue.sort((a, b) => {
    const tA = getServiceTier(nodeMap.get(a.id)?.data.serviceType || '');
    const tB = getServiceTier(nodeMap.get(b.id)?.data.serviceType || '');
    return tA - tB;
  });

  const ordered: DagNodeLevel[] = [];
  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    const node = nodeMap.get(id);
    if (node) ordered.push({ level, node, dependencies: dependencies[id] || [] });

    for (const nextId of dependents[id] || []) {
      inDegree[nextId]--;
      if (inDegree[nextId] === 0) queue.push({ id: nextId, level: level + 1 });
    }
  }

  for (const node of nodes) {
    if (!ordered.some((o) => o.node.id === node.id)) {
      ordered.push({ level: 99, node, dependencies: dependencies[node.id] || [] });
    }
  }

  return ordered.sort((a, b) => a.level - b.level || getServiceTier(a.node.data.serviceType) - getServiceTier(b.node.data.serviceType));
}
