'use client';

import React from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { LuSlidersHorizontal, LuCpu, LuNetwork, LuInfo } from 'react-icons/lu';

export function InspectorIdleView() {
  const { nodes, edges, projectName } = usePlaygroundStore();
  const { tokens } = useTheme();

  return (
    <div className="p-4 space-y-5 text-xs" style={{ color: tokens.textSecondary }}>
      <div className="border-b pb-3 flex items-center gap-2" style={{ borderColor: tokens.border }}>
        <LuSlidersHorizontal className="w-4 h-4 text-sky-400" />
        <span className="font-semibold" style={{ color: tokens.textPrimary }}>Architecture Inspector</span>
      </div>

      <div className="rounded-lg border p-3 space-y-2" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
        <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: tokens.textMuted }}>Active Workspace</p>
        <p className="font-semibold truncate" style={{ color: tokens.textPrimary }}>{projectName || 'Default Architecture'}</p>
        <div className="grid grid-cols-2 gap-2 pt-2 border-t font-mono text-[11px]" style={{ borderColor: tokens.border }}>
          <div className="flex items-center gap-1.5" style={{ color: tokens.textSecondary }}>
            <LuCpu className="w-3.5 h-3.5 text-sky-400" />
            <span>{nodes.length} Nodes</span>
          </div>
          <div className="flex items-center gap-1.5" style={{ color: tokens.textSecondary }}>
            <LuNetwork className="w-3.5 h-3.5 text-emerald-400" />
            <span>{edges.length} Links</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-3 space-y-2.5" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
        <div className="flex items-center gap-1.5 text-sky-400 font-medium">
          <LuInfo className="w-3.5 h-3.5" />
          <span>Quick Guide</span>
        </div>
        <ul className="space-y-2 text-[11px] leading-relaxed" style={{ color: tokens.textMuted }}>
          <li>- Click any component on canvas to open its AWS specifications and parameters.</li>
          <li>- Click any connection line or link badge to inspect and configure security rules and protocols.</li>
          <li>- Deploy in header to start all resources with semaphore locks and view real-time logs below.</li>
        </ul>
      </div>
    </div>
  );
}
