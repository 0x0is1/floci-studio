'use client';

import React from 'react';
import { LuSend } from 'react-icons/lu';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  input: string;
  setInput: (v: string) => void;
  isInstanceRunning: boolean;
  onRun: () => void;
}

export function Ec2TerminalInput({ input, setInput, isInstanceRunning, onRun }: Props) {
  const { tokens } = useTheme();

  return (
    <div className="border-t p-2 flex items-center gap-2" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
      <span className="text-emerald-400 text-xs pl-1">container@floci:~$ </span>
      <input
        type="text"
        value={input}
        disabled={!isInstanceRunning}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onRun()}
        placeholder={isInstanceRunning ? 'Run remote command in container...' : 'Deploy instance to enable terminal shell...'}
        style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textPrimary }}
        className="flex-1 rounded border px-2.5 py-1 text-xs focus:outline-none focus:border-sky-500 disabled:opacity-40"
      />
      <button
        type="button"
        onClick={onRun}
        disabled={!isInstanceRunning || !input.trim()}
        style={{ backgroundColor: tokens.btnBg, borderColor: tokens.border, color: tokens.textPrimary }}
        className="p-1.5 rounded border disabled:opacity-30 hover:opacity-85 cursor-pointer"
      >
        <LuSend className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

