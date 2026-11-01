/** Shared primitives for the connection matrix - imported by every rule file, never duplicated. */

export type EdgeData = Record<string, unknown> & {
  protocol?: string;
  port?: number;
  iamPolicy?: string;
  envVarName?: string;
  isConfigured: boolean;
};

export type HandleSide = 'left' | 'top' | 'bottom' | 'right';

export const COMPUTE_TYPES = ['ec2', 'ecs', 'lambda'] as const;
export const NETWORK_PLACEMENT_TYPES = ['vpc', 'subnet'] as const;
export const TEST_TYPES = ['testrunner'] as const;

export function isCompute(t: string): boolean {
  return (COMPUTE_TYPES as readonly string[]).includes(t);
}
