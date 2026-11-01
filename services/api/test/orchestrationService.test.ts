import { describe, it, expect } from 'bun:test';
import { orchestrationService } from '../src/services/orchestrationService';

function node(id: string, serviceType: string, config: Record<string, any> = {}) {
  return { id, type: 'awsNode', position: { x: 0, y: 0 }, data: { serviceType, label: id, status: 'draft', config } };
}

describe('OrchestrationService fail-fast + progress streaming', () => {
  it('blocks the whole deployment with per-node error events on VPC isolation violation', async () => {
    const nodes = [node('a', 'client')] as any;
    const events: any[] = [];
    const { results } = await orchestrationService.deployGraph(nodes, [], undefined, (r) => events.push(r));
    expect(results).toHaveLength(1);
    expect(results[0].status).toBe('error');
    expect(events).toHaveLength(1);
    expect(events[0].nodeId).toBe('a');
  });

  it('emits per-node error events for every node when a dependency cycle is detected', async () => {
    const nodes = [node('v', 'vpc'), node('s', 'subnet'), node('a', 'client'), node('b', 'client')] as any;
    const edges = [
      { id: 'e0', source: 'v', target: 's' }, { id: 'e1', source: 's', target: 'a' }, { id: 'e2', source: 's', target: 'b' },
      { id: 'e3', source: 'a', target: 'b' }, { id: 'e4', source: 'b', target: 'a' },
    ] as any;
    const events: any[] = [];
    const { results } = await orchestrationService.deployGraph(nodes, edges, undefined, (r) => events.push(r));
    expect(results.every((r) => r.status === 'error')).toBe(true);
    expect(events).toHaveLength(4);
  });

  it('fails fast: a sibling with no dependency on the failed node is skipped, not provisioned', async () => {
    const nodes = [
      node('v', 'vpc'), node('s', 'subnet'),
      node('dA', 'dynamodb', { tableName: `fastfail-a-${Date.now()}`, billingMode: 'BOGUS_MODE' }),
      node('dB', 'dynamodb', { tableName: `fastfail-b-${Date.now()}` }),
    ] as any;
    const edges = [
      { id: 'e0', source: 'v', target: 's' }, { id: 'e1', source: 's', target: 'dA' }, { id: 'e2', source: 's', target: 'dB' },
    ] as any;
    const events: any[] = [];
    const { results } = await orchestrationService.deployGraph(nodes, edges, undefined, (r) => events.push(r));

    const resA = results.find((r) => r.nodeId === 'dA');
    const resB = results.find((r) => r.nodeId === 'dB');
    expect(resA?.status).toBe('error');
    expect(resB?.status).toBe('skipped');
    expect(events.find((e) => e.nodeId === 'dB')?.status).toBe('skipped');
  }, 20000);
});
