import { dockerReq } from './dockerService';

export async function initFlociRdsPostgres(dbName = 'app_production', user = 'postgres', pass = 'postgres') {
  const list = await dockerReq('GET', '/containers/json');
  if (!Array.isArray(list.body)) return;
  const matches = list.body
    .filter((c: any) =>
      c.Names?.some((n: string) => n.includes('floci-aws-rds-db')) ||
      c.Labels?.['io.floci.service'] === 'rds'
    )
    .sort((a: any, b: any) => (b.Created || 0) - (a.Created || 0));
  const match = matches[0];
  if (!match?.Id) return;

  const initCmd = [
    'sh', '-c',
    `psql -U admin -d admin -c "DO \\$\\$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${user}') THEN CREATE ROLE ${user} WITH LOGIN SUPERUSER PASSWORD '${pass}'; ELSE ALTER ROLE ${user} WITH LOGIN SUPERUSER PASSWORD '${pass}'; END IF; END \\$\\$;" && psql -U admin -d admin -tc "SELECT 1 FROM pg_database WHERE datname = '${dbName}'" | grep -q 1 || psql -U admin -d admin -c "CREATE DATABASE ${dbName} OWNER ${user};"`
  ];

  const exec = await dockerReq('POST', `/containers/${match.Id}/exec`, {
    AttachStdout: false, AttachStderr: false, Tty: false, Cmd: initCmd,
  });
  if (exec.body?.Id) {
    await dockerReq('POST', `/exec/${exec.body.Id}/start`, { Detach: true, Tty: false });
  }
}
