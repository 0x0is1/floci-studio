import { describe, it, expect } from 'bun:test';
import { provisionNetworkResource } from '../src/services/networkProvisioner';

describe('ALB/CloudFront/APIGateway real port routing', () => {
  it('routes ALB to the real dynamically-allocated EC2 port when connected', async () => {
    const logs: any[] = [];
    const edges = [{ source: 'alb-1', target: 'ec2-1' }];
    const portMap = { 'ec2-1': 54321 };
    const res = await provisionNetworkResource('alb-1', 'alb', 'My ALB', {}, {}, logs, edges, portMap);
    expect(res.liveUrl).toBe('http://localhost:54321');
  });

  it('falls back to the static port when no compute target is connected', async () => {
    const logs: any[] = [];
    const res = await provisionNetworkResource('alb-2', 'alb', 'My ALB', {}, {}, logs, [], {});
    expect(res.liveUrl).toBe('http://localhost:8080');
  });

  it('routes CloudFront origin to the real connected port', async () => {
    const logs: any[] = [];
    const edges = [{ source: 'cf-1', target: 'ecs-1' }];
    const portMap = { 'ecs-1': 40123 };
    const res = await provisionNetworkResource('cf-1', 'cloudfront', 'My CDN', {}, {}, logs, edges, portMap);
    expect(res.liveUrl).toBe('http://localhost:40123');
  });

  it('routes API Gateway integration to the real connected Lambda/EC2 port', async () => {
    const logs: any[] = [];
    const edges = [{ source: 'apigw-1', target: 'ec2-2' }];
    const portMap = { 'ec2-2': 48080 };
    const res = await provisionNetworkResource('apigw-1', 'apigateway', 'My API', {}, {}, logs, edges, portMap);
    expect(res.liveUrl).toBe('http://localhost:48080');
  });
});
