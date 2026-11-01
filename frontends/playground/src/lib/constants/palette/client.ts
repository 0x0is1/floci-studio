import { AwsPaletteItem } from '@/types/aws';

export const CLIENT_PALETTE_ITEMS: AwsPaletteItem[] = [
  {
    type: 'client',
    category: 'client',
    name: 'Client',
    description: 'External user or browser making requests into your architecture',
    flociStatus: 'ready',
    defaultConfig: { requestMethod: 'GET', requestPath: '/' },
  },
];
