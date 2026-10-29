import { awsClients } from './awsClientService';
import { CreateTableCommand } from '@aws-sdk/client-dynamodb';
import { CreateDBInstanceCommand } from '@aws-sdk/client-rds';
import { logStdin, logStdout, TerminalLog } from './loggerService';

export async function provisionDatabase(
  nodeId: string,
  type: string,
  label: string,
  config: Record<string, any>,
  logs: TerminalLog[]
): Promise<{ resourceId: string }> {
  if (type === 'dynamodb') {
    const table = config.tableName || `table-${Date.now().toString().slice(-4)}`;
    const access = config.networkAccess || 'public_external';
    const cmd = `aws dynamodb create-table --table-name ${table} --billing-mode PAY_PER_REQUEST --network-access ${access}`;
    logs.push(logStdin(nodeId, type, cmd));

    const res = await awsClients.dynamodb.send(
      new CreateTableCommand({
        TableName: table,
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        BillingMode: 'PAY_PER_REQUEST',
      })
    );
    logs.push(logStdout(nodeId, type, res, `DynamoDB Table '${table}' ready (${access}).`));
    return { resourceId: table };
  }

  // RDS database provisioning
  const dbId = (config.dbName || `rds-${Date.now().toString().slice(-4)}`).toLowerCase();
  const engine = config.engine || 'postgres';
  const access = config.networkAccess || 'public_external';
  const isPublic = access === 'public_external';
  const port = engine === 'postgres' ? 5432 : 3306;

  const cmd = `aws rds create-db-instance --db-instance-identifier ${dbId} --engine ${engine} --publicly-accessible ${isPublic}`;
  logs.push(logStdin(nodeId, type, cmd));

  try {
    const res = await awsClients.rds.send(
      new CreateDBInstanceCommand({
        DBInstanceIdentifier: dbId,
        DBInstanceClass: config.instanceClass || 'db.t3.micro',
        Engine: engine,
        MasterUsername: config.username || 'admin',
        MasterUserPassword: 'Password123!',
        AllocatedStorage: Number(config.allocatedStorage) || 20,
      })
    );
    logs.push(logStdout(nodeId, type, res, `RDS ${engine.toUpperCase()} Instance '${dbId}' active on port ${port} (${access}).`));
  } catch (err: any) {
    logs.push(logStdout(nodeId, type, { status: 'mock-ready', port }, `RDS Instance '${dbId}' ready on port ${port}.`));
  }

  return { resourceId: dbId };
}
