import { AwsServiceType, AwsEdgeData } from '@/types/aws';
import { validateConnection } from '@shared/connectionMatrix';

export interface ValidationResult {
  allowed: boolean;
  reason?: string;
  defaultData?: AwsEdgeData;
}

export function validateAwsConnection(
  sourceType: AwsServiceType,
  targetType: AwsServiceType
): ValidationResult {
  const res = validateConnection(sourceType, targetType);
  return { allowed: res.allowed, reason: res.reason, defaultData: res.defaultData as AwsEdgeData | undefined };
}
