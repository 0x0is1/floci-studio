'use client';

import React, { useState, useEffect } from 'react';
import { fetchFlociResources, deleteFlociResource, purgeAllFlociResources } from '@/lib/api/flociResourceClient';
import { useTheme } from '@/theme/ThemeProvider';
import { LuCloud, LuRefreshCw, LuTrash2 } from 'react-icons/lu';
import { toast } from 'sonner';

export function FlociCloudView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { tokens } = useTheme();

  const load = async () => {
    setLoading(true);
    const res = await fetchFlociResources().catch(() => null);
    if (res?.success) setData(res);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (service: string, id: string) => {
    const res = await deleteFlociResource(service, id);
    if (res?.success) { toast.success(`Removed ${service} ${id}`); load(); }
    else { toast.error(`Failed to delete ${id}`); }
  };

  const handlePurgeAll = async () => {
    const res = await purgeAllFlociResources();
    if (res?.success) { toast.success('All Floci cloud resources purged'); load(); }
    else { toast.error('Purge failed'); }
  };

  const buckets = data?.s3?.buckets || [];
  const queues = data?.sqs?.queues || [];
  const tables = data?.dynamodb?.tables || [];
  const ports = data?.runningPorts || [];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono transition-colors" style={{ backgroundColor: tokens.trayBg }}>
      <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: tokens.border }}>
        <div className="flex items-center gap-2">
          <LuCloud className="w-4 h-4 text-sky-400" />
          <span className="font-semibold" style={{ color: tokens.textPrimary }}>Floci Cloud Resource Inventory</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} disabled={loading} style={{ backgroundColor: tokens.btnBg, borderColor: tokens.border, color: tokens.textPrimary }} className="flex items-center gap-1.5 px-2.5 py-1 rounded border hover:opacity-85 cursor-pointer">
            <LuRefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button onClick={handlePurgeAll} className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 cursor-pointer">
            <LuTrash2 className="w-3 h-3" />
            <span>Purge All</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <ResourceGroup title={`S3 Buckets (${buckets.length})`} items={buckets} onDelete={(b: string) => handleDelete('s3', b)} tokens={tokens} />
        <ResourceGroup title={`SQS Queues (${queues.length})`} items={queues} onDelete={(q: string) => handleDelete('sqs', q)} tokens={tokens} isUrl />
        <ResourceGroup title={`DynamoDB (${tables.length})`} items={tables} onDelete={(t: string) => handleDelete('dynamodb', t)} tokens={tokens} />
        <ResourceGroup title={`EC2 Web (${ports.length})`} items={ports.map((p: any) => `localhost:${p}`)} onDelete={(p: string) => handleDelete('ec2', p.replace('localhost:', ''))} tokens={tokens} isPort />
      </div>
    </div>
  );
}

function ResourceGroup({ title, items, onDelete, tokens, isUrl, isPort }: any) {
  return (
    <div className="p-3 rounded-lg border space-y-2" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
      <span className="font-semibold block text-[11px]" style={{ color: tokens.textPrimary }}>{title}</span>
      {items.length === 0 ? <p className="text-[10px]" style={{ color: tokens.textMuted }}>No active items.</p> : (
        <div className="space-y-1">{items.map((item: string) => (
          <div key={item} className="flex items-center justify-between p-1.5 rounded border text-[11px]" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}>
            <span className={`truncate ${isPort ? 'text-emerald-400' : ''}`}>{isUrl ? item.split('/').pop() : item}</span>
            <button onClick={() => onDelete(item)} className="text-red-400 p-0.5 hover:opacity-85 cursor-pointer"><LuTrash2 className="w-3 h-3" /></button>
          </div>
        ))}</div>
      )}
    </div>
  );
}
