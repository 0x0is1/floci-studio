'use client';

import React, { useEffect } from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useProjects } from '@/hooks/useSwrApi';
import { useTheme } from '@/theme/ThemeProvider';
import { ProjectCard } from './ProjectCard';
import { LuPlus, LuLayoutGrid, LuLoaderCircle } from 'react-icons/lu';

interface Props {
  onCreateClick: () => void;
}

export function HomeProjectsSection({ onCreateClick }: Props) {
  const { projects: swrProjects, isLoading } = useProjects();
  const { projects: storeProjects, loadProjects } = usePlaygroundStore();
  const { tokens } = useTheme();

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const projects = swrProjects?.length ? swrProjects : storeProjects;

  return (
    <div className="space-y-6 select-text" style={{ userSelect: 'text' }}>
      <div className="rounded-2xl border p-6 shadow-sm space-y-4" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <img src="/floci-logo.png" alt="Floci" className="w-9 h-9 object-contain" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Floci Studio</h1>
          </div>
          <button
            type="button"
            onClick={onCreateClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold shadow-md shadow-sky-500/20 transition-all cursor-pointer shrink-0"
          >
            <LuPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Create New Project</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: tokens.border }}>
          <div className="flex items-center gap-2">
            <LuLayoutGrid className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-semibold tracking-wide">Infrastructure Projects</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: tokens.cardBgAlt, color: tokens.textMuted }}>
              {projects.length}
            </span>
          </div>
        </div>

        {isLoading && projects.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-12 rounded-xl border border-dashed p-8 text-xs" style={{ borderColor: tokens.border, color: tokens.textMuted }}>
            <LuLoaderCircle className="w-4 h-4 animate-spin text-sky-400" />
            <span>Loading projects from Floci orchestrator...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-dashed p-8 space-y-3" style={{ borderColor: tokens.border, backgroundColor: tokens.cardBgAlt }}>
            <p className="text-sm font-medium" style={{ color: tokens.textPrimary }}>No projects available</p>
            <p className="text-xs max-w-md mx-auto" style={{ color: tokens.textMuted }}>
              Get started by creating your first architecture project.
            </p>
            <button
              type="button"
              onClick={onCreateClick}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500 text-slate-950 text-xs font-semibold hover:bg-sky-400 cursor-pointer"
            >
              <LuPlus className="w-3.5 h-3.5" />
              <span>Create First Project</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((p: any) => (
              <ProjectCard key={p.id} project={p as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
