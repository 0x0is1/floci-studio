'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

const DEFAULT_ASL = `{
  "StartAt": "InvokeTask",
  "States": {
    "InvokeTask": { "Type": "Pass", "End": true }
  }
}`;

export function StepFunctionsConfigForm({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <div className="space-y-3.5">
      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>State Machine Name</label>
        <input
          type="text"
          value={config.stateMachineName || ''}
          onChange={(e) => onChange('stateMachineName', e.target.value)}
          placeholder="order-workflow"
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Workflow Type</label>
        <select
          value={config.type || 'STANDARD'}
          onChange={(e) => onChange('type', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="STANDARD">Standard (Durable, Long-Running)</option>
          <option value="EXPRESS">Express (High-Volume, Short-Lived)</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Amazon States Language Definition</label>
        <textarea
          value={config.definition || DEFAULT_ASL}
          onChange={(e) => onChange('definition', e.target.value)}
          rows={6}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-[11px] font-mono focus:outline-none focus:border-sky-500 resize-y"
        />
      </div>
    </div>
  );
}
