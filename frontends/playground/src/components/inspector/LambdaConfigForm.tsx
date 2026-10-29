'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { Ec2EnvSection } from './Ec2EnvSection';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function LambdaConfigForm({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const { edges, nodes, selectedNodeId } = usePlaygroundStore();
  const envEdges = edges.filter((e) => e.source === selectedNodeId && e.data?.envVarName);
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <div className="space-y-3.5">
      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Function Name</label>
        <input
          type="text"
          value={config.functionName || ''}
          onChange={(e) => onChange('functionName', e.target.value)}
          placeholder="order-processor-fn"
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Execution Runtime</label>
        <select
          value={config.runtime || 'nodejs20.x'}
          onChange={(e) => onChange('runtime', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="nodejs20.x">Node.js 20.x (LTS)</option>
          <option value="nodejs18.x">Node.js 18.x</option>
          <option value="python3.11">Python 3.11</option>
          <option value="python3.12">Python 3.12</option>
          <option value="provided.al2023">Custom Runtime (AL2023)</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Memory Allocated</label>
        <select
          value={config.memorySize ?? 128}
          onChange={(e) => onChange('memorySize', Number(e.target.value))}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        >
          <option value={128}>128 MB</option>
          <option value={256}>256 MB</option>
          <option value={512}>512 MB (Optimal)</option>
          <option value={1024}>1024 MB (1 GB)</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Execution Timeout</label>
        <select
          value={config.timeout ?? 15}
          onChange={(e) => onChange('timeout', Number(e.target.value))}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        >
          <option value={3}>3 Seconds</option>
          <option value={15}>15 Seconds</option>
          <option value={30}>30 Seconds</option>
          <option value={60}>60 Seconds</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Handler Entrypoint</label>
        <input
          type="text"
          value={config.handler || 'index.handler'}
          onChange={(e) => onChange('handler', e.target.value)}
          placeholder="index.handler"
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        />
      </div>

      <Ec2EnvSection envEdges={envEdges} nodes={nodes} />
    </div>
  );
}
