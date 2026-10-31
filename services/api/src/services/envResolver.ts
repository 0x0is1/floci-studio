import { buildS3Urls, buildSqsUrls, buildRdsUrls } from './urlResolver';

export function resolveInjectedEnvVars(
  nodeId: string,
  edges: Array<{ source: string; target: string; data?: { envVarName?: string } }>,
  resourceMap: Record<string, string>,
  nodes?: Array<{ id: string; data: { serviceType: string; config?: Record<string, any> } }>
): Record<string, string> {
  const flociEndpoint = process.env.FLOCI_ENDPOINT || process.env.AWS_ENDPOINT_URL || 'http://localhost:4566';
  const env: Record<string, string> = {
    AWS_REGION: 'us-east-1',
    AWS_DEFAULT_REGION: 'us-east-1',
    AWS_ACCESS_KEY_ID: 'test',
    AWS_SECRET_ACCESS_KEY: 'test',
    AWS_ENDPOINT_URL: flociEndpoint,
    FLOCI_ENDPOINT: flociEndpoint,
  };

  const nodeMap = new Map((nodes || []).map((n) => [n.id, n]));
  const vpc = (nodes || []).find((n) => n.data.serviceType === 'vpc');
  if (vpc) {
    const vpcId = resourceMap[vpc.id] || vpc.data.config?.vpcId || 'vpc-default';
    env.AWS_VPC_ID = vpcId;
    env.VPC_ID = vpcId;
    env.VPC_CIDR_BLOCK = vpc.data.config?.cidrBlock || '172.31.0.0/16';
    env.AWS_DEFAULT_SECURITY_GROUP = 'sg-default';
  }

  const subnet = (nodes || []).find((n) => n.data.serviceType === 'subnet');
  if (subnet) {
    const subId = resourceMap[subnet.id] || subnet.data.config?.subnetId || 'subnet-default-1a';
    env.AWS_SUBNET_ID = subId;
    env.SUBNET_ID = subId;
    env.SUBNET_CIDR_BLOCK = subnet.data.config?.cidrBlock || '172.31.1.0/24';
  }

  for (const edge of edges) {
    if (edge.source === nodeId && resourceMap[edge.target]) {
      const targetNode = nodeMap.get(edge.target);
      const val = resourceMap[edge.target];
      const sType = targetNode?.data?.serviceType;

      if (edge.data?.envVarName) env[edge.data.envVarName] = val;

      if (sType === 's3' || val.includes('bucket')) {
        const s3 = buildS3Urls(val, flociEndpoint);
        env.S3_BUCKET_NAME = s3.name;
        env.S3_BUCKET = s3.name;
        env.BUCKET_NAME = s3.name;
        env.S3_BUCKET_URL = s3.url;
        env.S3_URL = s3.url;
      } else if (sType === 'sqs' || val.includes('queue')) {
        const sqs = buildSqsUrls(val, flociEndpoint);
        env.SQS_QUEUE_URL = sqs.url;
        env.QUEUE_URL = sqs.url;
        env.SQS_QUEUE_NAME = sqs.name;
      } else if (sType === 'dynamodb') {
        env.DYNAMODB_TABLE_NAME = val;
        env.TABLE_NAME = val;
        env.DYNAMODB_TABLE_URL = `${flociEndpoint}/tables/${val}`;
        env.DYNAMODB_ENDPOINT_URL = flociEndpoint;
      } else if (sType === 'rds') {
        const rds = buildRdsUrls(val, targetNode?.data?.config);
        env.DATABASE_URL = rds.databaseUrl;
        env.RDS_URL = rds.databaseUrl;
        env.RDS_ENDPOINT = rds.endpoint;
        env.RDS_DB_NAME = rds.dbName;
        env.RDS_USERNAME = rds.user;
        env.RDS_PORT = rds.port;
      } else if (sType === 'sns') {
        env.SNS_TOPIC_ARN = val;
      } else if (sType === 'secrets') {
        env.SECRET_NAME = val;
      } else if (sType === 'bedrock') {
        env.BEDROCK_MODEL_ID = targetNode?.data?.config?.modelId || 'anthropic.claude-3-sonnet';
        env.BEDROCK_ENDPOINT_URL = targetNode?.data?.config?.endpointUrl || `${flociEndpoint}/bedrock`;
        if (targetNode?.data?.config?.apiKey) {
          env.BEDROCK_API_KEY = targetNode.data.config.apiKey;
          env.OPENAI_API_KEY = targetNode.data.config.apiKey;
        }
        if (targetNode?.data?.config?.systemPrompt) {
          env.BEDROCK_SYSTEM_PROMPT = targetNode.data.config.systemPrompt;
        }
      }
    }
  }
  return env;
}
