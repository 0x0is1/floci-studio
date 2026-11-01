'use client';

import React from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { LuExternalLink, LuShieldCheck } from 'react-icons/lu';
import { Ec2EnvSection } from './Ec2EnvSection';
import { CliCommandSnippet } from './CliCommandSnippet';

interface Props {
  config: Record<string, any>;
  isRunning: boolean;
  nodeId?: string;
}

export function LiveEc2Specs({ config, isRunning, nodeId }: Props) {
  const { tokens } = useTheme();
  const { edges, nodes, selectedNodeId } = usePlaygroundStore();
  const activeId = nodeId || selectedNodeId;
  const port = config.port || 8080;
  const region = 'us-east-1';

  const envEdges = edges.filter((e) => (e.source === activeId || e.target === activeId) && e.data?.envVarName);
  const iamEdges = edges.filter((e) => (e.source === activeId || e.target === activeId) && e.data?.iamPolicy);
  const curlCmd = `curl http://localhost:${port}`;
  const amiLabel = config.ami?.includes('ubuntu') ? 'Ubuntu 24.04 LTS' : (config.ami?.includes('2023') ? 'Amazon Linux 2023' : (config.ami || 'Ubuntu 24.04 LTS'));

  return (
    <div className="space-y-3 select-text" style={{ userSelect: 'text' }}>
      <div className="p-3 rounded-lg border space-y-1.5" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: tokens.textMuted }}>Web Host Port</span>
          <span className="font-mono font-medium select-all" style={{ color: isRunning ? tokens.statusRunning : tokens.textMuted }}>
            :{port} {isRunning ? '(Bound)' : '(Offline)'}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: tokens.textMuted }}>Region Scoping</span>
          <span className="font-mono font-semibold text-sky-400 select-all">{region}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: tokens.textMuted }}>Operating System</span>
          <span className="font-mono text-orange-400 font-semibold truncate max-w-[150px] select-all">{amiLabel}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: tokens.textMuted }}>Workload Stack</span>
          <span className="font-mono uppercase font-semibold text-sky-400 select-all">{config.template || 'nginx'}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: tokens.textMuted }}>Instance Type</span>
          <span className="font-mono select-all" style={{ color: tokens.textPrimary }}>{config.instanceType || 't3.micro'}</span>
        </div>
      </div>

      <Ec2EnvSection envEdges={envEdges} nodes={nodes} nodeId={activeId ?? undefined} />

      {iamEdges.length > 0 && (
        <div className="p-3 rounded-lg border space-y-1.5 text-xs select-text" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
          <div className="flex items-center gap-1.5 font-semibold" style={{ color: tokens.textPrimary }}>
            <LuShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Attached IAM Policies</span>
          </div>
          <div className="space-y-1">
            {iamEdges.map((e) => (
              <span key={e.id} className="block p-1 rounded font-mono text-[10px] truncate select-all" style={{ backgroundColor: tokens.cardBg, color: tokens.textSecondary }}>
                {e.data?.iamPolicy}
              </span>
            ))}
          </div>
        </div>
      )}

      {isRunning && config.port && (
        <>
          <CliCommandSnippet label="Test Web Server CLI" command={curlCmd} />
          <a
            href={`http://localhost:${config.port}`}
            target="_blank"
            rel="noreferrer"
            style={{ borderColor: tokens.border }}
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-md bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border text-xs font-mono font-medium transition-colors cursor-pointer select-all"
          >
            <LuExternalLink className="w-3.5 h-3.5" />
            <span>Open http://localhost:{config.port}</span>
          </a>
        </>
      )}
    </div>
  );
}
