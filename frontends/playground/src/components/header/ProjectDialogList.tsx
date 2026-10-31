'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { LuFolder, LuLoaderCircle, LuTrash2 } from 'react-icons/lu';

interface Props {
  projects: Array<{ id: string; name: string; updatedAt: string }>;
  activeProjectId: string | null;
  isLoading: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}

export function ProjectDialogList({ projects, activeProjectId, isLoading, onSelect, onDelete }: Props) {
  const { tokens } = useTheme();

  if (isLoading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 p-6 text-xs" style={{ color: tokens.textMuted }}>
        <LuLoaderCircle className="w-4 h-4 animate-spin text-sky-400" />
        <span>Loading projects...</span>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-4 text-center text-xs" style={{ color: tokens.textMuted }}>
        No projects found. Create one above to get started.
      </div>
    );
  }

  return (
    <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
      {projects.map((p) => {
        const isActive = p.id === activeProjectId;
        return (
          <div
            key={p.id}
            onClick={() => onSelect(p.id)}
            style={{
              backgroundColor: isActive ? tokens.cardBgAlt : tokens.btnBg,
              borderColor: isActive ? tokens.accent : tokens.border,
              color: tokens.textPrimary,
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer hover:opacity-90 group"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
              <LuFolder className="w-3.5 h-3.5 shrink-0" style={{ color: isActive ? tokens.accent : tokens.textMuted }} />
              <span className="font-medium truncate">{p.name}</span>
              {isActive && (
                <span className="shrink-0 text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  Active
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-mono" style={{ color: tokens.textMuted }}>
                {new Date(p.updatedAt).toLocaleDateString()}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(p.id, p.name);
                }}
                className="p-1 rounded hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                title={`Delete ${p.name}`}
              >
                <LuTrash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
