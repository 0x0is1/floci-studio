import { Elysia, t } from 'elysia';
import { dockerService } from '@/services/dockerService';
import { getRuntimeState } from '@/services/runtimeStateService';
import {
  deleteS3Bucket,
  deleteSqsQueue,
  deleteDynamoTable,
  purgeAllFlociResources,
} from '@/services/resourceTeardownService';

export const flociResourceController = new Elysia({ prefix: '/api/floci' })
  .get('/resources', async () => {
    return await getRuntimeState();
  })
  .delete(
    '/resources/:service/:id',
    async ({ params }) => {
      const { service, id } = params;
      try {
        if (service === 's3') {
          await deleteS3Bucket(id);
          return { success: true, message: `Bucket ${id} deleted` };
        }
        if (service === 'sqs') {
          await deleteSqsQueue(decodeURIComponent(id));
          return { success: true, message: `Queue deleted` };
        }
        if (service === 'dynamodb') {
          await deleteDynamoTable(id);
          return { success: true, message: `Table ${id} deleted` };
        }
        if (service === 'ec2') {
          await dockerService.stopEc2Web(Number(id) || 8080);
          return { success: true, message: `EC2 container on port ${id} stopped` };
        }
        return { success: false, message: `Unknown service ${service}` };
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
      for (const bucket of state.s3.buckets) {
        await deleteS3Bucket(bucket);
      }
      for (const queue of state.sqs.queues) {
        await deleteSqsQueue(queue);
      }
      for (const table of state.dynamodb.tables) {
        await deleteDynamoTable(table);
      }
      for (const port of state.runningPorts) {
        await dockerService.stopEc2Web(port);
      }
      await purgeAllFlociResources();
      return { success: true, message: 'All Floci resources purged successfully' };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  });
