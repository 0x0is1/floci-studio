import React, { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { AwsNodeData } from '@/types/aws';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useCanvasHoverStore } from '@/store/canvasHoverStore';
import { useCanvasTabStore } from '@/store/canvasTabStore';
import { useTheme } from '@/theme/ThemeProvider';
import { NodeCardBody } from './NodeCardBody';
import { NodeTailHandle } from './NodeTailHandle';

function CustomAwsNodeComponent(props: any) {
  const nodeData = (props.data || {}) as AwsNodeData;
  const isRunning = nodeData.status === 'running', isDeploying = nodeData.status === 'deploying', isError = nodeData.status === 'error';
  const selected = Boolean(props.selected);
  const [isHovered, setIsHovered] = useState(false), [showAddMenu, setShowAddMenu] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<any>(null);
  const setHoveredNodeId = useCanvasHoverStore((s) => s.setHoveredNodeId);
  const isDeployedTab = useCanvasTabStore((s) => s.activeTab === 'deployed');
  const { tokens } = useTheme();

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true); setHoveredNodeId(props.id);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => { setIsHovered(false); setHoveredNodeId(null); }, 450);
  };

  useEffect(() => {
    if (nodeRef.current?.parentElement) {
      nodeRef.current.parentElement.style.zIndex = showAddMenu ? '1000' : isHovered ? '20' : '';
    }
  }, [showAddMenu, isHovered]);

  const borderColor = selected ? tokens.borderFocus : isRunning ? tokens.statusRunning : isDeploying ? tokens.statusDeploying : isError ? tokens.statusError : tokens.border;
  const hasTargetHandle = !['cloudfront', 'vpc', 'route53'].includes(nodeData.serviceType);
  const hasSourceHandle = !['rds', 'dynamodb', 's3'].includes(nodeData.serviceType);

  return (
    <div
      ref={nodeRef}
      onClick={() => usePlaygroundStore.getState().selectNode(props.id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ backgroundColor: tokens.cardBg, borderColor, boxShadow: tokens.cardShadow }}
      className={`relative min-w-[190px] rounded-lg border p-3 transition-colors ${selected ? 'ring-1 ring-sky-500/50' : ''}`}
    >
      {hasTargetHandle && (
        <Handle
          type="target"
          position={Position.Left}
          className="!bg-sky-400 !w-2.5 !h-2.5 !rounded-full !border-2 !border-slate-900 transition-all hover:scale-125 hover:shadow-[0_0_8px_rgba(56,189,248,0.8)] !cursor-crosshair z-30"
          style={{ cursor: 'crosshair' }}
          title="Drop connection here"
        />
      )}

      {hasSourceHandle && (
        <Handle
          type="source"
          position={Position.Right}
          className="!bg-sky-400 !w-2.5 !h-2.5 !rounded-full !border-2 !border-slate-900 transition-all hover:scale-125 hover:shadow-[0_0_8px_rgba(56,189,248,0.8)] !cursor-crosshair z-30 pointer-events-auto"
          style={{ cursor: 'crosshair' }}
          title="Drag to connect"
        />
      )}

      <NodeCardBody nodeData={nodeData} nodeId={props.id} />

      {!isDeployedTab && hasSourceHandle && (
        <NodeTailHandle
          nodeId={props.id}
          serviceType={nodeData.serviceType}
          isHovered={isHovered}
          showAddMenu={showAddMenu}
          setShowAddMenu={setShowAddMenu}
        />
      )}
    </div>
  );
}

export const CustomAwsNode = memo(CustomAwsNodeComponent) as any;
