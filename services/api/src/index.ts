import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { config } from '@/config/env';
import { projectController } from '@/controllers/projectController';
import { healthController } from '@/controllers/healthController';
import { orchestratorController } from '@/controllers/orchestratorController';
import { ec2Controller } from '@/controllers/ec2Controller';
import { flociResourceController } from '@/controllers/flociResourceController';
import { testRunnerController } from '@/controllers/testRunnerController';
import { deployStreamController } from '@/controllers/deployStreamController';

const app = new Elysia()
  .use(
    cors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )
  .use(healthController)
  .use(projectController)
  .use(orchestratorController)
  .use(ec2Controller)
  .use(flociResourceController)
  .use(testRunnerController)
  .use(deployStreamController)
  .listen(config.port);

console.log(`Floci API server running at http://localhost:${config.port}`);
console.log(`Connecting to Floci emulator at ${config.flociEndpoint}`);

export type App = typeof app;
