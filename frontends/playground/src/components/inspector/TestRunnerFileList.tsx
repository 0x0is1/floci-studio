'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { LuFile, LuTrash2 } from 'react-icons/lu';

interface Props {
  files: Array<{ name: string; size: number }>;
  onDelete: (name: string) => void;
}

export function TestRunnerFileList({ files, onDelete }: Props) {
  const { tokens } = useTheme();
  if (files.length === 0) {
    return <p className="text-[11px]" style={{ color: tokens.textMuted }}>No test files uploaded yet.</p>;
  }

  return (
    <div className="space-y-1.5">
      {files.map((f) => (
        <div key={f.name} className="flex items-center justify-between p-1.5 rounded border font-mono text-[11px]" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}>
          <span className="flex items-center gap-1.5 truncate" style={{ color: tokens.textSecondary }}>
            <LuFile className="w-3 h-3 shrink-0" />
            {f.name} <span style={{ color: tokens.textMuted }}>({f.size}B)</span>
          </span>
          <button type="button" onClick={() => onDelete(f.name)} style={{ color: tokens.textMuted }} className="hover:opacity-85 p-0.5 cursor-pointer shrink-0" title="Delete file">
            <LuTrash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
