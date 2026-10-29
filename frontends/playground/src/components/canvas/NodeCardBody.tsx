import React from 'react';
import { AwsNodeData } from '@/types/aws';
import { AwsIcon } from '@/components/icons/AwsIcons';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { useCanvasTabStore } from '@/store/canvasTabStore';
import { LuShieldCheck } from 'react-icons/lu';

export function NodeCardBody({ nodeData, nodeId }: { nodeData: AwsNodeData; nodeId?: string }) {
  const isRunning = nodeData.status === 'running', isDeploying = nodeData.status === 'deploying', isError = nodeData.status === 'error';
  const isDeployedTab = useCanvasTabStore((s) => s.activeTab === 'deployed');
  const { tokens } = useTheme();
  const { edges, nodes } = usePlaygroundStore();

  const incoming = edges.filter((e) => e.target === nodeId).map((e) => nodes.find((n) => n.id === e.source)).filter(Boolean);
  const outgoing = edges.filter((e) => e.source === nodeId).map((e) => nodes.find((n) => n.id === e.target)).filter(Boolean);

  const iamRole = nodeData.config?.iamRole || (['ec2', 'lambda'].includes(nodeData.serviceType) ? `${nodeData.label.toLowerCase().replace(/[^a-z0-9-]/g, '-')}-role` : null);
  const roleDisplay = iamRole ? iamRole.replace(/-role$/, '') : null;

  let connLabel = '';
  if (['cloudfront', 'alb'].includes(nodeData.serviceType)) {
    connLabel = outgoing.length > 0 ? `-> ${outgoing[0]?.data.serviceType.toUpperCase()}${outgoing[0]?.data.config?.port ? `:${outgoing[0]?.data.config.port}` : ''}` : 'Unconnected';
  } else if (['s3', 'sqs', 'rds', 'dynamodb'].includes(nodeData.serviceType)) {
    connLabel = incoming.length > 0 ? `<- ${incoming.map((n) => n?.data.serviceType.toUpperCase()).join(',')}` : (nodeData.config?.queueType || '');
  } else if (nodeData.serviceType === 'ec2') {
    connLabel = outgoing.length > 0 ? `-> ${outgoing.map((n) => n?.data.serviceType.toUpperCase()).join(',')}` : (nodeData.config?.port ? `:${nodeData.config.port}` : 'standalone');
  }

  const isUnconnectedAlert = ['cloudfront', 'alb'].includes(nodeData.serviceType) && connLabel === 'Unconnected';

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-lg border flex items-center justify-center overflow-hidden shrink-0 p-0" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
          <AwsIcon type={nodeData.serviceType} size={44} className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:block" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: tokens.textPrimary }}>{nodeData.label}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider" style={{ color: tokens.textSecondary }}>{nodeData.serviceType}</span>
            {nodeData.config?.uuid && (
              <span className="text-xs font-mono truncate" style={{ color: tokens.textMuted }}>#{String(nodeData.config.uuid).slice(0, 6)}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-2 text-xs gap-1" style={{ borderColor: tokens.border }}>
        {isDeployedTab ? (
          <span
            className={`px-2 py-0.5 rounded font-mono text-xs font-medium border ${
              isRunning ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : isDeploying ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : isError ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'border'
            }`}
            style={!isRunning && !isDeploying && !isError ? { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textSecondary } : undefined}
          >
            {nodeData.status?.toUpperCase() || 'DRAFT'}
          </span>
        ) : roleDisplay ? (
          <span className="px-1.5 py-0.5 rounded font-mono text-[9px] text-purple-400 bg-purple-500/10 border border-purple-500/30 truncate max-w-[105px] flex items-center gap-1" title={`IAM Role: ${iamRole}`}>
            <LuShieldCheck className="w-3 h-3 text-purple-400 shrink-0" />
            <span className="truncate">{roleDisplay}</span>
          </span>
        ) : <div />}

        {connLabel && (
          <span
            className={`px-2 py-0.5 rounded border font-mono text-xs truncate max-w-[120px] ${
              isUnconnectedAlert ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-semibold' : ''
            }`}
            style={isUnconnectedAlert ? undefined : { backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textSecondary }}
            title={connLabel}
          >
            {connLabel}
          </span>
        )}
      </div>
    </div>
  );
}
