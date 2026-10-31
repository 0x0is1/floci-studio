'use client';

import React, { useState, useRef } from 'react';
import { useBottomTrayStore } from '@/store/bottomTrayStore';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { BottomTrayHeader } from './BottomTrayHeader';
import { BottomTrayMinimized } from './BottomTrayMinimized';
import { TerminalView } from './TerminalView';
import { LiveRuntimeView } from './LiveRuntimeView';
import { Ec2TerminalView } from './Ec2TerminalView';

export function BottomTray() {
  const { isOpen, activeTab } = useBottomTrayStore();
  const { nodes } = usePlaygroundStore();
  const { tokens } = useTheme();
  const [height, setHeight] = useState(260);
  const isDragging = useRef(false);

  const runningCount = nodes.filter((n) => n.data.status === 'running' || n.data.liveUrl).length;
  const hasEc2 = nodes.some((n) => n.data.serviceType === 'ec2');

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    const onMouseMove = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      const newH = window.innerHeight - ev.clientY;
      if (newH >= 150 && newH <= 550) setHeight(newH);
    };
    const onMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  if (!isOpen) {
    return <BottomTrayMinimized hasEc2={hasEc2} runningCount={runningCount} />;
  }

  return (
    <div className="border-t flex flex-col shrink-0 z-20 relative select-text" style={{ height: `${height}px`, backgroundColor: tokens.trayBg, borderColor: tokens.border }}>
      <div
        onMouseDown={handleMouseDown}
        className="h-1.5 w-full cursor-row-resize hover:bg-sky-500/40 active:bg-sky-500 transition-colors shrink-0"
        title="Drag to resize panel"
      />
      <BottomTrayHeader />
      <div className="flex-1 overflow-hidden">
        {activeTab === 'terminal' && <TerminalView />}
        {activeTab === 'live' && <LiveRuntimeView />}
        {activeTab === 'ec2-terminal' && (hasEc2 ? <Ec2TerminalView /> : <TerminalView />)}
      </div>
    </div>
  );
}
