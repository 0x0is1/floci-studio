import { IamAction } from './computeIam';

export const MESSAGING_IAM_ACTIONS: IamAction[] = [
  // SQS Permissions
  { action: 'sqs:*', service: 'sqs', description: 'All Amazon SQS messaging actions' },
  { action: 'sqs:SendMessage', service: 'sqs', description: 'Deliver message to queue' },
  { action: 'sqs:ReceiveMessage', service: 'sqs', description: 'Poll and read messages from queue' },
  { action: 'sqs:DeleteMessage', service: 'sqs', description: 'Delete processed message by receipt handle' },
  { action: 'sqs:GetQueueUrl', service: 'sqs', description: 'Lookup queue URL by queue name' },
  { action: 'sqs:GetQueueAttributes', service: 'sqs', description: 'Read queue metrics and configuration' },
  { action: 'sqs:PurgeQueue', service: 'sqs', description: 'Purge all pending messages in queue' },

  // SNS Permissions
  { action: 'sns:*', service: 'sns', description: 'All Amazon SNS pub/sub actions' },
  { action: 'sns:Publish', service: 'sns', description: 'Publish message event to SNS topic' },
  { action: 'sns:Subscribe', service: 'sns', description: 'Subscribe endpoint (Lambda/SQS/HTTP) to topic' },
  { action: 'sns:CreateTopic', service: 'sns', description: 'Provision a new broadcast SNS topic' },

  // EventBridge Permissions
  { action: 'events:*', service: 'events', description: 'All Amazon EventBridge actions' },
  { action: 'events:PutEvents', service: 'events', description: 'Publish custom event envelope to event bus' },
  { action: 'events:PutRule', service: 'events', description: 'Create pattern matching routing rule' },
  { action: 'events:PutTargets', service: 'events', description: 'Route events to Lambda, SQS, or Step Functions' },

  // Step Functions
  { action: 'states:*', service: 'states', description: 'All AWS Step Functions actions' },
  { action: 'states:StartExecution', service: 'states', description: 'Trigger execution of state machine DAG' },
  { action: 'states:DescribeExecution', service: 'states', description: 'Inspect state machine progress' },

  // Kinesis
  { action: 'kinesis:*', service: 'kinesis', description: 'All Amazon Kinesis streaming actions' },
  { action: 'kinesis:PutRecord', service: 'kinesis', description: 'Write data record to streaming shard' },
  { action: 'kinesis:GetRecords', service: 'kinesis', description: 'Read streaming records from shard' },
];
