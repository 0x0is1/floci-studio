'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { LuFolder, LuArrowRight, LuTrash2, LuClock } from 'react-icons/lu';
import { toast } from 'sonner';

interface Props {
  project: {
    id: string;
    name: string;
    updatedAt: string;
    status: string;
    nodeCount?: number;
    edgeCount?: number;
  };
}

export function ProjectCard({ project }: Props) {
  const router = useRouter();
  const { deleteProjectById } = usePlaygroundStore();
  const { tokens } = useTheme();

  const handleOpen = () => {
    router.push(`/projects/${project.id}/editor`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete project "${project.name}"?`)) {
      deleteProjectById(project.id);
      toast.info('Project deleted');
    }
  };

  const dateStr = project.updatedAt ? new Date(project.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) : 'Just now';

  return (
    <div
      onClick={handleOpen}
      style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, boxShadow: tokens.cardShadow }}
      className="group relative rounded-xl border p-5 transition-all duration-200 hover:border-sky-500/50 hover:shadow-lg cursor-pointer flex flex-col justify-between"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-sky-500/10 border border-sky-500/20 text-sky-400 group-hover:scale-105 transition-transform">
              <LuFolder className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm group-hover:text-sky-400 transition-colors" style={{ color: tokens.textPrimary }}>
                {project.name}
              </h3>
              <p className="text-[11px] font-mono" style={{ color: tokens.textMuted }}>ID: {project.id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            className="p-1.5 rounded text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            title="Delete project"
          >
            <LuTrash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs" style={{ color: tokens.textMuted }}>
          <LuClock className="w-3.5 h-3.5" />
          <span>Updated {dateStr}</span>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t flex items-center justify-between" style={{ borderColor: tokens.border }}>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
          {project.status || 'DRAFT'}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 group-hover:translate-x-1 transition-transform cursor-pointer"
        >
          <span>Open Canvas</span>
          <LuArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
