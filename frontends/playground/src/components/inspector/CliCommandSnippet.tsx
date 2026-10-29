'use client';

import React, { useState } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { LuCopy, LuCheck, LuTerminal } from 'react-icons/lu';
import { toast } from 'sonner';

interface Props {
  label: string;
  command: string;
  description?: string;
}

export function CliCommandSnippet({ label, command, description }: Props) {
  const { tokens } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-2.5 rounded-lg border space-y-1.5" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold flex items-center gap-1.5" style={{ color: tokens.textPrimary }}>
          <LuTerminal className="w-3.5 h-3.5 text-sky-400" />
          <span>{label}</span>
        </span>
        <button
          type="button"
          onClick={handleCopy}
          title="Copy command"
          style={{ color: tokens.textMuted }}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] hover:opacity-85 cursor-pointer font-mono border"
        >
          {copied ? <LuCheck className="w-3 h-3 text-emerald-400" /> : <LuCopy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      {description && <p className="text-[10px]" style={{ color: tokens.textMuted }}>{description}</p>}
      <pre
        onClick={handleCopy}
        title="Click to copy"
        className="p-2 rounded font-mono text-[10.5px] leading-relaxed break-all select-all cursor-pointer border overflow-x-auto whitespace-pre-wrap"
        style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textSecondary, userSelect: 'text' }}
      >
        {command}
      </pre>
    </div>
  );
}
