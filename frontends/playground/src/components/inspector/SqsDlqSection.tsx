'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function SqsDlqSection({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <>
      <div className="flex items-center justify-between p-2.5 rounded border" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Dead-Letter Queue Redrive</label>
        <input
          type="checkbox"
          checked={config.dlqEnabled ?? false}
          onChange={(e) => onChange('dlqEnabled', e.target.checked)}
          className="w-4 h-4 cursor-pointer accent-sky-500"
        />
      </div>

      {config.dlqEnabled && (
        <div className="space-y-1">
          <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Max Receive Count Before DLQ</label>
          <input
            type="number"
            min={1}
            value={config.maxReceiveCount ?? 3}
            onChange={(e) => onChange('maxReceiveCount', Number(e.target.value))}
            style={inputStyle}
            className="w-full rounded border px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-sky-500"
          />
        </div>
      )}
    </>
  );
}
