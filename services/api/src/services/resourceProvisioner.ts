import { awsClients } from './awsClientService';
import { dockerService } from './dockerService';
import { CreateBucketCommand } from '@aws-sdk/client-s3';
import { CreateQueueCommand } from '@aws-sdk/client-sqs';
import { RunInstancesCommand } from '@aws-sdk/client-ec2';
import { logStdin, logStdout, createLog, TerminalLog } from './loggerService';
import { provisionDatabase } from './databaseProvisioner';
import { provisionNetworkResource } from './networkProvisioner';
import { provisionServerless } from './serverlessProvisioner';
import { provisionAiResource } from './aiProvisioner';
import { findAvailablePort } from './portFinder';
import { resolveInjectedEnvVars } from './envResolver';
import { normalizeFlociEndpoint } from './urlResolver';

export interface ProvisionContext {
  nodeId: string;
  type: string;
  label: string;
  config: Record<string, any>;
  resourceMap: Record<string, string>;
  edges: Array<{ source: string; target: string; data?: any }>;
  projectId?: string;
  nodes?: Array<any>;
}

export async function provisionResource(ctx: ProvisionContext, logs: TerminalLog[]) {
  const { nodeId, type, label, config, resourceMap, edges, projectId } = ctx;

  if (type === 's3') {
    const bucket = config.bucketName || `bucket-${Date.now().toString().slice(-4)}`;
    const access = config.networkAccess || 'public_external';
    logs.push(logStdin(nodeId, type, `aws s3api create-bucket --bucket ${bucket} --network-access ${access}`));
    const res = await awsClients.s3.send(new CreateBucketCommand({ Bucket: bucket })).catch(() => ({ Location: `/${bucket}` }));
    logs.push(logStdout(nodeId, type, res, `Bucket '${bucket}' ready (${access}).`));
    return { resourceId: bucket };
  }

  if (type === 'sqs') {
    const queue = config.queueName || `queue-${Date.now().toString().slice(-4)}`;
    const access = config.networkAccess || 'vpc_only';
    logs.push(logStdin(nodeId, type, `aws sqs create-queue --queue-name ${queue} --network-access ${access}`));
    const res = await awsClients.sqs.send(new CreateQueueCommand({ QueueName: queue })).catch(() => ({ QueueUrl: `http://localhost:4566/000000000000/${queue}` }));
    const cleanUrl = normalizeFlociEndpoint(res.QueueUrl || `http://localhost:4566/000000000000/${queue}`);
    logs.push(logStdout(nodeId, type, res, `Queue '${queue}' active at ${cleanUrl} (${access})`));
    return { resourceId: cleanUrl };
  }

  if (type === 'dynamodb' || type === 'rds') return provisionDatabase(nodeId, type, label, config, logs);
  if (['vpc', 'subnet', 'alb', 'cloudfront', 'apigateway'].includes(type)) return provisionNetworkResource(nodeId, type, label, config, resourceMap, logs, edges);
  if (type === 'lambda') return provisionServerless(nodeId, type, label, config, logs, edges as any, resourceMap, ctx.nodes);
  if (type === 'bedrock') return provisionAiResource(nodeId, type, label, config, logs);

  if (type === 'ecs') {
    const cluster = config.clusterName || 'default-ecs-cluster';
    const envVars = resolveInjectedEnvVars(nodeId, edges, resourceMap, ctx.nodes);
    logs.push(logStdin(nodeId, type, `aws ecs create-cluster --cluster-name ${cluster}`));
    logs.push(logStdout(nodeId, type, { cluster, envCount: Object.keys(envVars).length }, `ECS Cluster '${cluster}' active with env vars [${Object.keys(envVars).join(', ')}].`));
    return { resourceId: `arn:aws:ecs:us-east-1:000000000000:cluster/${cluster}` };
  }

  if (type === 'ec2') {
    const requestedPort = Number(config.port) || 8080;
    const { port, wasReallocated } = await findAvailablePort(requestedPort);
    if (wasReallocated) logs.push(createLog(nodeId, type, 'warn', `Port ${requestedPort} is in use. Reallocated to ${port}.`));

    const ami = config.ami || 'ami-ubuntu2404-amd64', instType = config.instanceType || 't3.micro';
    logs.push(logStdin(nodeId, type, `aws ec2 run-instances --image-id ${ami} --instance-type ${instType} --count 1`));
    const runRes = await awsClients.ec2.send(new RunInstancesCommand({
      ImageId: ami, InstanceType: instType as any, MinCount: 1, MaxCount: 1,
      TagSpecifications: [{ ResourceType: 'instance', Tags: [{ Key: 'Name', Value: label }] }],
    }));
    const instanceId = runRes.Instances?.[0]?.InstanceId || `i-${Date.now().toString().slice(-8)}`;
    logs.push(logStdout(nodeId, type, runRes, `EC2 Instance ${instanceId} state: RUNNING`));

    const envVars = resolveInjectedEnvVars(nodeId, edges, resourceMap, ctx.nodes);
    logs.push(logStdin(nodeId, type, `docker run -d --name floci-ec2-web-${port} -p ${port}:80 nginx:alpine`, 'docker'));
    await dockerService.launchEc2Web(port, {
      id: instanceId, name: label, s3: envVars.S3_BUCKET || envVars.BUCKET_NAME,
      sqs: envVars.SQS_QUEUE_URL || envVars.QUEUE_URL, template: config.template || 'nginx',
      ami, instanceType: instType, projectId, envVars,
    });
    const liveUrl = `http://localhost:${port}`;
    logs.push(logStdout(nodeId, type, { port, liveUrl, instanceId }, `Container running on host port ${port} -> ${liveUrl}`, 'docker'));
    return { resourceId: instanceId, liveUrl, port };
  }

  logs.push(createLog(nodeId, type, 'success', `${label} provisioned.`));
  return { resourceId: `floci-${type}` };
}
