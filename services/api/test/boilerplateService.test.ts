import { describe, it, expect } from 'bun:test';
import { getBoilerplate } from '../src/services/boilerplateService';

describe('getBoilerplate', () => {
  it('produces the pre-wired Client -> EC2 -> S3 and EC2 -> SQS starter topology', () => {
    const { nodes, edges } = getBoilerplate();
    const types = nodes.map((n) => n.data.serviceType);
    expect(types).toEqual(expect.arrayContaining(['vpc', 'subnet', 'client', 'ec2', 's3', 'sqs']));

    const ec2 = nodes.find((n) => n.data.serviceType === 'ec2')!;
    const client = nodes.find((n) => n.data.serviceType === 'client')!;
    const s3 = nodes.find((n) => n.data.serviceType === 's3')!;
    const sqs = nodes.find((n) => n.data.serviceType === 'sqs')!;
    const subnet = nodes.find((n) => n.data.serviceType === 'subnet')!;

    expect(edges.some((e) => e.source === client.id && e.target === ec2.id)).toBe(true);
    expect(edges.some((e) => e.source === ec2.id && e.target === s3.id)).toBe(true);
    expect(edges.some((e) => e.source === ec2.id && e.target === sqs.id)).toBe(true);
    expect(edges.some((e) => e.source === subnet.id && e.target === ec2.id)).toBe(true);
  });

  it('keeps the VPC/Subnet foundation at indices [0] and [1] for the retrofit patch in projectService', () => {
    const { nodes, edges } = getBoilerplate();
    expect(nodes[0].data.serviceType).toBe('vpc');
    expect(nodes[1].data.serviceType).toBe('subnet');
    expect(edges[0].source).toBe(nodes[0].id);
    expect(edges[0].target).toBe(nodes[1].id);
  });
});
