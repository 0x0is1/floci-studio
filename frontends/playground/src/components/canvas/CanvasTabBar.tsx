'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCanvasTabStore, CanvasTab } from '@/store/canvasTabStore';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { LuPenTool, LuActivity, LuShieldCheck, LuRadio } from 'react-icons/lu';

export function CanvasTabBar() {
  const router = useRouter();
  const { activeTab, setActiveTab } = useCanvasTabStore();
  const { isDeployed, activeProjectId } = usePlaygroundStore();
  const { tokens } = useTheme();

  const handleTabChange = (tab: CanvasTab) => {
    setActiveTab(tab);
    if (activeProjectId && typeof window !== 'undefined') {
      const page = tab === 'deployed' ? 'runtime' : 'editor';
      window.history.pushState({}, '', `/projects/${activeProjectId}/${page}`);
    }
  };

  return (
    <div className="h-10 border-b px-4 flex items-center justify-between z-10 shrink-0 transition-colors" style={{ backgroundColor: tokens.headerBg, borderColor: tokens.border }}>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => handleTabChange('editor')}
          style={activeTab !== 'editor' ? { color: tokens.textSecondary } : undefined}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'editor'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-sm'
              : 'hover:opacity-85'
          }`}
        >
          <LuPenTool className="w-3.5 h-3.5" />
          <span>Architecture Editor</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('deployed')}
          style={activeTab !== 'deployed' ? { color: tokens.textSecondary } : undefined}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'deployed'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
              : 'hover:opacity-85'
          }`}
        >
          <LuActivity className="w-3.5 h-3.5" />
          <span>Live Cluster Runtime</span>
          <span className={`w-2 h-2 rounded-full ${isDeployed ? 'bg-emerald-400' : 'bg-slate-500'}`} />
        </button>
      </div>

      <div className="flex items-center gap-2 text-[11px] font-mono" style={{ color: tokens.textMuted }}>
        {activeTab === 'deployed' ? (
          <span className="flex items-center gap-1.5 text-emerald-400/90">
            <LuRadio className="w-3.5 h-3.5" />
            Live Infrastructure Runtime (Read-Only)
          </span>
        ) : (
          <span className="flex items-center gap-1.5" style={{ color: tokens.textMuted }}>
            <LuShieldCheck className="w-3.5 h-3.5 text-sky-500" />
            Interactive Canvas Studio
          </span>
        )}
      </div>
    </div>
  );
}