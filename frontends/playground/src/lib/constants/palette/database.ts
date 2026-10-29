import { AwsPaletteItem } from '@/types/aws';

export const DATABASE_PALETTE_ITEMS: AwsPaletteItem[] = [
  {
    type: 'rds',
    category: 'database',
    name: 'RDS PostgreSQL',
    description: 'Managed relational database engine with automated backups',
    flociStatus: 'ready',
    defaultConfig: { engine: 'postgres-16', instanceClass: 'db.t3.micro', port: 5432, allocatedStorage: 20, dbName: 'appdb' },
  },
  {
    type: 'dynamodb',
    category: 'database',
    name: 'DynamoDB Table',
    description: 'Fully managed NoSQL document store with single-digit ms latency',
    flociStatus: 'ready',
    defaultConfig: { tableName: 'Users', partitionKey: 'id', billingMode: 'PAY_PER_REQUEST' },
  },
  {
    type: 'elasticache',
    category: 'database',
    name: 'ElastiCache Redis',
    description: 'High-speed in-memory caching engine for low-latency session store',
    flociStatus: 'ready',
    defaultConfig: { engine: 'redis', nodeType: 'cache.t3.micro', port: 6379, numCacheNodes: 1 },
  },
];
