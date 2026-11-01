import fs from 'node:fs';
import path from 'node:path';

const mode = process.argv[2];
if (mode !== 'true' && mode !== 'false') {
  console.error('usage: node patchDynamicParams.mjs <true|false>');
  process.exit(1);
}

const files = [
  'src/app/projects/[id]/page.tsx',
  'src/app/projects/[id]/editor/page.tsx',
  'src/app/projects/[id]/runtime/page.tsx',
].map((f) => path.resolve(import.meta.dirname, '..', f));

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const patched = content.replace(
    /export const dynamicParams = (true|false);/,
    `export const dynamicParams = ${mode};`
  );
  fs.writeFileSync(file, patched);
}
