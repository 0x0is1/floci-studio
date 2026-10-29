'use client';

import React from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { LuNetwork, LuTriangleAlert, LuCheck } from 'react-icons/lu';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function CloudFrontConfigForm({ config, onChange }: Props) {
  const { tokens } = useTheme();
  const { edges, nodes, selectedNodeId } = usePlaygroundStore();
  const inputStyle = { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary };

  const cfEdge = edges.find((e) => e.source === selectedNodeId || e.target === selectedNodeId);
  const targetId = cfEdge ? (cfEdge.source === selectedNodeId ? cfEdge.target : cfEdge.source) : null;
  const originNode = targetId ? nodes.find((n) => n.id === targetId) : null;

  return (
    <div className="space-y-3">
      <div className="p-2.5 rounded-lg border space-y-1.5" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
        <div className="flex items-center justify-between text-xs font-semibold" style={{ color: tokens.textPrimary }}>
          <span className="flex items-center gap-1.5">
            <LuNetwork className="w-3.5 h-3.5 text-sky-400" />
            <span>Connected Origin</span>
          </span>
          {originNode ? (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <LuCheck className="w-3 h-3" /> CONNECTED
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-amber-400 font-mono">
              <LuTriangleAlert className="w-3 h-3" /> UNCONNECTED
            </span>
          )}
        </div>
        <p className="text-xs font-mono" style={{ color: originNode ? tokens.textSecondary : tokens.textMuted }}>
          {originNode ? `${originNode.data.label} (${originNode.data.serviceType.toUpperCase()})` : 'Drag connection from tail handle to EC2 or S3'}
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-[10px]" style={{ color: tokens.textMuted }}>Price Class (Edge Locations)</label>
        <select
          value={config.priceClass || 'PriceClass_100'}
          onChange={(e) => onChange('priceClass', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2 py-1.5 text-xs focus:outline-none"
        >
          <option value="PriceClass_100">PriceClass_100 (US, Canada & Europe)</option>
          <option value="PriceClass_200">PriceClass_200 (Most Global Edges)</option>
          <option value="PriceClass_All">PriceClass_All (Worldwide All Edges)</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-[10px]" style={{ color: tokens.textMuted }}>Viewer Protocol Policy</label>
        <select
          value={config.viewerProtocolPolicy || 'redirect-to-https'}
          onChange={(e) => onChange('viewerProtocolPolicy', e.target.value)}
          style={inputStyle}
          className="w-full rounded border px-2 py-1.5 text-xs focus:outline-none"
        >
          <option value="redirect-to-https">Redirect HTTP to HTTPS (Recommended)</option>
          <option value="https-only">HTTPS Only</option>
          <option value="allow-all">Allow HTTP and HTTPS</option>
        </select>
      </div>
    </div>
  );
}
