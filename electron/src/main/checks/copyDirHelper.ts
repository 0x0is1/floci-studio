import path from 'path';
import { mkdirSync, readdirSync, copyFileSync, existsSync } from 'fs';

export function copyDirectorySync(src: string, dest: string): void {
  if (!existsSync(src)) return;
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirectorySync(srcPath, destPath);
    } else {
      if (destPath.includes('data') && existsSync(destPath)) continue;
      copyFileSync(srcPath, destPath);
    }
  }
}
