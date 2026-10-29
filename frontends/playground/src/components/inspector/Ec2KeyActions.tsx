'use client';

import React from 'react';
import { useBottomTrayStore } from '@/store/bottomTrayStore';
import { useTheme } from '@/theme/ThemeProvider';
import { getKeyDownloadUrl } from '@/lib/api/flociClient';
import { LuDownload, LuTerminal } from 'react-icons/lu';

export function Ec2KeyActions({ projectId, selectedKey }: { projectId: string; selectedKey: string }) {
  const { setActiveTab } = useBottomTrayStore();
  const { tokens } = useTheme();

  return (
    <div className="flex items-center gap-2 pt-1">
      <a
        href={getKeyDownloadUrl(projectId, selectedKey)}
        target="_blank"
        rel="noreferrer"
        download={`${selectedKey}.pem`}
        style={{ backgroundColor: tokens.btnBg, borderColor: tokens.border, color: tokens.textSecondary }}
        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1 rounded border hover:opacity-85 text-[11px] transition-colors"
      >
        <LuDownload className="w-3 h-3" />
        <span>Download .pem</span>
      </a>

      <button
        type="button"
        onClick={() => setActiveTab('ec2-terminal')}
        style={{ borderColor: tokens.border }}
        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1 rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border text-[11px] font-medium transition-colors cursor-pointer"
      >
        <LuTerminal className="w-3 h-3" />
        <span>Open Shell</span>
      </button>
    </div>
  );
}
