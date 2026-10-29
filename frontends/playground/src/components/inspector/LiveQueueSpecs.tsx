'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { CliCommandSnippet } from './CliCommandSnippet';

export function LiveQueueSpecs({ config, isRunning, nodeId }: { config: Record<string, any>; isRunning: boolean; nodeId?: string }) {
  const { tokens } = useTheme();
  const { edges, nodes, selectedNodeId } = usePlaygroundStore();
  const activeId = nodeId || selectedNodeId;
  const queueName = config.queueName || 'event-ingestion-queue';
  const queueUrl = `http://localhost:4566/000000000000/${queueName}`;
  const region = 'us-east-1';

  const sendCmd = `aws --endpoint-url=http://localhost:4566 --region ${region} sqs send-message --queue-url ${queueUrl} --message-body "Task Payload"`;
  const recvCmd = `aws --endpoint-url=http://localhost:4566 --region ${region} sqs receive-message --queue-url ${queueUrl}`;

  const incoming = edges.filter((e) => e.target === activeId).map((e) => nodes.find((n) => n.id === e.source)).filter(Boolean);
  const sourceLabel = incoming.length > 0 ? incoming.map((n) => `${n?.data.label} (${n?.data.serviceType.toUpperCase()})`).join(', ') : null;

  return (
    <div className="space-y-3 text-xs">
      <div className="p-3 rounded-lg border space-y-2 select-text" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, userSelect: 'text' }}>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Queue Target</span>
          <span className="font-mono font-medium truncate max-w-[150px] select-all" style={{ color: tokens.textPrimary }}>{queueName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Region Scoping</span>
          <span className="font-mono font-semibold text-sky-400 select-all">{region}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Connected Compute</span>
          <span className="font-mono text-emerald-400 font-semibold truncate max-w-[150px] select-all">
            {sourceLabel || 'No linked compute'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Delivery Model</span>
          <span className="font-mono uppercase select-all" style={{ color: tokens.accent }}>{config.queueType || 'Standard'}</span>
        </div>
        <div className="pt-2 border-t space-y-1" style={{ borderColor: tokens.border }}>
          <span className="text-xs font-medium block" style={{ color: tokens.textSecondary }}>Queue Endpoint URL:</span>
          <span className="font-mono block truncate text-[11px] select-all" style={{ color: tokens.textMuted }}>{queueUrl}</span>
        </div>
      </div>

      {isRunning && (
        <>
          <CliCommandSnippet label="Send SQS Message" command={sendCmd} />
          <CliCommandSnippet label="Receive SQS Message" command={recvCmd} />
        </>
      )}
    </div>
  );
}
