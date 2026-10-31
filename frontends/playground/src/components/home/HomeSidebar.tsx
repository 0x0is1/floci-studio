'use client';

import React from 'react';
import { HomeServicesCard } from './HomeServicesCard';
import { HomeQuickstarts } from './HomeQuickstarts';
import { useProjects } from '@/hooks/useSwrApi';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { LuFolderGit2, LuBoxes } from 'react-icons/lu';

interface Props {
  onCreateClick: () => void;
}

export function HomeSidebar({ onCreateClick }: Props) {
  const { projects: swrProjects } = useProjects();
  const { projects: storeProjects } = usePlaygroundStore();
  const { tokens } = useTheme();
  const count = swrProjects?.length || storeProjects.length;

  return (
    <aside className="w-full space-y-5 select-text" style={{ userSelect: 'text' }}>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border p-3.5 space-y-1 shadow-xs" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <LuFolderGit2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Projects</span>
          </div>
          <p className="text-xl font-bold font-mono tracking-tight select-all" style={{ color: tokens.textPrimary }}>
            {count}
          </p>
        </div>

        <div className="rounded-xl border p-3.5 space-y-1 shadow-xs" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <LuBoxes className="w-3.5 h-3.5 text-amber-400" />
            <span>DAG Engine</span>
          </div>
          <p className="text-xs font-mono font-semibold pt-1 text-emerald-400">
            Topological
          </p>
        </div>
      </div>

      <HomeServicesCard />
      <HomeQuickstarts onCreateClick={onCreateClick} />
    </aside>
  );
}
