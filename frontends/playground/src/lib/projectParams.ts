import fs from 'node:fs';
import path from 'node:path';

export function getProjectStaticParams(): Array<{ id: string }> {
  const ids = new Set<string>([
    'default',
    'proj-starter',
    '1793299000001',
    '1793299000002',
    '1793299000003',
    '1793299000004',
  ]);

  const candidateDirs = [
    path.resolve(process.cwd(), '../services/data/projects'),
    path.resolve(process.cwd(), '../../services/data/projects'),
    path.resolve(process.cwd(), 'services/data/projects'),
    process.env.APPDATA ? path.join(process.env.APPDATA, 'Floci Studio', 'floci-runtime', 'data', 'projects') : '',
  ];

  for (const dir of candidateDirs) {
    if (!dir) continue;
    try {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
        for (const f of files) ids.add(f.replace('.json', ''));
      }
    } catch {}
  }

  return Array.from(ids).map((id) => ({ id }));
}
