'use client';

import React from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { LuExternalLink, LuCircleDot } from 'react-icons/lu';

export function LiveCloudFrontSpecs({ nodeId }: { nodeId?: string }) {
  const { tokens } = useTheme();
  const { nodes, edges, selectedNodeId } = usePlaygroundStore();
  const activeId = nodeId || selectedNodeId;

  const cfEdge = edges.find((e) => e.source === activeId || e.target === activeId);
  const targetId = cfEdge ? (cfEdge.source === activeId ? cfEdge.target : cfEdge.source) : null;
  const originNode = targetId ? nodes.find((n) => n.id === targetId) : null;
  const isS3 = originNode?.data.serviceType === 's3';
  const originPort = originNode?.data.config?.port || 8080;
  const cfUrl = isS3
    ? `http://localhost:4566/${originNode?.data.config?.bucketName || 'assets'}`
    : `http://localhost:${originPort}`;
  const isOriginRunning = originNode?.data.status === 'running';

  return (
    <div className="space-y-3 text-xs">
      <div className="p-3 rounded-lg border space-y-2" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Connected Origin</span>
          <span className="font-mono font-medium truncate max-w-[150px] flex items-center gap-1.5" style={{ color: originNode ? tokens.textPrimary : tokens.statusError }}>
            {originNode && <LuCircleDot className={`w-3 h-3 ${isOriginRunning ? 'text-emerald-400' : 'text-slate-400'}`} />}
            {originNode ? `${originNode.data.label} (${originNode.data.serviceType.toUpperCase()})` : 'Not Connected'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Origin Status</span>
          <span className="font-mono font-medium" style={{ color: isOriginRunning ? tokens.statusRunning : tokens.textMuted }}>
            {originNode ? (isOriginRunning ? 'Active & Serving' : 'Origin Standby') : 'No Target Linked'}
          </span>
        </div>
        <div className="pt-2 border-t space-y-2" style={{ borderColor: tokens.border }}>
          <span className="text-xs font-medium block" style={{ color: tokens.textSecondary }}>Local CDN Edge URL:</span>
          {originNode ? (
            <a
              href={cfUrl}
              target="_blank"
              rel="noreferrer"
              style={{ color: tokens.accent, borderColor: tokens.border }}
              className="flex items-center gap-1.5 p-2 rounded bg-sky-500/10 border font-mono truncate hover:underline"
            >
              <LuExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{cfUrl}</span>
            </a>
          ) : (
            <span className="p-2 rounded border font-mono block text-xs" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textMuted }}>
              Attach to EC2 or S3 to route requests
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
