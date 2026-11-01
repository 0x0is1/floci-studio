'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { LuTerminal, LuTrash2 } from 'react-icons/lu';

interface Props {
  port: number;
  setPort: (p: number) => void;
  execNodes: any[];
  isRunning: boolean;
  onClear: () => void;
}

export function Ec2TerminalHeader({ port, setPort, execNodes, isRunning, onClear }: Props) {
  const { tokens } = useTheme();

  return (
    <div className="flex items-center justify-between border-b px-3 py-1.5 text-[11px] transition-colors" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 text-sky-400 font-semibold">
          <LuTerminal className="w-3.5 h-3.5" />
          <span>Target:</span>
        </span>
        <select
          value={port}
          onChange={(e) => setPort(Number(e.target.value))}
          style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textPrimary }}
          className="rounded border px-2 py-0.5 text-xs focus:outline-none"
        >
          {execNodes.map((n) => (
            <option key={n.id} value={n.data.config?.port || 8080}>
              {n.data.label} (:{n.data.config?.port || 8080})
            </option>
          ))}
          {execNodes.length === 0 && <option value={8080}>localhost:8080</option>}
        </select>

        <span
          className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase ${
            isRunning ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' : 'border'
          }`}
          style={!isRunning ? { backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textMuted } : undefined}
        >
          {isRunning ? 'RUNNING' : 'STANDBY'}
        </span>

        <span className="px-2 py-0.5 rounded border text-[10px] font-mono" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textMuted }}>
          Container Shell
        </span>
      </div>

      <button onClick={onClear} style={{ color: tokens.textMuted }} className="hover:opacity-85 p-1 cursor-pointer" title="Clear">
        <LuTrash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
