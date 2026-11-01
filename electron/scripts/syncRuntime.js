const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../..');
const dest = path.resolve(__dirname, '../runtime-services');

if (fs.existsSync(dest)) {
  fs.rmSync(dest, { recursive: true, force: true });
}
fs.mkdirSync(dest, { recursive: true });

// Copy docker-compose.yml, rewriting the shared/ volume mount to match the
// packaged layout (runtime-services/shared instead of the dev-mode ../shared)
const composeContent = fs
  .readFileSync(path.join(repoRoot, 'services/docker-compose.yml'), 'utf8')
  .replace('../shared:/shared', './shared:/shared');
fs.writeFileSync(path.join(dest, 'docker-compose.yml'), composeContent);

// Copy shared/ (single source of truth for the connection matrix, consumed
// by the API via @shared/* at build/runtime)
fs.cpSync(path.join(repoRoot, 'shared'), path.join(dest, 'shared'), { recursive: true });

// Copy API files (excluding node_modules)
const apiDest = path.join(dest, 'api');
fs.mkdirSync(apiDest, { recursive: true });
fs.copyFileSync(path.join(repoRoot, 'services/api/Dockerfile'), path.join(apiDest, 'Dockerfile'));
fs.copyFileSync(path.join(repoRoot, 'services/api/package.json'), path.join(apiDest, 'package.json'));
if (fs.existsSync(path.join(repoRoot, 'services/api/bun.lock'))) {
  fs.copyFileSync(path.join(repoRoot, 'services/api/bun.lock'), path.join(apiDest, 'bun.lock'));
}
fs.copyFileSync(path.join(repoRoot, 'services/api/tsconfig.json'), path.join(apiDest, 'tsconfig.json'));
fs.cpSync(path.join(repoRoot, 'services/api/src'), path.join(apiDest, 'src'), { recursive: true });

// Create data directory
const dataProjects = path.join(dest, 'data/projects');
fs.mkdirSync(dataProjects, { recursive: true });
const dataFloci = path.join(dest, 'data/floci');
fs.mkdirSync(dataFloci, { recursive: true });

const srcProjectsDir = path.join(repoRoot, 'services/data/projects');
if (fs.existsSync(srcProjectsDir)) {
  const files = fs.readdirSync(srcProjectsDir).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    fs.copyFileSync(path.join(srcProjectsDir, file), path.join(dataProjects, file));
  }
}

console.log('Successfully synced runtime-services for packaging.');

