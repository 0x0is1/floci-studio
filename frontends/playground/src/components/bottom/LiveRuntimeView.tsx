'use client';

import React from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { LuExternalLink, LuCircleCheck, LuActivity } from 'react-icons/lu';
import { AwsIcon } from '@/components/icons/AwsIcons';

export function LiveRuntimeView() {
  const { nodes, edges } = usePlaygroundStore();
  const { tokens } = useTheme();
  const runningNodes = nodes.filter((n) => n.data.status === 'running' || n.data.liveUrl);

  const getConnectionInfo = (nodeId: string, serviceType: string) => {
    if (['cloudfront', 'alb'].includes(serviceType)) {
      const e = edges.find((ed) => ed.source === nodeId);
      const target = e ? nodes.find((tn) => tn.id === e.target) : null;
      return target ? `Origin Target: ${target.data.label} (${target.data.serviceType.toUpperCase()})` : '';
    }
    if (['s3', 'sqs', 'rds', 'dynamodb'].includes(serviceType)) {
      const incoming = edges.filter((ed) => ed.target === nodeId).map((ed) => nodes.find((tn) => tn.id === ed.source)).filter(Boolean);
      return incoming.length > 0 ? `Connected Source: ${incoming.map((s) => s?.data.label).join(', ')}` : '';
    }
    if (['ec2', 'lambda'].includes(serviceType)) {
      const outgoing = edges.filter((ed) => ed.source === nodeId).map((ed) => nodes.find((tn) => tn.id === ed.target)).filter(Boolean);
      return outgoing.length > 0 ? `Targets: ${outgoing.map((s) => s?.data.label).join(', ')}` : '';
    }
    return '';
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 text-xs transition-colors" style={{ backgroundColor: tokens.trayBg }}>
      {runningNodes.length === 0 ? (
        <div className="p-8 text-center font-mono text-xs border border-dashed rounded-lg" style={{ borderColor: tokens.border, color: tokens.textMuted }}>
          <LuActivity className="w-5 h-5 mx-auto mb-2" style={{ color: tokens.textMuted }} />
          <p className="font-semibold" style={{ color: tokens.textSecondary }}>No deployment found. Deploy to see output.</p>
          <p className="text-[11px] mt-1" style={{ color: tokens.textMuted }}>Launch real infrastructure against Floci to view live endpoints.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {runningNodes.map((n) => {
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

                {connInfo && (
                  <p className="text-[10px] font-mono text-sky-400 truncate">{connInfo}</p>
                )}

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
      )}
    </div>
  );
}
