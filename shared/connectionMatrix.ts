/**
 * Single source of truth for which AWS node types may connect to which, consumed
 * by both the frontend canvas (visual validation) and the backend API (server-side
 * enforcement). Rule tables live in ./connectionRules/*, never duplicated elsewhere.
 */

import { EdgeData, HandleSide, NETWORK_PLACEMENT_TYPES, TEST_TYPES, isCompute } from './connectionRules/types';
import { computeRule } from './connectionRules/compute';
import { networkRule } from './connectionRules/network';
import { messagingRule } from './connectionRules/messaging';
import { storageDbRule } from './connectionRules/storageDb';

export type { EdgeData, HandleSide };

export interface ValidationResult {
  allowed: boolean;
  reason?: string;
  defaultData?: EdgeData;
}

export function validateConnection(sourceType: string, targetType: string): ValidationResult {
  const data =
    computeRule(sourceType, targetType) ??
    networkRule(sourceType, targetType) ??
    messagingRule(sourceType, targetType) ??
    storageDbRule(sourceType, targetType);

  if (data) return { allowed: true, defaultData: data };

  return {
    allowed: false,
    reason: `Invalid AWS architecture pattern: ${sourceType.toUpperCase()} cannot route directly to ${targetType.toUpperCase()}.`,
  };
}

/**
 * Which physical side a compute node's handle occupies for a given peer + role.
 * Only compute nodes (and the test-runner node receiving from them) are multi-sided;
 * every other node type keeps a single target/source handle pair.
 */
export function computeHandleSide(peerType: string, role: 'incoming' | 'outgoing'): HandleSide {
  if (role === 'incoming') {
    if ((NETWORK_PLACEMENT_TYPES as readonly string[]).includes(peerType)) return 'left';
    return 'top';
  }
  if (isCompute(peerType) || (TEST_TYPES as readonly string[]).includes(peerType)) return 'right';
  return 'bottom';
}
