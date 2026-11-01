'use client';

import React from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useDeployProgressStore } from '@/store/deployProgressStore';
import { useTheme } from '@/theme/ThemeProvider';
import { LuActivity } from 'react-icons/lu';
import { LiveDeployProgress } from './LiveDeployProgress';
import { LiveReadyGrid } from './LiveReadyGrid';

export function LiveRuntimeView() {
  const { nodes: draftNodes, edges: draftEdges, deployedNodes, deployedEdges, isDeployed } = usePlaygroundStore();
  const { isDeploying, progress } = useDeployProgressStore();
  const { tokens } = useTheme();
  const nodes = isDeployed ? deployedNodes : draftNodes;
  const edges = isDeployed ? deployedEdges : draftEdges;
  const runningNodes = nodes.filter((n) => n.data.status === 'running' || n.data.liveUrl);
  const showLiveProgress = isDeploying || Object.keys(progress).length > 0;

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
      {showLiveProgress ? (
        <LiveDeployProgress />
      ) : runningNodes.length === 0 ? (
        <div className="p-8 text-center font-mono text-xs border border-dashed rounded-lg" style={{ borderColor: tokens.border, color: tokens.textMuted }}>
          <LuActivity className="w-5 h-5 mx-auto mb-2" style={{ color: tokens.textMuted }} />
          <p className="font-semibold" style={{ color: tokens.textSecondary }}>No deployment found. Deploy to see output.</p>
          <p className="text-[11px] mt-1" style={{ color: tokens.textMuted }}>Launch real infrastructure against Floci to view live endpoints.</p>
        </div>
      ) : (
        <LiveReadyGrid nodes={runningNodes} getConnectionInfo={getConnectionInfo} />
      )}
    </div>
  );
}
