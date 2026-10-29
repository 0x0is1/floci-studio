import { IamAction } from './computeIam';

export const SECURITY_IAM_ACTIONS: IamAction[] = [
  // Secrets Manager
  { action: 'secretsmanager:*', service: 'secretsmanager', description: 'All AWS Secrets Manager actions' },
  { action: 'secretsmanager:GetSecretValue', service: 'secretsmanager', description: 'Retrieve plaintext secret or API credential' },
  { action: 'secretsmanager:PutSecretValue', service: 'secretsmanager', description: 'Update or rotate secret value' },

  // KMS
  { action: 'kms:*', service: 'kms', description: 'All AWS Key Management Service actions' },
  { action: 'kms:Decrypt', service: 'kms', description: 'Decrypt ciphertext using customer master key' },
  { action: 'kms:Encrypt', service: 'kms', description: 'Encrypt payload with specified KMS key' },
  { action: 'kms:GenerateDataKey', service: 'kms', description: 'Generate unique cryptographic data key' },

  // CloudWatch Logs & Metrics
  { action: 'logs:*', service: 'logs', description: 'All Amazon CloudWatch Logs actions' },
  { action: 'logs:CreateLogGroup', service: 'logs', description: 'Create log group for container or function' },
  { action: 'logs:CreateLogStream', service: 'logs', description: 'Create log stream in group' },
  { action: 'logs:PutLogEvents', service: 'logs', description: 'Upload telemetry and console lines' },
  { action: 'cloudwatch:PutMetricData', service: 'cloudwatch', description: 'Publish custom infrastructure metrics' },

  // Amazon Bedrock AI
  { action: 'bedrock:*', service: 'bedrock', description: 'All Amazon Bedrock AI actions' },
  { action: 'bedrock:InvokeModel', service: 'bedrock', description: 'Run inference against LLM foundation models' },
  { action: 'bedrock:ListFoundationModels', service: 'bedrock', description: 'List available Titan, Claude, Llama models' },

  // Systems Manager (SSM)
  { action: 'ssm:*', service: 'ssm', description: 'All AWS Systems Manager actions' },
  { action: 'ssm:GetParameter', service: 'ssm', description: 'Retrieve configuration value or SecureString' },
  { action: 'ssm:PutParameter', service: 'ssm', description: 'Create or update parameter in store' },
];
