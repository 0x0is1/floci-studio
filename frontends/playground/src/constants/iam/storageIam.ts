import { IamAction } from './computeIam';

export const STORAGE_IAM_ACTIONS: IamAction[] = [
  // S3 Permissions
  { action: 's3:*', service: 's3', description: 'All Amazon S3 storage actions' },
  { action: 's3:GetObject', service: 's3', description: 'Download or read objects from bucket' },
  { action: 's3:PutObject', service: 's3', description: 'Upload and store objects in S3 bucket' },
  { action: 's3:DeleteObject', service: 's3', description: 'Delete objects from an S3 bucket' },
  { action: 's3:ListBucket', service: 's3', description: 'List object keys and metadata within a bucket' },
  { action: 's3:GetBucketLocation', service: 's3', description: 'Retrieve geographic AWS region of bucket' },
  { action: 's3:PutBucketPolicy', service: 's3', description: 'Attach resource policy to an S3 bucket' },
  { action: 's3:GetBucketPolicy', service: 's3', description: 'Read bucket access control policy' },
  { action: 's3:CreateBucket', service: 's3', description: 'Provision a new S3 bucket in account' },
  { action: 's3:DeleteBucket', service: 's3', description: 'Delete an empty S3 bucket' },

  // DynamoDB Permissions
  { action: 'dynamodb:*', service: 'dynamodb', description: 'All Amazon DynamoDB actions' },
  { action: 'dynamodb:GetItem', service: 'dynamodb', description: 'Read single item by partition/sort key' },
  { action: 'dynamodb:PutItem', service: 'dynamodb', description: 'Write or overwrite record in table' },
  { action: 'dynamodb:UpdateItem', service: 'dynamodb', description: 'Modify attributes of an existing item' },
  { action: 'dynamodb:DeleteItem', service: 'dynamodb', description: 'Delete item from table' },
  { action: 'dynamodb:Query', service: 'dynamodb', description: 'Query items matching key condition' },
  { action: 'dynamodb:Scan', service: 'dynamodb', description: 'Scan items across entire table' },
  { action: 'dynamodb:BatchGetItem', service: 'dynamodb', description: 'Retrieve attributes of multiple items' },
  { action: 'dynamodb:BatchWriteItem', service: 'dynamodb', description: 'Put or delete multiple items in batch' },

  // RDS Permissions
  { action: 'rds:*', service: 'rds', description: 'All Amazon RDS database actions' },
  { action: 'rds:DescribeDBInstances', service: 'rds', description: 'Get status of PostgreSQL/MySQL instances' },
  { action: 'rds:Connect', service: 'rds', description: 'Authenticate database user session' },
  { action: 'rds-data:ExecuteStatement', service: 'rds-data', description: 'Execute SQL queries via Data API' },
];
