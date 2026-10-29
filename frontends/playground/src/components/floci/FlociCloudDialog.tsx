'use client';

import React, { useState, useEffect } from 'react';
import { fetchFlociResources, deleteFlociResource, purgeAllFlociResources } from '@/lib/api/flociResourceClient';
import { useTheme } from '@/theme/ThemeProvider';
import { LuCloud, LuRefreshCw, LuTrash2, LuX } from 'react-icons/lu';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function FlociCloudDialog({ isOpen, onClose }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { tokens } = useTheme();

  const load = async () => {
    setLoading(true);
    const res = await fetchFlociResources().catch(() => null);
    if (res?.success) setData(res);
    setLoading(false);
  };

  useEffect(() => { if (isOpen) load(); }, [isOpen]);
  if (!isOpen) return null;

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

  const buckets = data?.s3?.buckets || [], queues = data?.sqs?.queues || [];
  const tables = data?.dynamodb?.tables || [], ports = data?.runningPorts || [];

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl rounded-xl border p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textPrimary }}>
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: tokens.border }}>
          <div className="flex items-center gap-2">
            <LuCloud className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="font-semibold text-sm">Floci Cloud Resources (All Projects)</h2>
              <p className="text-[11px]" style={{ color: tokens.textMuted }}>Direct control over local AWS emulator resources across all workspaces.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={load} disabled={loading} style={{ backgroundColor: tokens.btnBg, borderColor: tokens.border, color: tokens.textPrimary }} className="flex items-center gap-1 px-2 py-1 rounded border text-xs cursor-pointer hover:opacity-85">
              <LuRefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /><span>Refresh</span>
            </button>
            <button onClick={handlePurgeAll} className="flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs cursor-pointer">
              <LuTrash2 className="w-3 h-3" /><span>Purge All</span>
            </button>
            <button onClick={onClose} style={{ color: tokens.textMuted }} className="p-1 rounded hover:opacity-85 cursor-pointer ml-1"><LuX className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs pr-1">
          <ResourceBox title={`S3 Buckets (${buckets.length})`} items={buckets} onDelete={(b: string) => handleDelete('s3', b)} tokens={tokens} />
          <ResourceBox title={`SQS Queues (${queues.length})`} items={queues} onDelete={(q: string) => handleDelete('sqs', q)} tokens={tokens} isUrl />
          <ResourceBox title={`DynamoDB (${tables.length})`} items={tables} onDelete={(t: string) => handleDelete('dynamodb', t)} tokens={tokens} />
          <ResourceBox title={`EC2 Web (${ports.length})`} items={ports.map((p: any) => `localhost:${p}`)} onDelete={(p: string) => handleDelete('ec2', p.replace('localhost:', ''))} tokens={tokens} isPort />
        </div>
      </div>
    </div>
  );
}

function ResourceBox({ title, items, onDelete, tokens, isUrl, isPort }: any) {
  return (
    <div className="p-3 rounded-lg border space-y-2" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
      <span className="font-semibold block text-[11px]" style={{ color: tokens.textPrimary }}>{title}</span>
      {items.length === 0 ? <p className="text-[10px]" style={{ color: tokens.textMuted }}>No active items.</p> : (
        <div className="space-y-1">{items.map((item: string) => (
          <div key={item} className="flex items-center justify-between p-1.5 rounded border text-[11px]" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}>
            <span className={`truncate mr-1 ${isPort ? 'text-emerald-400' : ''}`}>{isUrl ? item.split('/').pop() : item}</span>
            <button onClick={() => onDelete(item)} className="text-red-400 p-0.5 hover:opacity-85 cursor-pointer"><LuTrash2 className="w-3 h-3" /></button>
          </div>
        ))}</div>
      )}
    </div>
  );
}
