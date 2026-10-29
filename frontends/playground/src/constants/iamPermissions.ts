import { IamAction, COMPUTE_IAM_ACTIONS } from './iam/computeIam';
import { STORAGE_IAM_ACTIONS } from './iam/storageIam';
import { MESSAGING_IAM_ACTIONS } from './iam/messagingIam';
import { SECURITY_IAM_ACTIONS } from './iam/securityIam';

export type { IamAction };

export const AWS_IAM_ACTIONS: IamAction[] = [
  ...COMPUTE_IAM_ACTIONS,
  ...STORAGE_IAM_ACTIONS,
  ...MESSAGING_IAM_ACTIONS,
  ...SECURITY_IAM_ACTIONS,
];

export const ALL_IAM_PERMISSION_NAMES: string[] = AWS_IAM_ACTIONS.map((a) => a.action);

export function getRecommendedIamActions(serviceType?: string): IamAction[] {
  if (!serviceType) return AWS_IAM_ACTIONS.slice(0, 8);
  const normalized = serviceType.toLowerCase();
  const prioritized = AWS_IAM_ACTIONS.filter((a) => a.service === normalized);
  const others = AWS_IAM_ACTIONS.filter((a) => a.service !== normalized);
  return [...prioritized, ...others];
}
