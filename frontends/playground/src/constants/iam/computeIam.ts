export interface IamAction {
  action: string;
  service: string;
  description: string;
}

export const COMPUTE_IAM_ACTIONS: IamAction[] = [
  // Lambda Permissions
  { action: 'lambda:*', service: 'lambda', description: 'All AWS Lambda actions' },
  { action: 'lambda:InvokeFunction', service: 'lambda', description: 'Synchronously invoke a serverless function' },
  { action: 'lambda:InvokeAsync', service: 'lambda', description: 'Asynchronously invoke a Lambda function' },
  { action: 'lambda:GetFunction', service: 'lambda', description: 'Retrieve function configuration and code metadata' },
  { action: 'lambda:CreateFunction', service: 'lambda', description: 'Deploy a new Lambda function' },
  { action: 'lambda:UpdateFunctionCode', service: 'lambda', description: 'Update zip or image of existing Lambda' },
  { action: 'lambda:UpdateFunctionConfiguration', service: 'lambda', description: 'Modify memory, timeout or env vars' },
  { action: 'lambda:DeleteFunction', service: 'lambda', description: 'Delete function and all associated versions' },
  { action: 'lambda:ListFunctions', service: 'lambda', description: 'List all deployed functions in account' },
  { action: 'lambda:AddPermission', service: 'lambda', description: 'Grant invoke access to S3, SQS or API Gateway' },
  { action: 'lambda:RemovePermission', service: 'lambda', description: 'Revoke resource-based policy permission' },

  // EC2 Permissions
  { action: 'ec2:*', service: 'ec2', description: 'All Amazon EC2 compute actions' },
  { action: 'ec2:DescribeInstances', service: 'ec2', description: 'Inspect running EC2 virtual machines' },
  { action: 'ec2:RunInstances', service: 'ec2', description: 'Launch new EC2 compute instances' },
  { action: 'ec2:TerminateInstances', service: 'ec2', description: 'Shut down and delete EC2 instances' },
  { action: 'ec2:DescribeImages', service: 'ec2', description: 'List available machine images (AMIs)' },
  { action: 'ec2:CreateSecurityGroup', service: 'ec2', description: 'Create firewall security group' },
  { action: 'ec2:AuthorizeSecurityGroupIngress', service: 'ec2', description: 'Open inbound network traffic ports' },

  // ECS Permissions
  { action: 'ecs:*', service: 'ecs', description: 'All Amazon ECS container actions' },
  { action: 'ecs:RunTask', service: 'ecs', description: 'Execute containerized tasks on Fargate or EC2' },
  { action: 'ecs:DescribeTasks', service: 'ecs', description: 'Get container execution status' },
];
