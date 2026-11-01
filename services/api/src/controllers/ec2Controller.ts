import { Elysia, t } from 'elysia';
import { keyPairService } from '@/services/keyPairService';
import { ec2ExecService } from '@/services/ec2ExecService';

export const ec2Controller = new Elysia({ prefix: '/api/ec2' })
  .get('/keys/:projectId', ({ params }) => {
    return { success: true, keys: keyPairService.listProjectKeys(params.projectId) };
  })
  .post(
    '/keys/generate',
    ({ body }) => {
      const { projectId, keyName } = body;
      const res = keyPairService.getOrCreateProjectKey(projectId, keyName || 'default-key');
      return { success: true, key: res };
    },
    {
      body: t.Object({
        projectId: t.String(),
        keyName: t.Optional(t.String()),
      }),
    }
  )
  .get('/keys/:projectId/:keyName/download', ({ params, set }) => {
    const pem = keyPairService.getKeyPem(params.projectId, params.keyName);
    if (!pem) {
      set.status = 404;
      return { success: false, error: 'Key not found' };
    }
    set.headers['Content-Type'] = 'application/x-pem-file';
    set.headers['Content-Disposition'] = `attachment; filename="${params.keyName}.pem"`;
    return pem;
  })
  .post(
    '/exec',
    async ({ body }) => {
      const { port, command, keyName, projectId } = body;
      const res = await ec2ExecService.execute({ port, command, keyName, projectId });
      return res;
    },
    {
      body: t.Object({
        port: t.Number(),
        command: t.String(),
        keyName: t.Optional(t.String()),
        projectId: t.Optional(t.String()),
      }),
    }
  );
