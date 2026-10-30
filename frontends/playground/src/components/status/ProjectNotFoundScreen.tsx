'use client';

import React from 'react';
import Link from 'next/link';
import { LuFolderX, LuArrowLeft, LuPlus } from 'react-icons/lu';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  projectId?: string;
  onCreateClick?: () => void;
}

export function ProjectNotFoundScreen({ projectId, onCreateClick }: Props) {
  const { tokens } = useTheme();

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-6 bg-zinc-950/95 backdrop-blur-md select-none">
      <div
        className="w-full max-w-lg rounded-2xl border p-6 md:p-8 shadow-2xl flex flex-col items-center text-center space-y-5"
        style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <LuFolderX className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-bold tracking-tight" style={{ color: tokens.textPrimary }}>
            Project Not Found
          </h2>
          <p className="text-xs leading-relaxed max-w-md" style={{ color: tokens.textSecondary }}>
            The requested architecture project could not be found or has been removed from persistent storage.
          </p>
        </div>

        {projectId && (
          <div className="px-3 py-1.5 rounded-lg border font-mono text-xs text-zinc-400 bg-zinc-900/60 border-zinc-800">
            Project ID: <span className="text-sky-400">{projectId}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          <Link
            href="/projects"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <LuArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Projects</span>
          </Link>
          {onCreateClick && (
            <button
              type="button"
              onClick={onCreateClick}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border text-xs font-medium transition-colors hover:bg-zinc-800/50 cursor-pointer"
              style={{ borderColor: tokens.border, color: tokens.textPrimary }}
            >
              <LuPlus className="w-3.5 h-3.5" />
              <span>Create New Project</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
