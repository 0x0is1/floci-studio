'use client';

import React from 'react';
import { AwsNodeData } from '@/types/aws';
import { AwsIcon } from '@/components/icons/AwsIcons';
import { useTheme } from '@/theme/ThemeProvider';
import { LuLock, LuCheck, LuCircleSlash } from 'react-icons/lu';
import { LiveServiceSpecs } from './LiveServiceSpecs';
import { NodeIamSection } from './NodeIamSection';

interface Props {
  nodeData: AwsNodeData;
  nodeId?: string;
  node?: any;
}

export function LiveComponentTelemetry({ nodeData, nodeId, node }: Props) {
  const isRunning = nodeData.status === 'running';
  const { tokens } = useTheme();

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: tokens.border }}>
        <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: tokens.textMuted }}>Runtime Status</span>
        <span
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
            isRunning ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : ''
          }`}
          style={!isRunning ? { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textMuted } : undefined}
        >
          {isRunning ? <LuCheck className="w-3 h-3" /> : <LuCircleSlash className="w-3 h-3" />}
          {isRunning ? 'RUNNING' : 'STANDBY'}
        </span>
      </div>

      {!isRunning ? (
        <div
          className="p-3 rounded-lg border text-xs space-y-1"
          style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}
        >
          <p className="font-semibold" style={{ color: tokens.textPrimary }}>Resource Offline (Not Deployed)</p>
          <p className="text-[11px]" style={{ color: tokens.textMuted }}>Deploy architecture to spin up container on Floci and allocate live localhost ports.</p>
        </div>
      ) : (
        <div
          className="p-3 rounded-lg border text-xs space-y-1 font-mono"
          style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.statusRunning }}
        >
          <div className="flex items-center gap-1.5 font-semibold" style={{ color: tokens.statusRunning }}>
            <LuCheck className="w-3.5 h-3.5" />
            <span>Active on Floci Cloud Emulator</span>
          </div>
          {nodeData.config?.port && (
            <p className="text-[11px]" style={{ color: tokens.textSecondary }}>Allocated Port: :{nodeData.config.port}</p>
          )}
        </div>
      )}

      <LiveServiceSpecs nodeData={nodeData} nodeId={nodeId} />

      {node && (
        <NodeIamSection node={node} config={nodeData.config || {}} isReadOnly={true} />
      )}

      <div
        className="p-3 rounded-lg border flex items-start gap-2.5 text-xs"
        style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}
      >
        <LuLock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed" style={{ color: tokens.textMuted }}>
          Configuration is strictly read-only in Deployed Infrastructure mode. Switch to Architecture Editor to modify parameters.
        </p>
      </div>
    </div>
  );
}
