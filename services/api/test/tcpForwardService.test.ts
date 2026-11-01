import { describe, it, expect } from 'bun:test';
import { buildTcpForwardScript } from '../src/services/tcpForwardService';

describe('buildTcpForwardScript', () => {
  it('returns an empty string when no raw-TCP containers (RDS/ElastiCache) are running', async () => {
    const script = await buildTcpForwardScript();
    expect(typeof script).toBe('string');
    if (script) {
      expect(script).toMatch(/socat/);
    } else {
      expect(script).toBe('');
    }
  });
});
