'use client';

import React from 'react';
import { useBottomTrayStore } from '@/store/bottomTrayStore';
import { useCanvasTabStore } from '@/store/canvasTabStore';
import { useTheme } from '@/theme/ThemeProvider';
import { LuTerminal, LuActivity, LuChevronUp, LuSquareTerminal } from 'react-icons/lu';

export function BottomTrayMinimized({ hasEc2, runningCount }: { hasEc2: boolean; runningCount: number }) {
  const { setActiveTab, toggleOpen, logs } = useBottomTrayStore();
  const { tokens } = useTheme();

  const handleTabClick = (tab: any) => {
    useCanvasTabStore.getState().setActiveTab('deployed');
    setActiveTab(tab);
  };

  return (
    <div className="border-t px-4 py-1.5 flex items-center justify-between text-xs select-none transition-colors" style={{ backgroundColor: tokens.trayBg, borderColor: tokens.border }}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleTabClick('terminal')}
          style={{ color: tokens.textSecondary }}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:opacity-85 transition-colors cursor-pointer"
        >
          <LuTerminal className="w-3.5 h-3.5 text-sky-400" />
          <span>Execution Logs</span>
          {logs.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-500/20 text-sky-400 font-mono">{logs.length}</span>
          )}
        </button>

        {hasEc2 && (
          <button
            onClick={() => handleTabClick('ec2-terminal')}
            style={{ color: tokens.textSecondary }}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:opacity-85 transition-colors cursor-pointer"
          >
            <LuSquareTerminal className="w-3.5 h-3.5 text-amber-400" />
            <span>EC2 Shell</span>
          </button>
        )}

        <button
          onClick={() => handleTabClick('live')}
          aria-label="Live Infrastructure / Live Resources"
          style={{ color: tokens.textSecondary }}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:opacity-85 transition-colors cursor-pointer"
        >
          <LuActivity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Live Infrastructure</span>
          {runningCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-mono">
              {runningCount}
            </span>
          )}
        </button>
      </div>

      <button onClick={toggleOpen} style={{ color: tokens.textMuted }} className="p-1 rounded hover:opacity-85 cursor-pointer" title="Open console">
        <LuChevronUp className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

