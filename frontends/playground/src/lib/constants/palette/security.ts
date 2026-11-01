import { AwsPaletteItem } from '@/types/aws';

export const SECURITY_PALETTE_ITEMS: AwsPaletteItem[] = [
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
