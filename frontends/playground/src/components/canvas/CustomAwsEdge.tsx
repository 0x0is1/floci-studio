import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from '@xyflow/react';
import { AwsEdgeData } from '@/types/aws';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useCanvasHoverStore } from '@/store/canvasHoverStore';
import { useCanvasTabStore } from '@/store/canvasTabStore';
import { useTheme } from '@/theme/ThemeProvider';

export function CustomAwsEdge(props: any) {
  const { id, source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, selected } = props;
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius: 8,
  });
  const hoveredNodeId = useCanvasHoverStore((s) => s.hoveredNodeId);
  const isDeployedTab = useCanvasTabStore((s) => s.activeTab === 'deployed');
  const nodes = usePlaygroundStore((s) => s.nodes);
  const { tokens } = useTheme();

  const sourceNode = nodes.find((n) => n.id === source);
  const isLiveStreaming = isDeployedTab && sourceNode?.data?.status === 'running';

  const isIncoming = hoveredNodeId ? target === hoveredNodeId : false;
  const isOutgoing = hoveredNodeId ? source === hoveredNodeId : isLiveStreaming;
  const isDimmed = hoveredNodeId ? !isIncoming && !isOutgoing : false;

  const edgeData = (data || {}) as AwsEdgeData;
  const label = edgeData?.protocol
    ? `${edgeData.protocol}${edgeData.port ? ` :${edgeData.port}` : ''}`
    : edgeData?.iamPolicy ? 'IAM Policy' : 'Linked';

  const strokeColor = isIncoming ? '#ef4444' : isOutgoing ? '#10b981' : selected ? '#38bdf8' : isDeployedTab ? '#38bdf8' : '#64748b';

  return (
    <>
      <BaseEdge
        path={edgePath}
        interactionWidth={40}
        style={{
          stroke: strokeColor,
          strokeWidth: isIncoming || isOutgoing ? 2.8 : selected ? 2.2 : 1.8,
          strokeDasharray: isIncoming || isOutgoing ? '8 5' : undefined,
          animation: isIncoming ? 'flowDashIncoming 0.8s linear infinite' : isOutgoing ? 'flowDashOutgoing 0.8s linear infinite' : undefined,
          opacity: isDimmed ? 0.2 : 1,
          transition: 'stroke 0.2s ease',
          cursor: 'pointer',
        }}
      />

      {isIncoming && (
        <circle cx="0" cy="0" r="5" fill="#ef4444" filter="drop-shadow(0 0 6px #ef4444)">
          <animateMotion dur="1.2s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}

      {isOutgoing && (
        <circle cx="0" cy="0" r="5" fill="#10b981" filter="drop-shadow(0 0 6px #10b981)">
          <animateMotion dur="1.2s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}

      <EdgeLabelRenderer>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); usePlaygroundStore.getState().selectEdge(id); }}
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            opacity: isDimmed ? 0.25 : 1,
            backgroundColor: !isIncoming && !isOutgoing && !selected ? tokens.cardBg : undefined,
            borderColor: !isIncoming && !isOutgoing && !selected ? tokens.border : undefined,
            color: !isIncoming && !isOutgoing && !selected ? tokens.textSecondary : undefined,
          }}
          className={`px-2.5 py-1 rounded text-xs font-mono border transition-all cursor-pointer ${
            isIncoming ? 'bg-red-950 border-red-500 text-red-200 shadow-md ring-1 ring-red-500/50'
              : isOutgoing ? 'bg-emerald-950 border-emerald-400 text-emerald-200 shadow-md ring-1 ring-emerald-400/50'
              : selected ? 'bg-sky-950 border-sky-400 text-sky-200 shadow-md ring-1 ring-sky-400/50'
              : 'hover:opacity-85'
          }`}
        >
          {label}
        </button>
      </EdgeLabelRenderer>
    </>
  );
}
