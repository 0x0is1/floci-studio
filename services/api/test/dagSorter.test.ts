import { describe, it, expect } from 'bun:test';
import { sortNodesTopologically, getServiceTier } from '../src/services/dagSorter';

function node(id: string, serviceType: string) {
  return { id, type: 'custom', position: { x: 0, y: 0 }, data: { serviceType, label: id, status: 'draft', config: {} } } as any;
}

describe('dagSorter', () => {
  it('orders prerequisite tiers before dependent tiers regardless of edge direction', () => {
    const nodes = [node('ec2', 'ec2'), node('s3', 's3')];
    const edges = [{ id: 'e0', source: 'ec2', target: 's3' }] as any;
    const ordered = sortNodesTopologically(nodes, edges);
    expect(ordered.map((o) => o.node.id)).toEqual(['s3', 'ec2']);
    expect(ordered.find((o) => o.node.id === 'ec2')?.dependencies).toEqual(['s3']);
  });

  it('preserves tier ordering for an unrelated multi-node graph', () => {
    const nodes = [node('v', 'vpc'), node('s', 'subnet'), node('e', 'ec2'), node('q', 'sqs')];
    const edges = [
      { id: 'e0', source: 'v', target: 's' },
      { id: 'e1', source: 's', target: 'e' },
      { id: 'e2', source: 'e', target: 'q' },
    ] as any;
    const ordered = sortNodesTopologically(nodes, edges);
    // q (sqs) has no dependency edge into vpc/subnet, so it has in-degree 0 like v and
    // lands at level 0 alongside it; e (ec2) depends on both s and q, so it resolves last.
    expect(ordered.map((o) => o.node.id)).toEqual(['v', 'q', 's', 'e']);
  });

  it('throws a dependency cycle error naming the involved nodes when a cycle exists', () => {
    const nodes = [node('a', 'client'), node('b', 'client')];
    const edges = [
      { id: 'e0', source: 'a', target: 'b' },
      { id: 'e1', source: 'b', target: 'a' },
    ] as any;
    expect(() => sortNodesTopologically(nodes, edges)).toThrow(/Dependency cycle detected involving: a, b/);
  });

  it('throws on a larger cycle that leaves only the looping subset unresolved', () => {
    const nodes = [node('v', 'vpc'), node('a', 'client'), node('b', 'client'), node('c', 'client')];
    const edges = [
      { id: 'e0', source: 'v', target: 'a' },
      { id: 'e1', source: 'a', target: 'b' },
      { id: 'e2', source: 'b', target: 'c' },
      { id: 'e3', source: 'c', target: 'a' },
    ] as any;
    expect(() => sortNodesTopologically(nodes, edges)).toThrow(/Dependency cycle detected involving: a, b, c/);
  });

  it('falls back to tier 25 for unknown service types', () => {
    expect(getServiceTier('made-up-type')).toBe(25);
    expect(getServiceTier('ec2')).toBe(30);
  });
});
