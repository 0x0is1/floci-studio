'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { LuVariable, LuCopy } from 'react-icons/lu';
import { toast } from 'sonner';

interface Props {
  envEdges: any[];
  nodes: any[];
  nodeId?: string;
}

function getResolvedEnvValue(node: any): string {
  if (!node) return 'configured';
  const type = node.data?.serviceType;
  const cfg = node.data?.config || {};
  const endpoint = 'http://localhost:4566';

  if (type === 'sqs') return `${endpoint}/000000000000/${cfg.queueName || 'app-queue'}`;
  if (type === 's3') return `${endpoint}/${cfg.bucketName || 'app-bucket'}`;
  if (type === 'rds') {
    const user = cfg.user || 'postgres', pass = cfg.password || 'floci123', port = cfg.port || 5432, db = cfg.databaseName || cfg.dbName || 'postgres';
    return `postgresql://${user}:${pass}@localhost:${port}/${db}`;
  }
  if (type === 'dynamodb') return `${endpoint}/tables/${cfg.tableName || 'app-table'}`;
  if (type === 'bedrock') return `${endpoint}/bedrock`;
  if (type === 'sns') return `arn:aws:sns:us-east-1:000000000000:${cfg.topicName || 'app-topic'}`;
  if (type === 'secretsmanager' || type === 'secrets') return `arn:aws:secretsmanager:us-east-1:000000000000:secret:${cfg.secretName || 'app-secret'}`;
  if (type === 'elasticache') return `redis://localhost:${cfg.port || 6379}`;
  return cfg.bucketName || cfg.queueName || cfg.tableName || cfg.dbName || cfg.topicName || cfg.modelId || cfg.functionName || node.data?.label || 'configured';
}

export function Ec2EnvSection({ envEdges, nodes, nodeId }: Props) {
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
          const peerId = nodeId ? (e.source === nodeId ? e.target : e.source) : e.target;
          const targetNode = nodes.find((n) => n.id === peerId);
          const val = getResolvedEnvValue(targetNode);
          const varName = e.data?.envVarName || 'ENV_VAR';
          return (
            <div key={e.id} className="flex items-center justify-between p-1.5 rounded border font-mono text-[11px]" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}>
              <div className="truncate mr-2 select-all">
                <span className="text-sky-400 font-semibold">{varName}=</span>
                <span style={{ color: tokens.textSecondary }}>&quot;{val}&quot;</span>
              </div>
              <button type="button" onClick={() => copyEnv(varName, val)} style={{ color: tokens.textMuted }} className="hover:opacity-85 p-0.5 cursor-pointer shrink-0" title="Copy env">
                <LuCopy className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
