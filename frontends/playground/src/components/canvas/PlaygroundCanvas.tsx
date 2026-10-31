'use client';

import React, { useCallback, useRef } from 'react';
import { ReactFlow, Controls, Background, BackgroundVariant, Connection, Edge, useReactFlow } from '@xyflow/react';
import { toast } from 'sonner';
import { usePlaygroundStore, AppNode } from '@/store/playgroundStore';
import { useCanvasTabStore } from '@/store/canvasTabStore';
import { useTheme } from '@/theme/ThemeProvider';
import { useCanvasKeyboardShortcuts } from '@/lib/hooks/useCanvasKeyboardShortcuts';
import { CustomAwsNode } from './CustomAwsNode';
import { CustomAwsEdge } from './CustomAwsEdge';
import { CanvasSearchBar } from './CanvasSearchBar';
import { validateAwsConnection } from '@/lib/rules/connectionMatrix';
import { AWS_PALETTE_ITEMS } from '@/lib/constants/paletteItems';

const nodeTypes = { custom: CustomAwsNode };
const edgeTypes = { custom: CustomAwsEdge, default: CustomAwsEdge };

export function PlaygroundCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, getViewport, setViewport } = useReactFlow();
  const { nodes, edges, deployedNodes, deployedEdges, onNodesChange, onEdgesChange, setNodes, setEdges, selectNode, selectEdge, isExecuting } = usePlaygroundStore();
  const isReadOnly = useCanvasTabStore((s) => s.activeTab === 'deployed');
  const activeNodes = isReadOnly ? deployedNodes : nodes;
  const activeEdges = isReadOnly ? deployedEdges : edges;
  const { tokens } = useTheme();

  useCanvasKeyboardShortcuts();

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (isExecuting || isReadOnly) return;
    const type = event.dataTransfer.getData('application/floci-node') as any;
    const item = AWS_PALETTE_ITEMS.find((p) => p.type === type);
    if (!item) return;
    const uuid = crypto.randomUUID();
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const newNode: AppNode = { id: `${type}-${uuid.slice(0, 8)}`, type: 'custom', position, data: { serviceType: item.type, label: item.name, status: 'draft', config: { ...item.defaultConfig, uuid } } };
    setNodes([...nodes, newNode]); selectNode(newNode.id);
  }, [nodes, setNodes, selectNode, screenToFlowPosition, isExecuting, isReadOnly]);

  const isValidConnection = useCallback((c: Connection | Edge) => {
    const s = nodes.find((n) => n.id === c.source); const t = nodes.find((n) => n.id === c.target);
    return s && t ? validateAwsConnection(s.data.serviceType, t.data.serviceType).allowed : false;
  }, [nodes]);

  const onConnect = useCallback((params: Connection) => {
    if (isExecuting || isReadOnly) return;
    const s = nodes.find((n) => n.id === params.source); const t = nodes.find((n) => n.id === params.target);
    if (!s || !t) return;
    const res = validateAwsConnection(s.data.serviceType, t.data.serviceType);
    if (!res.allowed) { toast.error('Invalid AWS Connection', { description: res.reason }); return; }
    const newEdge: Edge = { id: `e-${params.source}-${params.target}`, source: params.source, target: params.target, type: 'custom', data: res.defaultData };
    setEdges([...edges, newEdge as any]); selectEdge(newEdge.id);
    toast.success('Connection Configured', { description: `Connected ${s.data.label}` });
  }, [nodes, edges, setEdges, selectEdge, isExecuting, isReadOnly]);

  const onReconnect = useCallback((oldEdge: Edge, newConn: Connection) => {
    if (isExecuting || isReadOnly) return;
    const s = nodes.find((n) => n.id === newConn.source); const t = nodes.find((n) => n.id === newConn.target);
    if (!s || !t) return;
    const res = validateAwsConnection(s.data.serviceType, t.data.serviceType);
    if (!res.allowed) { toast.error('Invalid AWS Connection', { description: res.reason }); return; }
    setEdges(edges.map((e) => e.id === oldEdge.id ? { ...e, source: newConn.source, target: newConn.target, type: 'custom', data: res.defaultData } : e));
    toast.success('Connection Reconnected', { description: `Reconnected to ${t.data.label}` });
  }, [nodes, edges, setEdges, isExecuting, isReadOnly]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 2) {
      const { x, y, zoom } = getViewport();
      setViewport({ x: x - e.deltaX * 1.2, y, zoom });
    }
  }, [getViewport, setViewport]);

  return (
    <div ref={reactFlowWrapper} className="h-full w-full relative" onWheel={onWheel} onDragOver={onDragOver} onDrop={onDrop} style={{ backgroundColor: tokens.canvasBg }}>
      <CanvasSearchBar />
      <ReactFlow
        nodes={activeNodes} edges={activeEdges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        onNodeDragStop={() => usePlaygroundStore.setState({ isDirty: true })}
        onConnect={onConnect} onReconnect={onReconnect} edgesReconnectable={!isReadOnly} reconnectRadius={30} isValidConnection={isValidConnection}
        onNodeClick={(_, node) => selectNode(node.id)} onEdgeClick={(_, edge) => selectEdge(edge.id)}
        onPaneClick={() => { selectNode(null); selectEdge(null); }}
        nodeTypes={nodeTypes} edgeTypes={edgeTypes} defaultEdgeOptions={{ type: 'custom' }}
        nodesDraggable={!isReadOnly} nodesConnectable={!isReadOnly} elementsSelectable={true}
        panOnDrag={[0, 1, 2]} panOnScroll={false} zoomOnScroll={true} zoomOnPinch={true}
        snapToGrid={false} proOptions={{ hideAttribution: true }}
        fitView fitViewOptions={{ padding: 0.4, maxZoom: 0.75 }}
        style={{ backgroundColor: tokens.canvasBg }}
      >
        <Background variant={BackgroundVariant.Lines} color={tokens.borderSubtle} bgColor={tokens.canvasBg} gap={24} size={1} />
        <Controls showInteractive={false} showZoom={true} showFitView={true} position="bottom-left" />
      </ReactFlow>
    </div>
  );
}
