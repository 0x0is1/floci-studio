import { Elysia, t } from 'elysia';
import { listTestFiles, saveTestFile, deleteTestFile } from '@/services/testRunnerFileService';
import { runTests } from '@/services/testRunnerExecService';

export const testRunnerController = new Elysia({ prefix: '/api/testrunner' })
  .get('/:projectId/:nodeId/files', ({ params }) => {
    return { success: true, files: listTestFiles(params.projectId, params.nodeId) };
  })
  .post(
    '/:projectId/:nodeId/files',
    async ({ params, body }) => {
      const saved = await saveTestFile(params.projectId, params.nodeId, body.file.name, body.file);
      return { success: true, file: saved };
    },
    { body: t.Object({ file: t.File() }) }
  )
  .delete('/:projectId/:nodeId/files/:filename', ({ params }) => {
    const ok = deleteTestFile(params.projectId, params.nodeId, params.filename);
    return { success: ok };
  })
  .post(
    '/:projectId/:nodeId/run',
    async ({ params, body }) => {
      const result = await runTests(params.projectId, params.nodeId, body.networkAccess || 'vpc_only');
      return { success: true, result };
    },
    { body: t.Object({ networkAccess: t.Optional(t.String()) }) }
  );
