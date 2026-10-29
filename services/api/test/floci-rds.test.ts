import { describe, expect, test } from 'bun:test';
import { CreateDBInstanceCommand, DescribeDBInstancesCommand, RDSClient } from '@aws-sdk/client-rds';

const flociConfig = {
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
  credentials: { accessKeyId: 'test', secretAccessKey: 'test' },
};

describe('Floci RDS Testing', () => {
  test(
    'RDS: Describe and Create Database Instance',
    async () => {
      const rds = new RDSClient(flociConfig);
      const dbId = `test-pg-fast-${Date.now()}`;

      const res = await rds.send(
        new CreateDBInstanceCommand({
          DBInstanceIdentifier: dbId,
          DBInstanceClass: 'db.t3.micro',
          Engine: 'postgres',
          MasterUsername: 'postgres',
          MasterUserPassword: 'Password123!',
          AllocatedStorage: 20,
        })
      );
      expect(res.DBInstance?.DBInstanceIdentifier).toBe(dbId);

      const desc = await rds.send(
        new DescribeDBInstancesCommand({ DBInstanceIdentifier: dbId })
      );
      expect(desc.DBInstances?.[0]?.DBInstanceIdentifier).toBe(dbId);
    },
    { timeout: 30000 }
  );
});
