import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const KEYS_BASE = path.resolve(process.cwd(), 'services/data/keys');

function getProjectKeyDir(projectId: string): string {
  const sanitized = projectId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const dir = path.join(KEYS_BASE, sanitized);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export class KeyPairService {
  public getOrCreateProjectKey(projectId: string, keyName: string = 'default-key') {
    const dir = getProjectKeyDir(projectId);
    const safeName = keyName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const keyPath = path.join(dir, `${safeName}.pem`);

    if (fs.existsSync(keyPath)) {
      const privateKey = fs.readFileSync(keyPath, 'utf8');
      const hash = crypto.createHash('sha256').update(privateKey).digest('hex').substring(0, 16);
      return { keyName: safeName, privateKey, fingerprint: `SHA256:${hash}`, reused: true };
    }

    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    fs.writeFileSync(keyPath, privateKey, { mode: 0o600 });
    const hash = crypto.createHash('sha256').update(privateKey).digest('hex').substring(0, 16);
    return { keyName: safeName, privateKey, publicKey, fingerprint: `SHA256:${hash}`, reused: false };
  }

  public listProjectKeys(projectId: string): Array<{ name: string; createdAt: string }> {
    const dir = getProjectKeyDir(projectId);
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.pem'));
    return files.map((f) => {
      const stat = fs.statSync(path.join(dir, f));
      return { name: f.replace('.pem', ''), createdAt: stat.birthtime.toISOString() };
    });
  }

  public getKeyPem(projectId: string, keyName: string): string | null {
    const dir = getProjectKeyDir(projectId);
    const safeName = keyName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const keyPath = path.join(dir, `${safeName}.pem`);
    return fs.existsSync(keyPath) ? fs.readFileSync(keyPath, 'utf8') : null;
  }
}

export const keyPairService = new KeyPairService();
