'use client';

import React, { useState } from 'react';
import { TerminalLog } from '@/types/aws';
import { useTheme } from '@/theme/ThemeProvider';
import { LuChevronRight, LuChevronDown } from 'react-icons/lu';

export function TerminalLogItem({ log }: { log: TerminalLog }) {
  const [expanded, setExpanded] = useState(false);
  const { tokens } = useTheme();
  const isStdin = log.type === 'stdin';
  const isError = log.type === 'error';
  const isSuccess = log.type === 'success';

  return (
    <div className="font-mono text-[11px] leading-relaxed border-b py-1 px-3 hover:opacity-90" style={{ borderColor: tokens.borderSubtle }}>
      <div className="flex items-start gap-2">
        <span className="select-none text-[10px] pt-0.5" style={{ color: tokens.textMuted }}>{log.timestamp}</span>
        <span
          className={`px-1.5 py-0.2 rounded text-[9px] font-semibold uppercase tracking-wider ${
            isStdin
              ? 'bg-sky-950 text-sky-400 border border-sky-800/60'
              : isError
              ? 'bg-red-950 text-red-400 border border-red-800/60'
              : isSuccess
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
              : 'border'
          }`}
          style={!isStdin && !isError && !isSuccess ? { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textSecondary } : undefined}
        >
          {log.type}
        </span>
        <span className="text-[10px] uppercase font-bold" style={{ color: tokens.textMuted }}>[{log.serviceType}]</span>
        <span
          className={`flex-1 break-all ${isStdin ? 'font-semibold text-sky-400' : isError ? 'text-red-400' : ''}`}
          style={!isStdin && !isError ? { color: tokens.textPrimary } : undefined}
        >
          {log.message}
        </span>
        {log.rawOutput && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ color: tokens.textMuted }}
            className="hover:opacity-85 p-0.5 cursor-pointer"
            title="Toggle raw output"
          >
            {expanded ? <LuChevronDown className="w-3.5 h-3.5" /> : <LuChevronRight className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {expanded && log.rawOutput && (
        <pre
          className="mt-1.5 p-2 rounded border text-[10px] overflow-x-auto whitespace-pre-wrap font-mono"
          style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textSecondary }}
        >
          {log.rawOutput}
        </pre>
      )}
    </div>
  );
}
