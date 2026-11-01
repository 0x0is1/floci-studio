'use client';

import { useCallback } from 'react';
import { Connection, Edge } from '@xyflow/react';
import { toast } from 'sonner';
import { AppNode, AppEdge } from '@/store/playgroundStore';
import { validateAwsConnection } from '@/lib/rules/connectionMatrix';
import { handleSideMismatch } from '@/lib/rules/handleSideValidation';

interface Args {
  nodes: AppNode[];
  edges: AppEdge[];
  setEdges: (edges: AppEdge[]) => void;
  selectEdge: (id: string | null) => void;
  isExecuting: boolean;
  isReadOnly: boolean;
}

/** Validates both the AWS architecture matrix and the compute node's 4-way handle sides on every connect/reconnect. */
export function useCanvasConnections({ nodes, edges, setEdges, selectEdge, isExecuting, isReadOnly }: Args) {
  const isValidConnection = useCallback((c: Connection | Edge) => {
    const s = nodes.find((n) => n.id === c.source); const t = nodes.find((n) => n.id === c.target);
    if (!s || !t) return false;
    if (!validateAwsConnection(s.data.serviceType, t.data.serviceType).allowed) return false;
    return !handleSideMismatch(s.data.serviceType, t.data.serviceType, c.sourceHandle, c.targetHandle);
  }, [nodes]);

  const onConnect = useCallback((params: Connection) => {
    if (isExecuting || isReadOnly) return;
    const s = nodes.find((n) => n.id === params.source); const t = nodes.find((n) => n.id === params.target);
    if (!s || !t) return;
    const res = validateAwsConnection(s.data.serviceType, t.data.serviceType);
    if (!res.allowed) { toast.error('Invalid AWS Connection', { description: res.reason }); return; }
    const sideError = handleSideMismatch(s.data.serviceType, t.data.serviceType, params.sourceHandle, params.targetHandle);
    if (sideError) { toast.error('Wrong Connection Side', { description: sideError }); return; }
    const newEdge: Edge = { id: `e-${params.source}-${params.target}`, source: params.source, target: params.target, sourceHandle: params.sourceHandle, targetHandle: params.targetHandle, type: 'custom', data: res.defaultData };
    setEdges([...edges, newEdge as any]); selectEdge(newEdge.id);
    toast.success('Connection Configured', { description: `Connected ${s.data.label}` });
  }, [nodes, edges, setEdges, selectEdge, isExecuting, isReadOnly]);

  const onReconnect = useCallback((oldEdge: Edge, newConn: Connection) => {
    if (isExecuting || isReadOnly) return;
    const s = nodes.find((n) => n.id === newConn.source); const t = nodes.find((n) => n.id === newConn.target);
    if (!s || !t) return;
    const res = validateAwsConnection(s.data.serviceType, t.data.serviceType);
    if (!res.allowed) { toast.error('Invalid AWS Connection', { description: res.reason }); return; }
    const sideError = handleSideMismatch(s.data.serviceType, t.data.serviceType, newConn.sourceHandle, newConn.targetHandle);
    if (sideError) { toast.error('Wrong Connection Side', { description: sideError }); return; }
    setEdges(edges.map((e) => e.id === oldEdge.id ? { ...e, source: newConn.source, target: newConn.target, sourceHandle: newConn.sourceHandle, targetHandle: newConn.targetHandle, type: 'custom', data: res.defaultData } : e));
    toast.success('Connection Reconnected', { description: `Reconnected to ${t.data.label}` });
  }, [nodes, edges, setEdges, isExecuting, isReadOnly]);

  return { isValidConnection, onConnect, onReconnect };
}
