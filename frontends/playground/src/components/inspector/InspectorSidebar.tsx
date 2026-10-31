'use client';

import React from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useCanvasTabStore } from '@/store/canvasTabStore';
import { useTheme } from '@/theme/ThemeProvider';
import { NodeInspectorHeader, EdgeInspectorHeader } from './InspectorHeaders';
import { NodeConfigPanel } from './NodeConfigPanel';
import { EdgeConfigPanel } from './EdgeConfigPanel';
import { InspectorIdleView } from './InspectorIdleView';
import { LiveComponentTelemetry } from './LiveComponentTelemetry';

export function InspectorSidebar() {
  const { selectedNodeId, selectedEdgeId, selectNode, selectEdge, nodes, edges, deployedNodes, deployedEdges } = usePlaygroundStore();
  const isDeployedTab = useCanvasTabStore((s) => s.activeTab === 'deployed');
  const { tokens } = useTheme();

  const activeNodes = isDeployedTab && deployedNodes.length > 0 ? deployedNodes : nodes;
  const activeEdges = isDeployedTab && deployedEdges.length > 0 ? deployedEdges : edges;
  const selectedNode = selectedNodeId ? activeNodes.find((n) => n.id === selectedNodeId) : null;
  const selectedEdge = selectedEdgeId ? activeEdges.find((e) => e.id === selectedEdgeId) : null;

  return (
    <aside className="w-80 border-l flex flex-col h-full shrink-0 transition-colors" style={{ backgroundColor: tokens.sidebarBg, borderColor: tokens.border }}>
      {selectedNode ? (
        <>
          <NodeInspectorHeader node={selectedNode} onClose={() => selectNode(null)} isReadOnly={isDeployedTab} />
          <div className="flex-1 overflow-y-auto">
            {isDeployedTab ? (
              <LiveComponentTelemetry nodeData={selectedNode.data} nodeId={selectedNode.id} node={selectedNode} />
            ) : (
              <NodeConfigPanel />
            )}
          </div>
        </>
      ) : selectedEdge ? (
        <>
          <EdgeInspectorHeader edge={selectedEdge} onClose={() => selectEdge(null)} isReadOnly={isDeployedTab} />
          <div className="flex-1 overflow-y-auto">
            <EdgeConfigPanel />
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <InspectorIdleView />
        </div>
      )}
    </aside>
  );
}
