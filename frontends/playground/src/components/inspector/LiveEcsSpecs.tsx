'use client';

import React from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { Ec2EnvSection } from './Ec2EnvSection';
import { CliCommandSnippet } from './CliCommandSnippet';

interface Props {
  config: Record<string, any>;
  isRunning: boolean;
  nodeId?: string;
}

export function LiveEcsSpecs({ config, isRunning, nodeId }: Props) {
  const { tokens } = useTheme();
  const { edges, nodes, selectedNodeId } = usePlaygroundStore();
  const activeId = nodeId || selectedNodeId;
  const region = 'us-east-1';
  const cluster = config.clusterName || 'prod-cluster';

  const envEdges = edges.filter((e) => (e.source === activeId || e.target === activeId) && e.data?.envVarName);
  const runTaskCli = `aws --endpoint-url=http://localhost:4566 --region ${region} ecs run-task --cluster ${cluster} --launch-type ${config.launchType || 'FARGATE'}`;
  const describeCli = `aws --endpoint-url=http://localhost:4566 --region ${region} ecs describe-tasks --cluster ${cluster}`;

  return (
    <div className="space-y-3 select-text" style={{ userSelect: 'text' }}>
      <div className="p-3 rounded-lg border space-y-1.5" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: tokens.textMuted }}>Cluster</span>
          <span className="font-mono font-medium select-all" style={{ color: tokens.textPrimary }}>{cluster}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: tokens.textMuted }}>Launch Type</span>
          <span className="font-mono font-semibold text-sky-400 select-all">{config.launchType || 'FARGATE'}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: tokens.textMuted }}>Container Image</span>
          <span className="font-mono truncate max-w-[150px] select-all" style={{ color: tokens.textPrimary }}>{config.image || 'nginx:alpine'}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: tokens.textMuted }}>Task Size</span>
          <span className="font-mono select-all" style={{ color: tokens.textPrimary }}>{config.cpu || 256} CPU / {config.memory || 512} MB</span>
        </div>
      </div>

      <Ec2EnvSection envEdges={envEdges} nodes={nodes} nodeId={activeId ?? undefined} />

      {isRunning && (
        <>
          <CliCommandSnippet label="Run Task via AWS CLI" command={runTaskCli} />
          <CliCommandSnippet label="Describe Tasks via AWS CLI" command={describeCli} />
        </>
      )}
    </div>
  );
}
