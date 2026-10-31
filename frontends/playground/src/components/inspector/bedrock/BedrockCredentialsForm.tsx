'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { LuKey, LuGlobe } from 'react-icons/lu';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function BedrockCredentialsForm({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const inputStyle = { backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <div className="space-y-2.5 pt-1 border-t" style={{ borderColor: tokens.border }}>
      <div className="space-y-1">
        <label className="text-[10px] uppercase font-mono tracking-wider flex items-center gap-1" style={{ color: tokens.textMuted }}>
          <LuKey className="w-3 h-3 text-amber-400" />
          <span>API Key / Secret Token</span>
        </label>
        <input
          type="password"
          value={config.apiKey || ''}
          onChange={(e) => onChange('apiKey', e.target.value)}
          placeholder="sk-... or AWS Bedrock token"
          style={inputStyle}
          className="w-full rounded border px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-sky-500"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] uppercase font-mono tracking-wider flex items-center gap-1" style={{ color: tokens.textMuted }}>
          <LuGlobe className="w-3 h-3 text-sky-400" />
          <span>Endpoint URL (Optional)</span>
        </label>
        <input
          type="text"
          value={config.endpointUrl || ''}
          onChange={(e) => onChange('endpointUrl', e.target.value)}
          placeholder="https://api.openai.com/v1 or custom proxy"
          style={inputStyle}
          className="w-full rounded border px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-sky-500"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] uppercase font-mono tracking-wider" style={{ color: tokens.textMuted }}>
          System Instructions / Prompt
        </label>
        <textarea
          rows={2}
          value={config.systemPrompt || ''}
          onChange={(e) => onChange('systemPrompt', e.target.value)}
          placeholder="You are an autonomous AI microservice in Floci..."
          style={inputStyle}
          className="w-full rounded border px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-sky-500 resize-none"
        />
      </div>
    </div>
  );
}

