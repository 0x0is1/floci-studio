import { dockerReq } from './dockerService';
import { getOsReleaseContent } from './webTemplates';
import { projectService } from './projectService';
import { parseDockerStream } from './dockerStreamParser';
import { resolveInjectedEnvVars } from './envResolver';

export interface ExecRequest {
  port: number;
  command: string;
  mode?: 'ssh' | 'ssm';
  keyName?: string;
}

export interface ExecResponse {
  success: boolean;
  prompt: string;
  output: string;
  exitCode: number;
  mode: 'ssh' | 'ssm';
}

function resolveEc2Context(port: number): { ami: string; envList: string[] } {
  let ami = 'ami-ubuntu2404-amd64';
  const envList: string[] = ['ENV=/etc/profile', 'SHELL=/bin/sh'];

  for (const p of projectService.listProjects()) {
    const full = projectService.getProject(p.id);
    if (!full) continue;
    const ec2 = full.nodes.find((n) => n.data.serviceType === 'ec2' && (n.data.config?.port || 8080) === port);
    if (ec2) {
      if (ec2.data.config?.ami) ami = ec2.data.config.ami;
      const resolved = resolveInjectedEnvVars(ec2.id, (full.edges || []) as any, {}, full.nodes as any);
      for (const [k, v] of Object.entries(resolved)) envList.push(`${k}=${v}`);
      break;
    }
  }
  return { ami, envList };
}

export class Ec2ExecService {
  public async execute(req: ExecRequest): Promise<ExecResponse> {
    const { port, command, mode = 'ssh', keyName = 'default-key' } = req;
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

    const { ami, envList } = resolveEc2Context(port);
    const user = ami.includes('ubuntu') ? 'ubuntu' : ami.includes('debian') ? 'admin' : 'ec2-user';
    const prompt = mode === 'ssh' ? `${user}@localhost (key: ${keyName}) $` : `ssm-user@i-ec2-web-${port} (session) $`;

    const trimmed = command.trim();
    if (trimmed === 'cat /etc/os-release' || trimmed === 'cat /usr/lib/os-release' || trimmed === 'cat /etc/issue') {
      return { success: true, prompt, output: getOsReleaseContent(ami).trim(), exitCode: 0, mode };
    }
    if (trimmed === 'uname -a') {
      const out = ami.includes('ubuntu')
        ? 'Linux ubuntu-noble 6.8.0-1017-aws #18-Ubuntu SMP Thu Oct 10 12:00:00 UTC 2026 x86_64 x86_64 x86_64 GNU/Linux'
        : 'Linux al2023-node 6.1.115-126.197.amzn2023.x86_64 #1 SMP PREEMPT_DYNAMIC Wed Oct 28 15:00:00 UTC 2026 x86_64 x86_64 x86_64 GNU/Linux';
      return { success: true, prompt, output: out, exitCode: 0, mode };
    }

    const runCmd = trimmed.startsWith('$') && !trimmed.includes(' ') ? `echo "${trimmed}"` : command;
    const exportOverrides = envList.map((e) => `export ${e}`).join('; ');
    const wrappedCmd = `[ -f /etc/profile.d/floci_env.sh ] && . /etc/profile.d/floci_env.sh 2>/dev/null; [ -f /etc/profile ] && . /etc/profile 2>/dev/null; [ -f /etc/environment ] && . /etc/environment 2>/dev/null; ${exportOverrides}; ${runCmd}`;

    const createRes = await dockerReq('POST', `/containers/${targetContainer}/exec`, {
      AttachStdout: true, AttachStderr: true, Tty: false, Cmd: ['sh', '-c', wrappedCmd], Env: envList,
    });
    if (createRes.status !== 201 || !createRes.body?.Id) {
      return { success: false, prompt, output: 'Error: Unable to connect to EC2 container. Ensure instance is running.', exitCode: 1, mode };
    }
    const startRes = await dockerReq('POST', `/exec/${createRes.body.Id}/start`, { Detach: false, Tty: false });
    const output = parseDockerStream(startRes.body);
    return { success: true, prompt, output: output || '(Command completed with 0 output)', exitCode: 0, mode };
  }
}

export const ec2ExecService = new Ec2ExecService();
