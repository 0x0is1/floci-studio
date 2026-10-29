import { useMemo } from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useCanvasHoverStore } from '@/store/canvasHoverStore';

export interface NodeHighlightStatus {
  isSelf: boolean;
  isIncoming: boolean;
  isOutgoing: boolean;
  isDimmed: boolean;
}

export function useNodeHoverHighlight(nodeId: string): NodeHighlightStatus {
  const hoveredNodeId = useCanvasHoverStore((s) => s.hoveredNodeId);
  const edges = usePlaygroundStore((s) => s.edges);

  return useMemo(() => {
    if (!hoveredNodeId) {
      return { isSelf: false, isIncoming: false, isOutgoing: false, isDimmed: false };
    }
    if (hoveredNodeId === nodeId) {
      return { isSelf: true, isIncoming: false, isOutgoing: false, isDimmed: false };
    }

    const isIncoming = edges.some((e) => e.source === nodeId && e.target === hoveredNodeId);
    const isOutgoing = edges.some((e) => e.source === hoveredNodeId && e.target === nodeId);
    const isDimmed = !isIncoming && !isOutgoing;

    return { isSelf: false, isIncoming, isOutgoing, isDimmed };
  }, [hoveredNodeId, edges, nodeId]);
}
