'use client';

import React from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useDeployProgressStore, DeployNodeStatus } from '@/store/deployProgressStore';
import { useTheme } from '@/theme/ThemeProvider';
import { AwsIcon } from '@/components/icons/AwsIcons';

const STATUS_COLOR: Record<DeployNodeStatus, string> = {
  deploying: '#38bdf8',
  running: '#34d399',
  error: '#f87171',
  skipped: '#9ca3af',
};

const STATUS_LABEL: Record<DeployNodeStatus, string> = {
  deploying: 'DEPLOYING',
  running: 'RUNNING',
  error: 'FAILED',
  skipped: 'SKIPPED',
};

export function LiveDeployProgress() {
  const { nodes } = usePlaygroundStore();
  const { progress } = useDeployProgressStore();
  const { tokens } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {nodes.map((n) => {
        const p = progress[n.id];
        if (!p) return null;
        const color = STATUS_COLOR[p.status];
        return (
          <div key={n.id} className="p-3 rounded-lg border space-y-2" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AwsIcon type={n.data.serviceType} size={16} />
                <span className="font-semibold" style={{ color: tokens.textPrimary }}>{n.data.label}</span>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-mono font-semibold" style={{ color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                {STATUS_LABEL[p.status]}
              </span>
            </div>
            {p.error && <p className="text-[11px] font-mono" style={{ color: '#f87171' }}>{p.error}</p>}
          </div>
        );
      })}
    </div>
  );
}
