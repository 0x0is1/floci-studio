import { describe, it, expect } from 'bun:test';
import { getBoilerplate } from '../src/services/boilerplateService';

describe('getBoilerplate', () => {
  it('produces only the default VPC and Subnet network foundation in advance', () => {
    const { nodes, edges } = getBoilerplate();
    expect(nodes).toHaveLength(2);
    expect(nodes[0].data.serviceType).toBe('vpc');
    expect(nodes[1].data.serviceType).toBe('subnet');

    expect(edges).toHaveLength(1);
    expect(edges[0].source).toBe('vpc-default');
    expect(edges[0].target).toBe('subnet-default');
  });

  it('keeps the VPC/Subnet foundation at indices [0] and [1] for the retrofit patch in projectService', () => {
    const { nodes, edges } = getBoilerplate();
    expect(nodes[0].data.serviceType).toBe('vpc');
    expect(nodes[1].data.serviceType).toBe('subnet');
    expect(edges[0].source).toBe(nodes[0].id);
    expect(edges[0].target).toBe(nodes[1].id);
  });
});
