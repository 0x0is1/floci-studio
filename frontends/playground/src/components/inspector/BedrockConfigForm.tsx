'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { LuSlidersHorizontal, LuBrainCircuit } from 'react-icons/lu';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

const BEDROCK_MODELS = [
  { id: 'anthropic.claude-3-sonnet-20240229-v1:0', label: 'Anthropic Claude 3 Sonnet' },
  { id: 'anthropic.claude-3-haiku-20240307-v1:0', label: 'Anthropic Claude 3 Haiku' },
  { id: 'amazon.titan-text-express-v1', label: 'Amazon Titan Text Express' },
  { id: 'amazon.titan-text-lite-v1', label: 'Amazon Titan Text Lite' },
  { id: 'amazon.titan-embed-text-v1', label: 'Amazon Titan Embeddings' },
  { id: 'meta.llama3-8b-instruct-v1:0', label: 'Meta Llama 3 8B Instruct' },
  { id: 'mistral.mixtral-8x7b-instruct-v0:1', label: 'Mistral Mixtral 8x7B' },
];

export function BedrockConfigForm({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const currentModel = config.modelId || 'anthropic.claude-3-sonnet-20240229-v1:0';
  const temperature = config.temperature ?? 0.7;
  const maxTokens = config.maxTokens ?? 2048;

  const inputStyle = { backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <div className="rounded-lg border p-3 space-y-3" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
      <div className="flex items-center gap-1.5 font-semibold text-[11px]" style={{ color: tokens.textPrimary }}>
        <LuBrainCircuit className="w-3.5 h-3.5 text-purple-400" />
        <span className="uppercase font-mono">Bedrock Model Configuration</span>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] uppercase font-mono tracking-wider" style={{ color: tokens.textMuted }}>Foundation Model</label>
        <select
          value={currentModel}
          onChange={(e) => onChange('modelId', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-sky-500 cursor-pointer"
        >
          {BEDROCK_MODELS.map((m) => (
            <option key={m.id} value={m.id}>{m.label} ({m.id})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-mono tracking-wider" style={{ color: tokens.textMuted }}>
            Temperature ({temperature})
          </label>
          <input
            type="number"
            min={0}
            max={1}
            step={0.1}
            value={temperature}
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

      <div className="space-y-1">
        <label className="text-[10px] uppercase font-mono tracking-wider" style={{ color: tokens.textMuted }}>Guardrails &amp; Safety</label>
        <select
          value={config.guardrails || 'default'}
          onChange={(e) => onChange('guardrails', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2 py-1 text-xs font-mono focus:outline-none focus:border-sky-500 cursor-pointer"
        >
          <option value="default">Standard Content Safety (AWS Default)</option>
          <option value="strict">Strict PII Masking &amp; Toxicity Filter</option>
          <option value="disabled">Disabled (Raw Model Output)</option>
        </select>
      </div>
    </div>
  );
}
