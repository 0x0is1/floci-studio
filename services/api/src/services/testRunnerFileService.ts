import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, unlinkSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { config } from '@/config/env';

function sanitizeFilename(name: string): string {
  const base = name.split(/[\\/]/).pop() || 'file';
  return base.replace(/[^A-Za-z0-9._-]/g, '_');
}

export function getTestDir(projectId: string, nodeId: string): string {
  const dir = join(config.dataDir, 'projects', projectId, 'tests', nodeId);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

export function listTestFiles(projectId: string, nodeId: string): Array<{ name: string; size: number }> {
  const dir = getTestDir(projectId, nodeId);
  return readdirSync(dir).map((name) => ({ name, size: statSync(join(dir, name)).size }));
}

export async function saveTestFile(projectId: string, nodeId: string, filename: string, file: File): Promise<{ name: string; size: number }> {
  const dir = getTestDir(projectId, nodeId);
  const safeName = sanitizeFilename(filename);
  const buf = Buffer.from(await file.arrayBuffer());
  writeFileSync(join(dir, safeName), buf);
  return { name: safeName, size: buf.length };
}

export function deleteTestFile(projectId: string, nodeId: string, filename: string): boolean {
  const dir = getTestDir(projectId, nodeId);
  const safeName = sanitizeFilename(filename);
  const filePath = join(dir, safeName);
  if (!existsSync(filePath)) return false;
  unlinkSync(filePath);
  return true;
}

export function readTestFilesForRun(projectId: string, nodeId: string): Array<{ name: string; content: Buffer }> {
  const dir = getTestDir(projectId, nodeId);
  return readdirSync(dir).map((name) => ({ name, content: readFileSync(join(dir, name)) }));
}
