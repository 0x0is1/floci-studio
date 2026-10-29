import { AwsServiceType, AwsPaletteItem } from '@/types/aws';
import { AWS_PALETTE_ITEMS } from '@/lib/constants/paletteItems';
import { validateAwsConnection } from './connectionMatrix';

export function getValidNextTargets(sourceType: AwsServiceType): AwsPaletteItem[] {
  return AWS_PALETTE_ITEMS.filter((item) => {
    const res = validateAwsConnection(sourceType, item.type);
    return res.allowed;
  });
}

