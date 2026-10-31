'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  modelId: string;
  temperature: number;
  maxTokens: number;
  onChange: (key: string, val: any) => void;
}

const BEDROCK_MODELS = [
  { id: 'anthropic.claude-3-sonnet-20240229-v1:0', label: 'Anthropic Claude 3 Sonnet' },
  { id: 'anthropic.claude-3-haiku-20240307-v1:0', label: 'Anthropic Claude 3 Haiku' },
  { id: 'amazon.titan-text-express-v1', label: 'Amazon Titan Text Express' },
  { id: 'amazon.titan-text-lite-v1', label: 'Amazon Titan Text Lite' },
  { id: 'meta.llama3-8b-instruct-v1:0', label: 'Meta Llama 3 8B' },
  { id: 'gpt-4o', label: 'OpenAI GPT-4o' },
  { id: 'gpt-4o-mini', label: 'OpenAI GPT-4o Mini' },
  { id: 'custom', label: 'Custom Model ID' },
];

export function BedrockModelSelect({ modelId, temperature, maxTokens, onChange }: Props) {
  const { tokens } = useTheme();
  const inputStyle = { backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <div className="space-y-2.5">
      <div className="space-y-1">
        <label className="text-[10px] uppercase font-mono tracking-wider" style={{ color: tokens.textMuted }}>Foundation Model</label>
        <select
          value={BEDROCK_MODELS.some((m) => m.id === modelId) ? modelId : 'custom'}
          onChange={(e) => {
            if (e.target.value !== 'custom') onChange('modelId', e.target.value);
          }}
          style={inputStyle}
          className="w-full rounded border px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-sky-500 cursor-pointer"
        >
          {BEDROCK_MODELS.map((m) => (
            <option key={m.id} value={m.id}>{m.label}</option>
          ))}
        </select>
        {(!BEDROCK_MODELS.some((m) => m.id === modelId) || modelId === 'custom') && (
          <input
            type="text"
            value={modelId === 'custom' ? '' : modelId}
            onChange={(e) => onChange('modelId', e.target.value)}
            placeholder="e.g. meta-llama/Llama-3-70b-chat-hf"
            style={inputStyle}
            className="w-full mt-1 rounded border px-2 py-1 text-xs font-mono focus:outline-none focus:border-sky-500"
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-mono tracking-wider" style={{ color: tokens.textMuted }}>
            Temp ({temperature})
          </label>
          <input
            type="number" min={0} max={1} step={0.1} value={temperature}
            onChange={(e) => onChange('temperature', parseFloat(e.target.value) || 0)}
            style={inputStyle}
            className="w-full rounded border px-2 py-1 text-xs font-mono focus:outline-none focus:border-sky-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-mono tracking-wider" style={{ color: tokens.textMuted }}>Max Tokens</label>
          <select
            value={maxTokens}
            onChange={(e) => onChange('maxTokens', parseInt(e.target.value, 10))}
            style={inputStyle}
            className="w-full rounded border px-2 py-1 text-xs font-mono focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value={512}>512 tokens</option>
            <option value={1024}>1024 tokens</option>
            <option value={2048}>2048 tokens</option>
            <option value={4096}>4096 tokens</option>
          </select>
        </div>
      </div>
    </div>
  );
}

