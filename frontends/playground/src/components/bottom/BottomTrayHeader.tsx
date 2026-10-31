'use client';

import React from 'react';
import { useBottomTrayStore } from '@/store/bottomTrayStore';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { LuTerminal, LuChevronDown, LuX, LuSquareTerminal } from 'react-icons/lu';

export function BottomTrayHeader() {
  const { activeTab, setActiveTab, setOpen, logs } = useBottomTrayStore();
  const { nodes } = usePlaygroundStore();
  const { tokens } = useTheme();
  const runningCount = nodes.filter((n) => n.data.status === 'running' || n.data.liveUrl).length;
  const hasEc2 = nodes.some((n) => n.data.serviceType === 'ec2');

  const getTabStyle = (tab: any) => ({
    backgroundColor: activeTab === tab ? tokens.btnBg : 'transparent',
    borderColor: activeTab === tab ? tokens.border : 'transparent',
    color: activeTab === tab ? tokens.textPrimary : tokens.textSecondary,
  });

  return (
    <div className="flex items-center justify-between border-t border-b px-3 py-1.5 select-none shrink-0 transition-colors" style={{ backgroundColor: tokens.headerBg, borderColor: tokens.border }}>
      <div className="flex items-center gap-1">
        <button onClick={() => setActiveTab('terminal')} style={getTabStyle('terminal')} className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors cursor-pointer hover:opacity-85">
          <LuTerminal className="w-3.5 h-3.5 text-sky-400" />
          <span>Execution Logs</span>
          {logs.length > 0 && <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-500/20 text-sky-400 font-mono">{logs.length}</span>}
        </button>

        {hasEc2 && (
          <button onClick={() => setActiveTab('ec2-terminal')} style={getTabStyle('ec2-terminal')} className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors cursor-pointer hover:opacity-85">
            <LuSquareTerminal className="w-3.5 h-3.5 text-amber-400" />
            <span>EC2 Shell</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button onClick={() => setOpen(false)} style={{ color: tokens.textMuted }} className="p-1 rounded hover:opacity-85 cursor-pointer" title="Minimize tray">
          <LuChevronDown className="w-4 h-4" />
        </button>
        <button onClick={() => setOpen(false)} style={{ color: tokens.textMuted }} className="p-1 rounded hover:opacity-85 cursor-pointer" title="Close tray">
          <LuX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
