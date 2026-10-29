import { AwsPaletteItem } from '@/types/aws';

export const STORAGE_PALETTE_ITEMS: AwsPaletteItem[] = [
  {
    type: 's3',
    category: 'storage',
    name: 'S3 Bucket',
    description: 'Scalable object storage for files, media, and static assets',
    flociStatus: 'ready',
    defaultConfig: { bucketName: 'app-storage', accessControl: 'private', versioning: false, encryption: 'AES256', networkAccess: 'public_external' },
  },
  {
    type: 'efs',
    category: 'storage',
    name: 'EFS File System',
    description: 'Serverless, elastic NFS shared file system for EC2 and containers',
    flociStatus: 'ready',
    defaultConfig: { performanceMode: 'generalPurpose', throughputMode: 'bursting', encrypted: true },
  },
];
