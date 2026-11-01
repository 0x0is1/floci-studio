'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { LuExternalLink, LuCircleCheck } from 'react-icons/lu';
import { AwsIcon } from '@/components/icons/AwsIcons';

interface Props {
  nodes: any[];
  getConnectionInfo: (nodeId: string, serviceType: string) => string;
}

export function LiveReadyGrid({ nodes, getConnectionInfo }: Props) {
  const { tokens } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {nodes.map((n) => {
        const connInfo = getConnectionInfo(n.id, n.data.serviceType);
        return (
          <div key={n.id} className="p-3 rounded-lg border space-y-2 transition-colors" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AwsIcon type={n.data.serviceType} size={16} />
                <span className="font-semibold" style={{ color: tokens.textPrimary }}>{n.data.label}</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <LuCircleCheck className="w-3 h-3" /> READY
              </span>
            </div>

            {connInfo && <p className="text-[10px] font-mono text-sky-400 truncate">{connInfo}</p>}

            {n.data.resourceId && (
              <p className="text-[10px] font-mono truncate" style={{ color: tokens.textMuted }}>ID: {n.data.resourceId}</p>
            )}

            {n.data.liveUrl && (
              <div className="pt-1 border-t flex items-center justify-between" style={{ borderColor: tokens.border }}>
                <a
                  href={n.data.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ borderColor: tokens.border }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border text-[11px] font-medium transition-colors"
                >
                  <span>Open Web Service</span>
                  <LuExternalLink className="w-3 h-3" />
                </a>
                <span className="text-[10px] font-mono" style={{ color: tokens.textMuted }}>{n.data.liveUrl}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
