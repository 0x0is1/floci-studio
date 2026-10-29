'use client';

import React, { useState } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { toast } from 'sonner';
import { LuCopy, LuCheck, LuLayers } from 'react-icons/lu';

import { usePlaygroundStore } from '@/store/playgroundStore';

export function LiveQueueSpecs({ config, isRunning, nodeId }: { config: Record<string, any>; isRunning: boolean; nodeId?: string }) {
  const { tokens } = useTheme();
  const { edges, nodes, selectedNodeId } = usePlaygroundStore();
  const [copied, setCopied] = useState(false);
  const activeId = nodeId || selectedNodeId;
  const queueName = config.queueName || 'background-jobs';
  const queueUrl = `http://localhost:4566/000000000000/${queueName}`;
  const sendCmd = `aws --endpoint-url=http://localhost:4566 sqs send-message --queue-url ${queueUrl} --message-body "Task Payload"`;

  const incoming = edges.filter((e) => e.target === activeId).map((e) => nodes.find((n) => n.id === e.source)).filter(Boolean);
  const sourceLabel = incoming.length > 0 ? incoming.map((n) => `${n?.data.label} (${n?.data.serviceType.toUpperCase()})`).join(', ') : null;

  const copyCmd = () => {
    navigator.clipboard.writeText(sendCmd);
    setCopied(true);
    toast.success('Copied SQS command');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 text-xs">
      <div className="p-3 rounded-lg border space-y-2" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Queue Target</span>
          <span className="font-mono font-medium truncate max-w-[150px]" style={{ color: tokens.textPrimary }}>{queueName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Connected Compute</span>
          <span className="font-mono text-emerald-400 font-semibold truncate max-w-[150px]">
            {sourceLabel || 'No linked compute'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: tokens.textMuted }}>Delivery Model</span>
          <span className="font-mono uppercase" style={{ color: tokens.accent }}>{config.queueType || 'Standard'}</span>
        </div>
        <div className="pt-2 border-t space-y-1" style={{ borderColor: tokens.border }}>
          <span className="text-xs font-medium block" style={{ color: tokens.textSecondary }}>Queue Endpoint URL:</span>
          <span className="font-mono block truncate text-[11px] select-all" style={{ color: tokens.textMuted }}>{queueUrl}</span>
        </div>
      </div>

      {isRunning && (
        <div className="p-3 rounded-lg border space-y-2" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: tokens.textPrimary }}>
              <LuLayers className="w-3.5 h-3.5 text-sky-400" />
              <span>Send Message CLI</span>
            </span>
            <button type="button" onClick={copyCmd} style={{ color: tokens.textMuted }} className="p-1 hover:opacity-85 cursor-pointer">
              {copied ? <LuCheck className="w-3.5 h-3.5 text-emerald-400" /> : <LuCopy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="p-2 rounded font-mono text-[11px] break-all select-all border" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textSecondary }}>
            {sendCmd}
          </p>
        </div>
      )}
    </div>
  );
}

