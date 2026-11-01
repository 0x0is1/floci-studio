import { describe, it, expect, afterEach } from 'bun:test';
import { resolveEc2Context } from '../src/services/ec2ExecService';
import { projectService } from '../src/services/projectService';

describe('resolveEc2Context project scoping', () => {
  const createdIds: string[] = [];

  afterEach(() => {
    for (const id of createdIds.splice(0)) {
      projectService.deleteProject(id);
    }
  });

  const makeProject = (id: string, ami: string, port: number) => {
    projectService.saveProject({
      id,
      name: `test-${id}`,
      description: '',
      nodes: [
        { id: `${id}-ec2`, type: 'ec2', position: { x: 0, y: 0 }, data: { serviceType: 'ec2', config: { port, ami } } },
      ],
      edges: [],
      deployedNodes: [],
      deployedEdges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      logs: [],
    });
    createdIds.push(id);
  };

  it('resolves the AMI from the scoped project, not a same-port AMI in a different project', () => {
    const portA = 18080;
    const portB = 18081;
    makeProject('test-proj-a', 'ami-ubuntu2404-amd64', portA);
    makeProject('test-proj-b', 'ami-al2023-amd64', portA);

    const scopedToA = resolveEc2Context(portA, 'test-proj-a');
    const scopedToB = resolveEc2Context(portA, 'test-proj-b');

    expect(scopedToA.ami).toBe('ami-ubuntu2404-amd64');
    expect(scopedToB.ami).toBe('ami-al2023-amd64');
  });

  it('does not match a port that only exists in another project when scoped', () => {
    makeProject('test-proj-c', 'ami-debian-amd64', 18082);
    const result = resolveEc2Context(18082, 'test-proj-nonexistent');
    expect(result.ami).toBe('ami-ubuntu2404-amd64');
  });
});
