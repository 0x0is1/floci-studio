'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { LuCheck, LuX } from 'react-icons/lu';

interface Result {
  success: boolean;
  ran: string[];
  output: string;
  exitCode: number;
}

export function TestRunnerResultPanel({ result }: { result: Result | null }) {
  const { tokens } = useTheme();
  if (!result) return null;

  return (
    <div className="p-3 rounded-lg border space-y-2 text-xs" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
      <div className="flex items-center gap-1.5 font-semibold" style={{ color: result.success ? '#34d399' : '#f87171' }}>
        {result.success ? <LuCheck className="w-3.5 h-3.5" /> : <LuX className="w-3.5 h-3.5" />}
        <span>{result.success ? 'Passed' : 'Failed'}</span>
        {result.ran.length > 0 && <span style={{ color: tokens.textMuted }}>({result.ran.join(', ')})</span>}
      </div>
      <pre className="p-2 rounded border whitespace-pre-wrap text-[11px] max-h-48 overflow-y-auto" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textSecondary }}>
        {result.output || '(no output)'}
      </pre>
    </div>
  );
}
