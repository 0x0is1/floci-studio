import { dockerReq } from './dockerService';

export async function launchContainer(opts: {
  namePrefix: string;
  containerName: string;
  image: string;
  containerPort: number;
  hostPort: number;
  env?: Record<string, string>;
  labels?: Record<string, string>;
  cmd?: string[];
}): Promise<boolean> {
  const list = await dockerReq('GET', '/containers/json?all=true');
  if (Array.isArray(list.body)) {
    for (const c of list.body) {
      const matchesPort = c.Ports?.some((p: any) => p.PublicPort === opts.hostPort);
      const isSameKind = c.Names?.some((n: string) => n.includes(opts.namePrefix));
      if (matchesPort && isSameKind) await dockerReq('DELETE', `/containers/${c.Id}?force=true`);
    }
  }

  const envList = Object.entries(opts.env || {}).map(([k, v]) => `${k}=${v}`);
  const createRes = await dockerReq('POST', `/containers/create?name=${opts.containerName}`, {
    Image: opts.image,
    Cmd: opts.cmd,
    Env: envList,
    ExposedPorts: { [`${opts.containerPort}/tcp`]: {} },
    Labels: opts.labels || {},
    HostConfig: {
      PortBindings: { [`${opts.containerPort}/tcp`]: [{ HostPort: String(opts.hostPort) }] },
      NetworkMode: 'oss_floci_net',
      AutoRemove: true,
    },
  });

  if (createRes.status !== 201) return false;
  const startRes = await dockerReq('POST', `/containers/${createRes.body.Id}/start`);
  return startRes.status === 204;
}

export async function stopContainer(namePrefix: string, port?: number, projectId?: string): Promise<void> {
  const list = await dockerReq('GET', '/containers/json?all=true');
  if (Array.isArray(list.body)) {
    for (const c of list.body) {
      const matchesPort = Boolean(port && c.Ports?.some((p: any) => p.PublicPort === port));
      const matchesProject = Boolean(projectId && c.Labels?.['floci.project'] === projectId);
      const isKind = c.Names?.some((n: string) => n.includes(namePrefix));
      if (isKind && (matchesPort || matchesProject || (!port && !projectId))) await dockerReq('DELETE', `/containers/${c.Id}?force=true`);
    }
  }
}
