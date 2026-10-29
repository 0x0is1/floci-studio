import { AwsPaletteItem } from '@/types/aws';

export const SECURITY_PALETTE_ITEMS: AwsPaletteItem[] = [
  {
    type: 'iam',
    category: 'security',
    name: 'IAM Role',
    description: 'Fine-grained access control, IAM policies, and execution roles',
    flociStatus: 'ready',
    defaultConfig: { roleName: 'app-service-role', path: '/' },
  },
  {
    type: 'secretsmanager',
    category: 'security',
    name: 'Secrets Manager',
    description: 'Encrypted credential and API token store with secret rotation',
    flociStatus: 'ready',
    defaultConfig: { secretName: 'db-credentials', secretString: '{"api_key":"default"}' },
  },
  {
    type: 'kms',
    category: 'security',
    name: 'KMS Key',
    description: 'Cryptographic encryption key for envelope encryption',
    flociStatus: 'ready',
    defaultConfig: { keyAlias: 'alias/app-key', keySpec: 'SYMMETRIC_DEFAULT' },
  },
];
