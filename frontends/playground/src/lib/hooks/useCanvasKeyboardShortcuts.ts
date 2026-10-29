'use client';

import { useEffect } from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useCanvasHistoryStore } from '@/store/canvasHistoryStore';
import { toast } from 'sonner';

export function useCanvasKeyboardShortcuts() {
  const { nodes, edges, setNodes, setEdges, selectedNodeId, selectedEdgeId, selectNode, selectEdge, saveCurrentProject, isExecuting } =
    usePlaygroundStore();
  const { undo, redo, pushSnapshot } = useCanvasHistoryStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      // Ctrl + S: Save project
      if ((e.ctrlKey || e.metaKey) && (e.code === 'KeyS' || e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        saveCurrentProject();
        toast.success('Project Saved', { description: 'All coordinates and configurations synced (Ctrl + S).' });
        return;
      }

      if (isInput || isExecuting) return;

      // Ctrl + Z: Undo
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.code === 'KeyZ' || e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        undo();
        return;
      }

      // Ctrl + Shift + Z or Ctrl + Y: Redo
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.code === 'KeyZ' || e.key === 'z' || e.key === 'Z')) ||
        ((e.ctrlKey || e.metaKey) && (e.code === 'KeyY' || e.key === 'y' || e.key === 'Y'))
      ) {
        e.preventDefault();
        redo();
        return;
      }

      // Shift + Delete or Delete / Backspace: Delete selected component
      if ((e.shiftKey && e.key === 'Delete') || e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) {
          e.preventDefault();
          pushSnapshot(nodes, edges);
          const remainingNodes = nodes.filter((n) => n.id !== selectedNodeId);
          const remainingEdges = edges.filter((ed) => ed.source !== selectedNodeId && ed.target !== selectedNodeId);
          setNodes(remainingNodes);
          setEdges(remainingEdges);
          selectNode(null);
          toast.info('Component Deleted', { description: 'Removed component from canvas.' });
        } else if (selectedEdgeId) {
          e.preventDefault();
          pushSnapshot(nodes, edges);
          setEdges(edges.filter((ed) => ed.id !== selectedEdgeId));
          selectEdge(null);
          toast.info('Link Deleted', { description: 'Removed connection link from canvas.' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, edges, selectedNodeId, selectedEdgeId, setNodes, setEdges, selectNode, selectEdge, saveCurrentProject, undo, redo, pushSnapshot, isExecuting]);
}
