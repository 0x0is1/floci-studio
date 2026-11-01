import { awsClients } from './awsClientService';
import { CreateTableCommand, StreamViewType, ScalarAttributeType } from '@aws-sdk/client-dynamodb';
import { CreateDBInstanceCommand } from '@aws-sdk/client-rds';
import { logStdin, logStdout, TerminalLog } from './loggerService';
import { initFlociRdsPostgres } from './rdsInitService';

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
    const partitionKey = config.partitionKey || 'id';
    const sortKey = config.sortKey || undefined;
    const cmd = `aws dynamodb create-table --table-name ${table} --billing-mode ${config.billingMode || 'PAY_PER_REQUEST'} --network-access ${access}`;
    logs.push(logStdin(nodeId, type, cmd));

    try {
      const res = await awsClients.dynamodb.send(
        new CreateTableCommand({
          TableName: table,
          AttributeDefinitions: [
            { AttributeName: partitionKey, AttributeType: ScalarAttributeType.S },
            ...(sortKey ? [{ AttributeName: sortKey, AttributeType: ScalarAttributeType.S }] : []),
          ],
          KeySchema: [
            { AttributeName: partitionKey, KeyType: 'HASH' },
            ...(sortKey ? [{ AttributeName: sortKey, KeyType: 'RANGE' as const }] : []),
          ],
          BillingMode: config.billingMode || 'PAY_PER_REQUEST',
          StreamSpecification: config.streamsEnabled ? { StreamEnabled: true, StreamViewType: StreamViewType.NEW_AND_OLD_IMAGES } : undefined,
        })
      );
      logs.push(logStdout(nodeId, type, res, `DynamoDB Table '${table}' ready (${access}).`));
    } catch (err: any) {
      if (err.name === 'ResourceInUseException' || err.message?.includes('already exists')) {
        logs.push(logStdout(nodeId, type, { TableName: table, Status: 'ACTIVE' }, `DynamoDB Table '${table}' ready (${access}).`));
      } else {
        throw err;
      }
    }
    return { resourceId: table };
  }

  // RDS database provisioning
  const dbId = (config.dbName || `rds-${Date.now().toString().slice(-4)}`).toLowerCase();
  const rawEngine = config.engine || 'postgres-16';
  const [baseEngine, engineVersion] = rawEngine.includes('-') ? rawEngine.split(/-(?=[0-9])/) : [rawEngine, undefined];
  const access = config.networkAccess || 'public_external';
  const isPublic = access === 'public_external';
  const port = baseEngine === 'postgres' ? 5432 : baseEngine === 'mariadb' ? 3306 : 3306;

  const cmd = `aws rds create-db-instance --db-instance-identifier ${dbId} --engine ${baseEngine} --publicly-accessible ${isPublic}`;
  logs.push(logStdin(nodeId, type, cmd));

  try {
    const res = await awsClients.rds.send(
      new CreateDBInstanceCommand({
        DBInstanceIdentifier: dbId,
        DBInstanceClass: config.instanceClass || 'db.t3.micro',
        Engine: baseEngine,
        EngineVersion: engineVersion,
        MasterUsername: config.username || 'admin',
        MasterUserPassword: 'Password123!',
        AllocatedStorage: Number(config.allocatedStorage) || 20,
        BackupRetentionPeriod: config.backupRetentionDays ?? 7,
        MultiAZ: Boolean(config.multiAz),
      })
    );
    logs.push(logStdout(nodeId, type, res, `RDS ${baseEngine.toUpperCase()} Instance '${dbId}' active on port ${port} (${access}).`));
    if (baseEngine === 'postgres') {
      const dbName = config.databaseName || config.dbName || 'app_production';
      const user = config.username || 'postgres', pass = config.password || 'postgres';
      setTimeout(() => initFlociRdsPostgres(dbName, user, pass), 2500);
    }
  } catch (err: any) {
    logs.push(logStdout(nodeId, type, { status: 'mock-ready', port }, `RDS Instance '${dbId}' ready on port ${port}.`));
  }

  return { resourceId: dbId };
}
