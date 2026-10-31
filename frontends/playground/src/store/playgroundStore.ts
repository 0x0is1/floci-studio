import { create } from 'zustand';
import { Node, Edge, OnNodesChange, OnEdgesChange, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { AwsNodeData, AwsEdgeData } from '@/types/aws';
import { createProjectSlice, ProjectStateSlice } from './projectStoreSlice';

export type AppNode = Node<AwsNodeData>;
export type AppEdge = Edge<AwsEdgeData>;

interface PlaygroundState extends ProjectStateSlice {
  nodes: AppNode[];
  edges: AppEdge[];
  deployedNodes: AppNode[];
  deployedEdges: AppEdge[];
  isExecuting: boolean;
  isDeployed: boolean;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;

  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange<AppEdge>;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: AppEdge[]) => void;
  setDeployedState: (nodes: AppNode[], edges: AppEdge[]) => void;
  clearDeployedState: () => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  updateNodeConfig: (id: string, config: Record<string, any>, label?: string) => void;
  updateEdgeData: (id: string, data: Partial<AwsEdgeData>) => void;
  setExecuting: (executing: boolean) => void;
  setDeployed: (deployed: boolean) => void;
  updateNodeStatus: (id: string, status: AppNode['data']['status'], liveUrl?: string, port?: number) => void;
}

export const usePlaygroundStore = create<PlaygroundState>((set, get) => ({
  ...createProjectSlice(set, get),
  nodes: [],
  edges: [],
  deployedNodes: [],
  deployedEdges: [],
  isExecuting: false,
  isDeployed: false,
  selectedNodeId: null,
  selectedEdgeId: null,

  onNodesChange: (c) => !get().isExecuting && set({ nodes: applyNodeChanges(c, get().nodes) }),
  onEdgesChange: (c) => !get().isExecuting && set({ edges: applyEdgeChanges(c, get().edges) }),
  setNodes: (nodes) => set({ nodes, isDirty: true }),
  setEdges: (edges) => set({ edges, isDirty: true }),
  setDeployedState: (deployedNodes, deployedEdges) => set({ deployedNodes, deployedEdges }),
  clearDeployedState: () => set({ deployedNodes: [], deployedEdges: [], isDeployed: false }),
  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

  deleteNode: (id) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: null, isDirty: true,
    });
  },

  deleteEdge: (id) => {
    set({
      edges: get().edges.filter((e) => e.id !== id),
      selectedEdgeId: null, isDirty: true,
    });
  },

  updateNodeConfig: (id, config, label) => {
    set({
      nodes: get().nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, config, label: label || n.data.label } } : n)),
      isDirty: true,
    });
  },

  updateEdgeData: (id, data) => {
    set({
      edges: get().edges.map((e) => (e.id === id ? { ...e, data: { ...e.data, ...data, isConfigured: true } } : e)),
      isDirty: true,
    });
  },

  setExecuting: (executing) => set({ isExecuting: executing }),
  setDeployed: (deployed) => set({ isDeployed: deployed }),
  updateNodeStatus: (id, status, liveUrl, port) => {
    set({
      deployedNodes: get().deployedNodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, status, liveUrl: liveUrl || n.data.liveUrl, config: port ? { ...n.data.config, port } : n.data.config } } : n
      ),
    });
  },
}));
