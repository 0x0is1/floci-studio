import { computeHandleSide, HandleSide } from '@shared/connectionMatrix';

const COMPUTE_TYPES = ['ec2', 'ecs', 'lambda'];

const SIDE_LABEL: Record<HandleSide, string> = {
  left: 'LEFT (network placement)',
  top: 'TOP (ingress / triggers)',
  bottom: 'BOTTOM (resource dependencies)',
  right: 'RIGHT (peer compute / test target)',
};

/** Returns a human-readable error when a drag landed on the wrong side of a compute node's 4-way handle, or null if fine. */
export function handleSideMismatch(
  sourceType: string,
  targetType: string,
  sourceHandle?: string | null,
  targetHandle?: string | null
): string | null {
  if (COMPUTE_TYPES.includes(sourceType) && sourceHandle) {
    const expected = computeHandleSide(targetType, 'outgoing');
    if (sourceHandle !== expected) return `Wrong side: ${targetType.toUpperCase()} must connect from the ${SIDE_LABEL[expected]} handle.`;
  }
  if (COMPUTE_TYPES.includes(targetType) && targetHandle) {
    const expected = computeHandleSide(sourceType, 'incoming');
    if (targetHandle !== expected) return `Wrong side: ${sourceType.toUpperCase()} must connect into the ${SIDE_LABEL[expected]} handle.`;
  }
  return null;
}
