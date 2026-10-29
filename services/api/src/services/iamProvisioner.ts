import { awsClients } from './awsClientService';
import { CreateRoleCommand, PutRolePolicyCommand, DeleteRolePolicyCommand, DeleteRoleCommand } from '@aws-sdk/client-iam';
import { CanvasNode, CanvasEdge } from '@/models/project';
import { logStdin, logStdout, TerminalLog } from './loggerService';

export class IamProvisioner {
  public async provisionProjectIam(nodes: CanvasNode[], edges: CanvasEdge[], logs: TerminalLog[]) {
    const rolesToProvision: Record<string, { service: string; actions: Set<string>; nodeId: string }> = {};

    for (const node of nodes) {
      const type = node.data.serviceType;
      const roleName = node.data.config?.iamRole || (['ec2', 'lambda'].includes(type) ? `${node.data.label.toLowerCase().replace(/[^a-z0-9-]/g, '-')}-role` : null);
      if (!roleName) continue;

      const principal = type === 'lambda' ? 'lambda.amazonaws.com' : 'ec2.amazonaws.com';
      if (!rolesToProvision[roleName]) {
        rolesToProvision[roleName] = { service: principal, actions: new Set<string>(), nodeId: node.id };
      }

      if (Array.isArray(node.data.config?.iamPolicies)) {
        node.data.config.iamPolicies.forEach((p: string) => rolesToProvision[roleName].actions.add(p));
      }
      const nodeEdges = edges.filter((e) => e.source === node.id && e.data?.iamPolicy);
      nodeEdges.forEach((e) => {
        const parts = String(e.data?.iamPolicy).split(',').map((s) => s.trim()).filter(Boolean);
        parts.forEach((p) => rolesToProvision[roleName].actions.add(p));
      });
    }

    for (const [roleName, info] of Object.entries(rolesToProvision)) {
      try {
        const trustPolicy = JSON.stringify({
          Version: '2012-10-17',
          Statement: [{ Effect: 'Allow', Principal: { Service: info.service }, Action: 'sts:AssumeRole' }],
        });
        logs.push(logStdin(info.nodeId, 'iam', `aws iam create-role --role-name ${roleName}`));
        try {
          const createRes = await awsClients.iam.send(new CreateRoleCommand({ RoleName: roleName, AssumeRolePolicyDocument: trustPolicy }));
          logs.push(logStdout(info.nodeId, 'iam', createRes, `IAM Role '${roleName}' created (${createRes.Role?.Arn}).`));
        } catch (e: any) {
          if (!e.message?.includes('EntityAlreadyExists') && !e.name?.includes('EntityAlreadyExists')) throw e;
        }

        const actions = Array.from(info.actions);
        if (actions.length > 0) {
          const policyDoc = JSON.stringify({
            Version: '2012-10-17',
            Statement: [{ Effect: 'Allow', Action: actions, Resource: '*' }],
          });
          const policyName = `${roleName}-policy`;
          logs.push(logStdin(info.nodeId, 'iam', `aws iam put-role-policy --role-name ${roleName} --policy-name ${policyName}`));
          const putRes = await awsClients.iam.send(new PutRolePolicyCommand({ RoleName: roleName, PolicyName: policyName, PolicyDocument: policyDoc }));
          logs.push(logStdout(info.nodeId, 'iam', putRes, `Attached policy '${policyName}' with [${actions.join(', ')}].`));
        }
      } catch (err: any) {
        logs.push(logStdin(info.nodeId, 'iam', `IAM provision warning: ${err.message}`));
      }
    }
  }

  public async teardownProjectIam(nodes: CanvasNode[]) {
    for (const node of nodes) {
      const roleName = node.data.config?.iamRole;
      if (!roleName) continue;
      try {
        await awsClients.iam.send(new DeleteRolePolicyCommand({ RoleName: roleName, PolicyName: `${roleName}-policy` }));
      } catch {}
      try {
        await awsClients.iam.send(new DeleteRoleCommand({ RoleName: roleName }));
      } catch {}
    }
  }
}

export const iamProvisioner = new IamProvisioner();
