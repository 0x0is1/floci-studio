'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { LuVariable, LuCopy } from 'react-icons/lu';
import { toast } from 'sonner';

interface Props {
  envEdges: any[];
  nodes: any[];
}

export function Ec2EnvSection({ envEdges, nodes }: Props) {
  const { tokens } = useTheme();
  if (envEdges.length === 0) return null;

  const copyEnv = (name: string, val: string) => {
    navigator.clipboard.writeText(`export ${name}="${val}"`);
    toast.success(`Copied ${name}`);
  };

  return (
    <div className="p-3 rounded-lg border space-y-2 text-xs select-text" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, userSelect: 'text' }}>
      <div className="flex items-center gap-1.5 font-semibold" style={{ color: tokens.textPrimary }}>
        <LuVariable className="w-3.5 h-3.5 text-sky-400" />
        <span>Injected Environment Variables</span>
      </div>
      <div className="space-y-1.5">
        {envEdges.map((e) => {
          const targetNode = nodes.find((n) => n.id === e.target);
          const cfg = targetNode?.data.config || {};
          const val = cfg.bucketName || cfg.queueName || cfg.tableName || cfg.dbName || cfg.topicName || cfg.modelId || cfg.functionName || targetNode?.data.label || 'configured';
          const varName = e.data?.envVarName || 'ENV_VAR';
          return (
            <div key={e.id} className="flex items-center justify-between p-1.5 rounded border font-mono text-[11px]" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}>
              <div className="truncate mr-2 select-all">
                <span className="text-sky-400 font-semibold">{varName}=</span>
                <span style={{ color: tokens.textSecondary }}>&quot;{val}&quot;</span>
              </div>
              <button type="button" onClick={() => copyEnv(varName, val)} style={{ color: tokens.textMuted }} className="hover:opacity-85 p-0.5 cursor-pointer" title="Copy env">
                <LuCopy className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
