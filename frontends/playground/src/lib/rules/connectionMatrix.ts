import { AwsServiceType, AwsEdgeData } from '@/types/aws';
import { checkComputeRules } from './computeRules';
import { checkNetworkRules } from './networkRules';
import { checkMessagingRules } from './messagingRules';
import { checkStorageDbRules } from './storageDbRules';

export interface ValidationResult {
  allowed: boolean;
  reason?: string;
  defaultData?: AwsEdgeData;
}

export function validateAwsConnection(
  sourceType: AwsServiceType,
  targetType: AwsServiceType
): ValidationResult {
  const net = checkNetworkRules(sourceType, targetType);
  if (net.match) return { allowed: true, defaultData: net.data };

  const compute = checkComputeRules(sourceType, targetType);
  if (compute.match) return { allowed: true, defaultData: compute.data };

  const msg = checkMessagingRules(sourceType, targetType);
  if (msg.match) return { allowed: true, defaultData: msg.data };

  const storage = checkStorageDbRules(sourceType, targetType);
  if (storage.match) return { allowed: true, defaultData: storage.data };

  return {
    allowed: false,
    reason: `Invalid AWS architecture pattern: ${sourceType.toUpperCase()} cannot route directly to ${targetType.toUpperCase()}.`,
  };
}
