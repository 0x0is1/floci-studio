import { describe, it, expect } from 'bun:test';
import { reconcileNodeStates } from './stateRecovery';
import { AppNode } from '@/store/playgroundStore';

describe('stateRecovery - Project Deploy & Refresh Persistence', () => {
  const sampleNodes: AppNode[] = [
    {
      id: 'vpc-1', type: 'custom', position: { x: 0, y: 0 },
      data: { serviceType: 'vpc', label: 'Default VPC', status: 'running', config: { vpcId: 'vpc-default' } },
    },
    {
      id: 'subnet-1', type: 'custom', position: { x: 100, y: 0 },
      data: { serviceType: 'subnet', label: 'Default Subnet', status: 'running', config: { subnetId: 'subnet-1' } },
    },
    {
      id: 'sqs-1', type: 'custom', position: { x: 200, y: 0 },
      data: { serviceType: 'sqs', label: 'Queue', status: 'running', config: { queueName: 'app-queue' } },
    },
    {
      id: 'ec2-1', type: 'custom', position: { x: 300, y: 0 },
      data: { serviceType: 'ec2', label: 'Server', status: 'running', liveUrl: 'http://localhost:8080', config: { port: 8080 } },
    },
  ];

  it('keeps running status and isDeployed=true on refresh when project is running', () => {
    const runtime = { ec2: { runningPorts: [8080] }, sqs: { queues: ['http://localhost:4566/000000000000/app-queue'] } };
    const { nodes, isDeployed } = reconcileNodeStates(sampleNodes, runtime, [], 'running');

    expect(isDeployed).toBe(true);
    expect(nodes.find((n) => n.id === 'ec2-1')?.data.status).toBe('running');
    expect(nodes.find((n) => n.id === 'sqs-1')?.data.status).toBe('running');
    expect(nodes.find((n) => n.id === 'vpc-1')?.data.status).toBe('running');
    expect(nodes.find((n) => n.id === 'subnet-1')?.data.status).toBe('running');
  });

  it('preserves deployed running status even if runtime port query returns empty during reload', () => {
    const emptyRuntime = { ec2: { runningPorts: [] }, sqs: { queues: [] } };
    const { nodes, isDeployed } = reconcileNodeStates(sampleNodes, emptyRuntime, [], 'running');

    expect(isDeployed).toBe(true);
    expect(nodes.find((n) => n.id === 'ec2-1')?.data.status).toBe('running');
    expect(nodes.find((n) => n.id === 'ec2-1')?.data.liveUrl).toBe('http://localhost:8080');
    expect(nodes.find((n) => n.id === 'vpc-1')?.data.status).toBe('running');
  });

  it('resets to draft and isDeployed=false when project is explicitly stopped', () => {
    const { nodes, isDeployed } = reconcileNodeStates(sampleNodes, null, [], 'draft');

    expect(isDeployed).toBe(false);
    expect(nodes.every((n) => n.data.status === 'draft')).toBe(true);
    expect(nodes.every((n) => n.data.liveUrl === undefined)).toBe(true);
  });
});

