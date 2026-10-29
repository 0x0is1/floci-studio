'use client';

import React, { useRef, useEffect } from 'react';
import { useBottomTrayStore } from '@/store/bottomTrayStore';
import { useTheme } from '@/theme/ThemeProvider';
import { TerminalLogItem } from './TerminalLogItem';
import { LuTrash2 } from 'react-icons/lu';

export function TerminalView() {
  const { logs, filter, setFilter, clearLogs } = useBottomTrayStore();
  const { tokens } = useTheme();
  const bottomRef = useRef<HTMLDivElement>(null);

  const filteredLogs = logs.filter((log) => {
    if (filter === 'commands') return log.type === 'stdin';
    if (filter === 'errors') return log.type === 'error';
    if (filter === 'docker') return log.source === 'docker';
    return true;
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  return (
    <div className="flex flex-col h-full font-mono text-xs transition-colors" style={{ backgroundColor: tokens.trayBg }}>
      <div className="flex items-center justify-between border-b px-3 py-1.5" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
        <div className="flex items-center gap-1.5 text-[11px]">
          {(['all', 'commands', 'errors', 'docker'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              style={{
                backgroundColor: filter === mode ? tokens.btnHover : 'transparent',
                color: filter === mode ? tokens.accent : tokens.textMuted,
              }}
              className="px-2 py-0.5 rounded capitalize transition-colors font-medium cursor-pointer"
            >
              {mode}
            </button>
          ))}
        </div>
        <button
          onClick={clearLogs}
          style={{ color: tokens.textMuted }}
          className="flex items-center gap-1 text-[11px] hover:opacity-85 transition-colors cursor-pointer"
          title="Clear console"
        >
          <LuTrash2 className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs" style={{ color: tokens.textMuted }}>
            <p className="font-semibold" style={{ color: tokens.textSecondary }}>No deployment found. Deploy to see output.</p>
            <p className="text-[11px] mt-1" style={{ color: tokens.textMuted }}>Execute architecture DAG deployment to view live container logs and execution traces.</p>
          </div>
        ) : (
          filteredLogs.map((log) => <TerminalLogItem key={log.id} log={log} />)
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
