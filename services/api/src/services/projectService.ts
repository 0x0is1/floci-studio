import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { config } from '@/config/env';
import { Project, ProjectSchema, CreateProjectInput, CanvasNode } from '@/models/project';
import { getBoilerplate } from '@/services/boilerplateService';

export class ProjectService {
  private get projectsDir(): string {
    const dir = join(config.dataDir, 'projects');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    return dir;
  }

  public listProjects(): Array<Omit<Project, 'nodes' | 'edges'>> {
    const files = readdirSync(this.projectsDir).filter((f) => f.endsWith('.json'));
    const projects: Array<Omit<Project, 'nodes' | 'edges'>> = [];
    for (const file of files) {
      try {
        const raw = readFileSync(join(this.projectsDir, file), 'utf-8');
        const { nodes, edges, ...summary } = ProjectSchema.parse(JSON.parse(raw));
        projects.push(summary);
      } catch (err) {
        console.error(`Failed to parse ${file}:`, err);
      }
    }
    if (projects.length === 0) {
      const defaultProj = this.createProject({ name: 'Standard 3-Tier Web App', description: 'Verified Floci starter boilerplate' });
      const { nodes, edges, ...summary } = defaultProj;
      return [summary];
    }
    return projects.sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1));
  }

  public getProject(id: string): Project | null {
    const filePath = join(this.projectsDir, `${id}.json`);
    if (!existsSync(filePath)) return null;
    try {
      const proj = ProjectSchema.parse(JSON.parse(readFileSync(filePath, 'utf-8')));
      if (!proj.nodes.some((n) => n.data.serviceType === 'vpc')) {
        const vpcNode: CanvasNode = {
          id: 'vpc-default', type: 'custom', position: { x: 40, y: 40 },
          data: {
            serviceType: 'vpc', label: 'Default VPC', status: 'draft',
            config: { uuid: 'vpc-default', vpcId: 'vpc-default', cidrBlock: '172.31.0.0/16', isDefault: true },
          },
        };
        proj.nodes = [vpcNode, ...proj.nodes];
        this.saveProject(proj);
      }
      return proj;
    } catch {
      return null;
    }
  }

  public createProject(input: CreateProjectInput): Project {
    const id = String(Date.now());
    const now = new Date().toISOString();
    const { nodes, edges } = getBoilerplate();
    const project: Project = {
      id,
      name: input.name,
      description: input.description || '',
      nodes,
      edges,
      createdAt: now,
      updatedAt: now,
      status: 'draft',
      deployedNodes: [],
      deployedEdges: [],
      logs: [],
    };
    return this.saveProject(project);
  }

  public saveProject(project: Project): Project {
    const validated = ProjectSchema.parse({ ...project, updatedAt: new Date().toISOString() });
    const filePath = join(this.projectsDir, `${validated.id}.json`);
    const tempPath = `${filePath}.tmp`;
    writeFileSync(tempPath, JSON.stringify(validated, null, 2), 'utf-8');
    renameSync(tempPath, filePath);
    return validated;
  }

  public deleteProject(id: string): boolean {
    const filePath = join(this.projectsDir, `${id}.json`);
    if (!existsSync(filePath)) return false;
    unlinkSync(filePath);
    return true;
  }
}

export const projectService = new ProjectService();
