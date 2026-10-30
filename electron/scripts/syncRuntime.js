const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../..');
const dest = path.resolve(__dirname, '../runtime-services');

if (fs.existsSync(dest)) {
  fs.rmSync(dest, { recursive: true, force: true });
}
fs.mkdirSync(dest, { recursive: true });

// Copy docker-compose.yml
fs.copyFileSync(
  path.join(repoRoot, 'services/docker-compose.yml'),
  path.join(dest, 'docker-compose.yml')
);

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

if (fs.existsSync(path.join(repoRoot, 'services/data/projects/proj-starter.json'))) {
  fs.copyFileSync(
    path.join(repoRoot, 'services/data/projects/proj-starter.json'),
    path.join(dataProjects, 'proj-starter.json')
  );
}

console.log('Successfully synced runtime-services for packaging.');

