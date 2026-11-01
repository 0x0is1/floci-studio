import { AwsPaletteItem, AwsServiceCategory } from '@/types/aws';
import { COMPUTE_PALETTE_ITEMS } from './palette/compute';
import { STORAGE_PALETTE_ITEMS } from './palette/storage';
import { DATABASE_PALETTE_ITEMS } from './palette/database';
import { NETWORKING_PALETTE_ITEMS } from './palette/networking';
import { MESSAGING_PALETTE_ITEMS } from './palette/messaging';
import { SECURITY_PALETTE_ITEMS } from './palette/security';
import { ANALYTICS_PALETTE_ITEMS } from './palette/analytics';

export interface PaletteCategoryMeta {
  id: AwsServiceCategory;
  name: string;
}

export const PALETTE_CATEGORIES: PaletteCategoryMeta[] = [
  { id: 'compute', name: 'Compute' },
  { id: 'storage', name: 'Storage' },
  { id: 'database', name: 'Database' },
  { id: 'networking', name: 'Networking & Content' },
  { id: 'messaging', name: 'Messaging & Integration' },
  { id: 'security', name: 'Security & Secrets' },
  { id: 'analytics', name: 'Observability & AI' },
];

export const AWS_PALETTE_ITEMS: AwsPaletteItem[] = [
  ...COMPUTE_PALETTE_ITEMS,
  ...STORAGE_PALETTE_ITEMS,
  ...DATABASE_PALETTE_ITEMS,
  ...NETWORKING_PALETTE_ITEMS,
  ...MESSAGING_PALETTE_ITEMS,
  ...SECURITY_PALETTE_ITEMS,
  ...ANALYTICS_PALETTE_ITEMS,
];

export function getPaletteItem(type: string): AwsPaletteItem | undefined {
  return AWS_PALETTE_ITEMS.find((item) => item.type === type);
}
