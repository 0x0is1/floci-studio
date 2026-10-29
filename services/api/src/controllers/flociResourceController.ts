import { Elysia, t } from 'elysia';
import { getRuntimeState } from '@/services/runtimeStateService';
import { deleteResourceByName, purgeAllFlociResources } from '@/services/resourceTeardownService';

export const flociResourceController = new Elysia({ prefix: '/api/floci' })
  .get('/resources', async () => {
    return await getRuntimeState();
  })
  .delete(
    '/resources/:service/:id',
    async ({ params }) => {
      const { service, id } = params;
      try {
        await deleteResourceByName(service, id);
        return { success: true, message: `Resource ${id} deleted` };
      } catch (err: any) {
        return { success: false, message: err.message };
      }
    },
    {
      params: t.Object({ service: t.String(), id: t.String() }),
    }
  )
  .post('/resources/purge-all', async () => {
    try {
      const state = await getRuntimeState();
      for (const bucket of state.s3?.buckets || []) await deleteResourceByName('s3', bucket);
      for (const queue of state.sqs?.queues || []) await deleteResourceByName('sqs', queue);
      for (const table of state.dynamodb?.tables || []) await deleteResourceByName('dynamodb', table);
      for (const port of state.runningPorts || []) await deleteResourceByName('ec2', String(port));
      for (const rds of state.rds?.instances || []) await deleteResourceByName('rds', rds);
      for (const fn of state.lambda?.functions || []) await deleteResourceByName('lambda', fn);
      for (const sn of state.sns?.topics || []) await deleteResourceByName('sns', sn);
      for (const sc of state.secrets?.secrets || []) await deleteResourceByName('secrets', sc);
      for (const lg of state.logs?.logGroups || []) await deleteResourceByName('logs', lg);
      for (const eb of state.eventbridge?.buses || []) await deleteResourceByName('eventbridge', eb);
      await purgeAllFlociResources();
      return { success: true, message: 'All Floci resources purged successfully' };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  });
