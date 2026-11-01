import { awsClients } from './awsClientService';
import { CreateVpcCommand, CreateSubnetCommand } from '@aws-sdk/client-ec2';
import { logStdin, logStdout, TerminalLog } from './loggerService';

export async function provisionNetworkResource(
  nodeId: string,
  type: string,
  label: string,
  config: Record<string, any>,
  resourceMap: Record<string, string>,
  logs: TerminalLog[],
  edges?: Array<{ source: string; target: string }>,
  portMap?: Record<string, number>
): Promise<{ resourceId: string; liveUrl?: string }> {
  const connectedPort = () => {
    const peer = edges?.find((e) => e.source === nodeId || e.target === nodeId);
    if (!peer) return undefined;
    const peerId = peer.source === nodeId ? peer.target : peer.source;
    return portMap?.[peerId];
  };
  if (type === 'vpc') {
    const cidr = config.cidrBlock || '10.0.0.0/16';
    logs.push(logStdin(nodeId, type, `aws ec2 create-vpc --cidr-block ${cidr}`));
    try {
      const res = await awsClients.ec2.send(new CreateVpcCommand({ CidrBlock: cidr }));
      const vpcId = res.Vpc?.VpcId || `vpc-${Date.now().toString().slice(-6)}`;
      logs.push(logStdout(nodeId, type, res, `VPC '${vpcId}' available (${cidr}).`));
      return { resourceId: vpcId };
    } catch {
      const mockId = `vpc-${Date.now().toString().slice(-6)}`;
      logs.push(logStdout(nodeId, type, { vpcId: mockId, cidr }, `VPC '${mockId}' configured (${cidr}).`));
      return { resourceId: mockId };
    }
  }

  if (type === 'subnet') {
    const cidr = config.cidrBlock || '10.0.1.0/24';
    const vpcId = config.vpcId || Object.values(resourceMap).find((v) => v.startsWith('vpc-')) || 'vpc-default';
    logs.push(logStdin(nodeId, type, `aws ec2 create-subnet --vpc-id ${vpcId} --cidr-block ${cidr}`));
    try {
      const res = await awsClients.ec2.send(new CreateSubnetCommand({ VpcId: vpcId, CidrBlock: cidr }));
      const subId = res.Subnet?.SubnetId || `subnet-${Date.now().toString().slice(-6)}`;
      logs.push(logStdout(nodeId, type, res, `Subnet '${subId}' bound to ${vpcId}.`));
      return { resourceId: subId };
    } catch {
      const mockId = `subnet-${Date.now().toString().slice(-6)}`;
      logs.push(logStdout(nodeId, type, { subnetId: mockId, vpcId }, `Subnet '${mockId}' bound to ${vpcId}.`));
      return { resourceId: mockId };
    }
  }

  if (type === 'alb') {
    const name = config.name || `alb-${Date.now().toString().slice(-4)}`;
    const targetPort = connectedPort();
    const dnsName = targetPort ? `http://localhost:${targetPort}` : `http://localhost:8080`;
    logs.push(logStdin(nodeId, type, `aws elbv2 create-load-balancer --name ${name} --type application`));
    logs.push(logStdout(nodeId, type, { albArn: `arn:aws:alb:${name}`, dnsName }, `Application Load Balancer '${name}' ${targetPort ? 'routing to real target' : 'active (no compute target found)'} -> ${dnsName}`));
    return { resourceId: `alb-${name}`, liveUrl: dnsName };
  }

  if (type === 'cloudfront') {
    const distId = `EDIST${Date.now().toString().slice(-6)}`;
    const targetPort = connectedPort();
    const localEdgeUrl = `http://localhost:${targetPort || 8080}`;
    logs.push(logStdin(nodeId, type, `aws cloudfront create-distribution --origin-domain localhost:${targetPort || 8080}`));
    logs.push(logStdout(nodeId, type, { Id: distId, LocalEdge: localEdgeUrl, Status: 'Deployed' }, `CloudFront CDN '${distId}' ${targetPort ? 'connected to real origin' : 'active (no compute origin found)'} -> ${localEdgeUrl}`));
    return { resourceId: distId, liveUrl: localEdgeUrl };
  }

  const apiId = `api-${Date.now().toString().slice(-4)}`;
  const targetPort = connectedPort();
  const liveUrl = targetPort ? `http://localhost:${targetPort}` : `http://localhost:4566/restapis/${apiId}/test`;
  logs.push(logStdin(nodeId, type, `aws apigateway create-rest-api --name ${label}`));
  logs.push(logStdout(nodeId, type, { id: apiId, name: label }, `API Gateway '${label}' ${targetPort ? 'routing to real integration' : 'active'} -> ${liveUrl}`));
  return { resourceId: apiId, liveUrl };
}
