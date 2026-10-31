'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { LuBrainCircuit } from 'react-icons/lu';
import { BedrockModelSelect } from './bedrock/BedrockModelSelect';
import { BedrockCredentialsForm } from './bedrock/BedrockCredentialsForm';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function BedrockConfigForm({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const currentModel = config.modelId || 'anthropic.claude-3-sonnet-20240229-v1:0';
  const temperature = config.temperature ?? 0.7;
  const maxTokens = config.maxTokens ?? 2048;

  return (
    <div className="rounded-lg border p-3 space-y-3" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
      <div className="flex items-center gap-1.5 font-semibold text-[11px]" style={{ color: tokens.textPrimary }}>
        <LuBrainCircuit className="w-3.5 h-3.5 text-purple-400" />
        <span className="uppercase font-mono">Bedrock &amp; LLM Configuration</span>
      </div>

      <BedrockModelSelect
        modelId={currentModel}
        temperature={temperature}
        maxTokens={maxTokens}
        onChange={onChange}
      />

      <BedrockCredentialsForm
        config={config}
        onChange={onChange}
      />
    </div>
  );
}
