'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function KmsConfigForm({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <div className="space-y-3.5">
      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Key Alias</label>
        <input
          type="text"
          value={config.keyAlias || ''}
          onChange={(e) => onChange('keyAlias', e.target.value)}
          placeholder="alias/app-key"
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Key Spec</label>
        <select
          value={config.keySpec || 'SYMMETRIC_DEFAULT'}
          onChange={(e) => onChange('keySpec', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        >
          <option value="SYMMETRIC_DEFAULT">SYMMETRIC_DEFAULT (AES-256-GCM)</option>
          <option value="RSA_2048">RSA_2048</option>
          <option value="ECC_NIST_P256">ECC_NIST_P256</option>
        </select>
      </div>

      <div className="flex items-center justify-between p-2.5 rounded border" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Automatic Key Rotation</label>
        <input
          type="checkbox"
          checked={config.keyRotation ?? true}
          onChange={(e) => onChange('keyRotation', e.target.checked)}
          className="w-4 h-4 cursor-pointer accent-sky-500"
        />
      </div>
    </div>
  );
}
