'use client';

import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { PlaygroundHeader } from '@/components/header/PlaygroundHeader';
import { CanvasTabBar } from '@/components/canvas/CanvasTabBar';
import { PlaygroundCanvas } from '@/components/canvas/PlaygroundCanvas';
import { AwsPaletteSidebar } from '@/components/sidebar/AwsPaletteSidebar';
import { InspectorSidebar } from '@/components/inspector/InspectorSidebar';

export function ProjectEditorView() {
  const { tokens } = useTheme();
  const selectedNodeId = usePlaygroundStore((s) => s.selectedNodeId);
  const selectedEdgeId = usePlaygroundStore((s) => s.selectedEdgeId);
  const hasSelection = Boolean(selectedNodeId || selectedEdgeId);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden transition-colors" style={{ backgroundColor: tokens.canvasBg, color: tokens.textPrimary }}>
      <PlaygroundHeader />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <main className="flex-1 relative overflow-hidden flex flex-col">
          <CanvasTabBar />
          <div className="flex-1 relative overflow-hidden">
            <ReactFlowProvider>
              <PlaygroundCanvas />
            </ReactFlowProvider>
          </div>
        </main>
        {hasSelection ? <InspectorSidebar /> : <AwsPaletteSidebar />}
      </div>
    </div>
  );
}
