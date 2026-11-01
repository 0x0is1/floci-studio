import { dockerReq } from './dockerService';
import { getOsReleaseContent } from './webTemplates';
import { projectService } from './projectService';
import { parseDockerStream } from './dockerStreamParser';
import { resolveInjectedEnvVars } from './envResolver';
import { getBootstrapScript } from './aptShim';
import { buildTcpForwardScript } from './tcpForwardService';

export interface ExecRequest {
  port: number;
  command: string;
  keyName?: string;
  projectId?: string;
}

export interface ExecResponse {
  success: boolean;
  prompt: string;
  output: string;
  exitCode: number;
}

export function resolveEc2Context(port: number, projectId?: string): { ami: string; envList: string[] } {
  let ami = 'ami-ubuntu2404-amd64';
  const envList: string[] = ['ENV=/etc/profile', 'SHELL=/bin/sh'];

  const candidateProjects = projectId
    ? [projectId]
    : projectService.listProjects().map((p) => p.id);

  for (const id of candidateProjects) {
    const full = projectService.getProject(id);
    if (!full) continue;
    const node = full.nodes.find((n) => ['ec2', 'ecs'].includes(n.data.serviceType) && (n.data.config?.port || 8080) === port);
    if (node) {
      if (node.data.config?.ami) ami = node.data.config.ami;
      else if (node.data.config?.image) ami = node.data.config.image;
      const resolved = resolveInjectedEnvVars(node.id, (full.edges || []) as any, {}, full.nodes as any);
      for (const [k, v] of Object.entries(resolved)) envList.push(`${k}=${v}`);
      break;
    }
  }
  return { ami, envList };
}

export class Ec2ExecService {
  public async execute(req: ExecRequest): Promise<ExecResponse> {
    const { port, command, keyName = 'default-key', projectId } = req;
    let targetContainer = `floci-ec2-web-${port}`;

    const listRes = await dockerReq('GET', '/containers/json');
    if (Array.isArray(listRes.body)) {
      const match = listRes.body.find((c: any) =>
        c.Ports?.some((p: any) => p.PublicPort === port) ||
        c.Labels?.['floci.port'] === String(port) ||
        c.Names?.some((n: string) => n.includes(`-${port}`))
      );
      if (match?.Id) targetContainer = match.Id;
    }

    const { ami, envList } = resolveEc2Context(port, projectId);
    const user = ami.includes('ubuntu') ? 'ubuntu' : ami.includes('debian') ? 'admin' : 'ec2-user';
    const prompt = `${user}@localhost (key: ${keyName}) $`;

    const trimmed = command.trim();
    if (trimmed === 'cat /etc/os-release' || trimmed === 'cat /usr/lib/os-release' || trimmed === 'cat /etc/issue') {
      return { success: true, prompt, output: getOsReleaseContent(ami).trim(), exitCode: 0 };
    }
    if (trimmed === 'uname -a') {
      const out = ami.includes('ubuntu')
        ? 'Linux ubuntu-noble 6.8.0-1017-aws #18-Ubuntu SMP Thu Oct 10 12:00:00 UTC 2026 x86_64 x86_64 x86_64 GNU/Linux'
        : 'Linux al2023-node 6.1.115-126.197.amzn2023.x86_64 #1 SMP PREEMPT_DYNAMIC Wed Oct 28 15:00:00 UTC 2026 x86_64 x86_64 x86_64 GNU/Linux';
      return { success: true, prompt, output: out, exitCode: 0 };
    }

    const runCmd = trimmed.startsWith('$') && !trimmed.includes(' ') ? `echo "${trimmed}"` : command;
    const exportOverrides = envList.map((e) => `export ${e}`).join('; ');
    const boot = getBootstrapScript();
    const tcpFwd = await buildTcpForwardScript();
    const wrappedCmd = `${boot}; ${tcpFwd}[ -f /etc/profile.d/floci_env.sh ] && . /etc/profile.d/floci_env.sh 2>/dev/null; [ -f /etc/profile ] && . /etc/profile 2>/dev/null; [ -f /etc/environment ] && . /etc/environment 2>/dev/null; ${exportOverrides}; ${runCmd}`;

    const createRes = await dockerReq('POST', `/containers/${targetContainer}/exec`, {
      AttachStdout: true, AttachStderr: true, Tty: false, Cmd: ['sh', '-c', wrappedCmd], Env: envList,
    });
    if (createRes.status !== 201 || !createRes.body?.Id) {
      return { success: false, prompt, output: 'Error: Unable to connect to container. Ensure instance is running.', exitCode: 1 };
    }
    const startRes = await dockerReq('POST', `/exec/${createRes.body.Id}/start`, { Detach: false, Tty: false });
    const output = parseDockerStream(startRes.body);
    return { success: true, prompt, output: output || '(Command completed with 0 output)', exitCode: 0 };
  }
}

export const ec2ExecService = new Ec2ExecService();
