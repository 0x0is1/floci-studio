import http from 'node:http';
import { generateWebHtml, getOsReleaseContent } from './webTemplates';

export function dockerReq(method: string, path: string, data?: any): Promise<{ status: number; body: any }> {
  return new Promise((resolve) => {
    const req = http.request(
      { socketPath: '/var/run/docker.sock', path, method, headers: { 'Content-Type': 'application/json' }, timeout: 2000 },
      (res) => {
        let text = '';
        res.on('data', (c) => (text += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode || 500, body: JSON.parse(text) });
          } catch {
            resolve({ status: res.statusCode || 500, body: text });
          }
        });
      }
    );
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 500, body: 'Socket request timed out' });
    });
    req.on('error', (err) => resolve({ status: 500, body: err.message }));
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

export class DockerService {
  public async launchEc2Web(
    port: number,
    info: {
      id: string;
      name: string;
      s3?: string;
      sqs?: string;
      template?: string;
      ami?: string;
      instanceType?: string;
      projectId?: string;
      envVars?: Record<string, string>;
    }
  ): Promise<boolean> {
    const pid = info.projectId || 'default';
    const containerName = `floci-ec2-${pid}-${info.id}-${port}`;

    const list = await dockerReq('GET', '/containers/json?all=true');
    if (Array.isArray(list.body)) {
      for (const c of list.body) {
        const matchesPort = c.Ports?.some((p: any) => p.PublicPort === port);
        const isEc2 = c.Names?.some((n: string) => n.includes('floci-ec2'));
        if (matchesPort && isEc2) await dockerReq('DELETE', `/containers/${c.Id}?force=true`);
      }
    }

    const html = generateWebHtml({ port, id: info.id, name: info.name, s3: info.s3, sqs: info.sqs, template: info.template, ami: info.ami, instanceType: info.instanceType });
    const b64 = Buffer.from(html).toString('base64');
    const osRelease = getOsReleaseContent(info.ami);
    const osB64 = Buffer.from(osRelease).toString('base64');
    const envEntries = Object.entries(info.envVars || {});
    const envLines = envEntries.map(([k, v]) => `export ${k}='${v}'\n${k}='${v}'`).join('\n');
    const envB64 = Buffer.from(envLines).toString('base64');

    const cmd = ['sh', '-c', `echo '${osB64}' | base64 -d > /etc/os-release && echo '${envB64}' | base64 -d > /etc/environment && mkdir -p /etc/profile.d && echo '${envB64}' | base64 -d > /etc/profile.d/floci_env.sh && echo '${envB64}' | base64 -d >> /etc/profile && echo '${envB64}' | base64 -d >> /root/.profile && echo '${envB64}' | base64 -d >> /root/.bashrc && echo '${b64}' | base64 -d > /usr/share/nginx/html/index.html && nginx -g 'daemon off;'`];

    const createRes = await dockerReq('POST', `/containers/create?name=${containerName}`, {
      Image: 'nginx:alpine',
      Cmd: cmd,
      Env: ['ENV=/etc/profile', 'SHELL=/bin/sh', ...envEntries.map(([k, v]) => `${k}=${v}`)],
      ExposedPorts: { '80/tcp': {} },
      Labels: { 'floci.project': pid, 'floci.node': info.id, 'floci.port': String(port), 'floci.ami': info.ami || 'ami-ubuntu2404-amd64' },
      HostConfig: {
        PortBindings: { '80/tcp': [{ HostPort: String(port) }] },
        AutoRemove: true,
      },
    });

    if (createRes.status !== 201) return false;
    const startRes = await dockerReq('POST', `/containers/${createRes.body.Id}/start`);
    return startRes.status === 204;
  }

  public async stopEc2Web(port?: number, projectId?: string): Promise<void> {
    const list = await dockerReq('GET', '/containers/json?all=true');
    if (Array.isArray(list.body)) {
      for (const c of list.body) {
        const matchesPort = Boolean(port && (c.Ports?.some((p: any) => p.PublicPort === port) || c.Labels?.['floci.port'] === String(port)));
        const matchesProject = Boolean(projectId && (c.Labels?.['floci.project'] === projectId || c.Names?.some((n: string) => n.includes(projectId))));
        const isEc2 = c.Names?.some((n: string) => n.includes('floci-ec2'));
        if (isEc2 && (matchesPort || matchesProject)) await dockerReq('DELETE', `/containers/${c.Id}?force=true`);
      }
    }
  }
}

export const dockerService = new DockerService();
