import { app, protocol, net } from 'electron';
import path from 'path';
import { pathToFileURL } from 'url';
import { existsSync, statSync } from 'fs';
import { getRepoRoot } from '@/main/checks/nodeModulesChecker';

export function getStudioDir(): string {
  const packagedStudio = path.join(app.getAppPath(), 'studio/out');
  if (existsSync(path.join(packagedStudio, 'index.html'))) return packagedStudio;
  const repoStudio = path.join(getRepoRoot(), 'frontends/playground/out');
  if (existsSync(path.join(repoStudio, 'index.html'))) return repoStudio;
  return packagedStudio;
}

export function getSplashDir(): string {
  return path.join(app.getAppPath(), 'splash/out');
}

export function resolveStudioPath(pathname: string, studioDir: string): string {
  if (!pathname || pathname === '/') return path.join(studioDir, 'index.html');
  const direct = path.join(studioDir, pathname);
  if (existsSync(direct) && !statSync(direct).isDirectory()) return direct;
  const withHtml = path.join(studioDir, pathname + '.html');
  if (existsSync(withHtml)) return withHtml;
  if (/^\/projects\/[^/]+\/editor(\.txt)?$/.test(pathname)) {
    const ext = pathname.endsWith('.txt') ? '.txt' : '.html';
    return path.join(studioDir, 'projects/default/editor' + ext);
  }
  if (/^\/projects\/[^/]+\/runtime(\.txt)?$/.test(pathname)) {
    const ext = pathname.endsWith('.txt') ? '.txt' : '.html';
    return path.join(studioDir, 'projects/default/runtime' + ext);
  }
  if (/^\/projects\/[^/]+(\.txt)?$/.test(pathname)) {
    const ext = pathname.endsWith('.txt') ? '.txt' : '.html';
    return path.join(studioDir, 'projects/default' + ext);
  }
  return path.join(studioDir, 'index.html');
}

export function setupAppProtocol(): void {
  protocol.handle('app', (request) => {
    const parsed = new URL(request.url);
    const host = parsed.host;
    let pathname = decodeURIComponent(parsed.pathname);

    let targetFile: string;
    if (host === 'studio') {
      const studioDir = getStudioDir();
      targetFile = resolveStudioPath(pathname, studioDir);
    } else {
      const splashDir = getSplashDir();
      if (!pathname || pathname === '/') pathname = '/index.html';
      targetFile = path.join(splashDir, pathname);
    }

    return net.fetch(pathToFileURL(targetFile).toString());
  });
}
