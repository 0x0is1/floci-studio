'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { Ec2EnvSection } from './Ec2EnvSection';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function EcsConfigForm({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const { edges, nodes, selectedNodeId } = usePlaygroundStore();
  const envEdges = edges.filter((e) => (e.source === selectedNodeId || e.target === selectedNodeId) && e.data?.envVarName);
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  return (
    <div className="space-y-3.5">
      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Cluster Name</label>
        <input
          type="text"
          value={config.clusterName || 'prod-cluster'}
          onChange={(e) => onChange('clusterName', e.target.value)}
          placeholder="prod-cluster"
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Launch Type</label>
        <select
          value={config.launchType || 'FARGATE'}
          onChange={(e) => onChange('launchType', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="FARGATE">AWS Fargate (Serverless Containers - Recommended)</option>
          <option value="EC2">EC2 Compute Instances</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Container Image</label>
        <input
          type="text"
          value={config.image || 'nginx:alpine'}
          onChange={(e) => onChange('image', e.target.value)}
          placeholder="nginx:alpine or node:20-alpine"
          style={inputStyle}
          className="w-full rounded border px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>CPU (Units)</label>
          <select
            value={config.cpu || 256}
            onChange={(e) => onChange('cpu', Number(e.target.value))}
            style={inputStyle}
            className="w-full rounded border px-2.5 py-1.5 text-xs font-mono focus:outline-none"
          >
            <option value={256}>0.25 vCPU (256)</option>
            <option value={512}>0.5 vCPU (512)</option>
            <option value={1024}>1 vCPU (1024)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-medium" style={{ color: tokens.textMuted }}>Memory (MB)</label>
          <select
            value={config.memory || 512}
            onChange={(e) => onChange('memory', Number(e.target.value))}
            style={inputStyle}
            className="w-full rounded border px-2.5 py-1.5 text-xs font-mono focus:outline-none"
          >
            <option value={512}>512 MB</option>
            <option value={1024}>1024 MB (1 GB)</option>
            <option value={2048}>2048 MB (2 GB)</option>
          </select>
        </div>
      </div>

      <Ec2EnvSection envEdges={envEdges} nodes={nodes} nodeId={selectedNodeId ?? undefined} />
    </div>
  );
}