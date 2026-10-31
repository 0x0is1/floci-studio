import { dockerReq } from './dockerService';
import { getOsReleaseContent } from './webTemplates';
import { projectService } from './projectService';
import { parseDockerStream } from './dockerStreamParser';

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

function resolveAmi(port: number, containerAmi?: string): string {
  if (containerAmi) return containerAmi;
  for (const p of projectService.listProjects()) {
    const full = projectService.getProject(p.id);
    const ec2 = full?.nodes.find((n) => n.data.serviceType === 'ec2' && (n.data.config?.port || 8080) === port);
    if (ec2?.data.config?.ami) return ec2.data.config.ami;
  }
  return 'ami-ubuntu2404-amd64';
}

export class Ec2ExecService {
  public async execute(req: ExecRequest): Promise<ExecResponse> {
    const { port, command, mode = 'ssh', keyName = 'default-key' } = req;
    let targetContainer = `floci-ec2-web-${port}`;
    let containerAmi = '';

    const listRes = await dockerReq('GET', '/containers/json');
    if (Array.isArray(listRes.body)) {
      const match = listRes.body.find((c: any) =>
        c.Ports?.some((p: any) => p.PublicPort === port) ||
        c.Labels?.['floci.port'] === String(port) ||
        c.Names?.some((n: string) => n.includes(`-${port}`))
      );
      if (match?.Id) {
        targetContainer = match.Id;
        containerAmi = match.Labels?.['floci.ami'] || '';
      }
    }

    const ami = resolveAmi(port, containerAmi);
    const user = ami.includes('ubuntu') ? 'ubuntu' : ami.includes('debian') ? 'admin' : 'ec2-user';
    const prompt = mode === 'ssh' ? `${user}@localhost (key: ${keyName}) $` : `ssm-user@i-ec2-web-${port} (session) $`;

    const trimmed = command.trim();
    if (trimmed === 'cat /etc/os-release' || trimmed === 'cat /usr/lib/os-release' || trimmed === 'cat /etc/issue') {
      return { success: true, prompt, output: getOsReleaseContent(ami).trim(), exitCode: 0, mode };
    }
    if (trimmed === 'uname -a') {
      const isUbuntu = ami.includes('ubuntu');
      const out = isUbuntu
        ? 'Linux ubuntu-noble 6.8.0-1017-aws #18-Ubuntu SMP Thu Oct 10 12:00:00 UTC 2026 x86_64 x86_64 x86_64 GNU/Linux'
        : 'Linux al2023-node 6.1.115-126.197.amzn2023.x86_64 #1 SMP PREEMPT_DYNAMIC Wed Oct 28 15:00:00 UTC 2026 x86_64 x86_64 x86_64 GNU/Linux';
      return { success: true, prompt, output: out, exitCode: 0, mode };
    }
    if (trimmed.startsWith('lsb_release')) {
      const isUbuntu = ami.includes('ubuntu');
      const out = isUbuntu
        ? 'No LSB modules are available.\nDistributor ID:\tUbuntu\nDescription:\tUbuntu 24.04 LTS\nRelease:\t24.04\nCodename:\tnoble'
        : 'LSB Version:\t:core-5.0-amd64:core-5.0-noarch\nDistributor ID:\tAmazon\nDescription:\tAmazon Linux release 2023 (Amazon Linux)\nRelease:\t2023\nCodename:\tAL2023';
      return { success: true, prompt, output: out, exitCode: 0, mode };
    }

    const wrappedCmd = `[ -f /etc/environment ] && . /etc/environment 2>/dev/null; ${command}`;
    const createRes = await dockerReq('POST', `/containers/${targetContainer}/exec`, {
      AttachStdout: true, AttachStderr: true, Tty: false, Cmd: ['sh', '-c', wrappedCmd],
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
