'use client';

import React, { useState, useEffect } from 'react';
import { fetchFlociResources, deleteFlociResource, purgeAllFlociResources } from '@/lib/api/flociResourceClient';
import { useTheme } from '@/theme/ThemeProvider';
import { LuCloud, LuRefreshCw, LuTrash2, LuX } from 'react-icons/lu';
import { toast } from 'sonner';
import { FlociResourceCategoryCard } from '@/components/floci/FlociResourceCategoryCard';

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

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-5xl rounded-xl border p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textPrimary }}>
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: tokens.border }}>
          <div className="flex items-center gap-2">
            <LuCloud className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="font-semibold text-sm">Floci Cloud Resources Inventory (All Services)</h2>
              <p className="text-[11px]" style={{ color: tokens.textMuted }}>Direct control over local AWS emulator resources across all workspaces and categories.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={load} disabled={loading} style={{ backgroundColor: tokens.btnBg, borderColor: tokens.border, color: tokens.textPrimary }} className="flex items-center gap-1 px-2.5 py-1 rounded border text-xs cursor-pointer hover:opacity-85">
              <LuRefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /><span>Refresh</span>
            </button>
            <button onClick={handlePurgeAll} className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs cursor-pointer">
              <LuTrash2 className="w-3 h-3" /><span>Purge All</span>
            </button>
            <button onClick={onClose} style={{ color: tokens.textMuted }} className="p-1 rounded hover:opacity-85 cursor-pointer ml-1"><LuX className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 font-mono text-xs pr-1">
          <FlociResourceCategoryCard title="S3 Buckets" items={data?.s3?.buckets || []} service="s3" onDelete={handleDelete} tokens={tokens} />
          <FlociResourceCategoryCard title="SQS Queues" items={data?.sqs?.queues || []} service="sqs" onDelete={handleDelete} tokens={tokens} isUrl />
          <FlociResourceCategoryCard title="DynamoDB Tables" items={data?.dynamodb?.tables || []} service="dynamodb" onDelete={handleDelete} tokens={tokens} />
          <FlociResourceCategoryCard title="EC2 Web Servers" items={(data?.runningPorts || []).map((p: any) => `localhost:${p}`)} service="ec2" onDelete={(s, p) => handleDelete(s, p.replace('localhost:', ''))} tokens={tokens} isPort />
          <FlociResourceCategoryCard title="RDS Databases" items={data?.rds?.instances || []} service="rds" onDelete={handleDelete} tokens={tokens} />
          <FlociResourceCategoryCard title="Lambda Functions" items={data?.lambda?.functions || []} service="lambda" onDelete={handleDelete} tokens={tokens} />
          <FlociResourceCategoryCard title="SNS Topics" items={data?.sns?.topics || []} service="sns" onDelete={handleDelete} tokens={tokens} isUrl />
          <FlociResourceCategoryCard title="Secrets Manager" items={data?.secrets?.secrets || []} service="secrets" onDelete={handleDelete} tokens={tokens} />
          <FlociResourceCategoryCard title="KMS Encryption Keys" items={data?.kms?.keys || []} service="kms" onDelete={handleDelete} tokens={tokens} />
          <FlociResourceCategoryCard title="CloudWatch Log Groups" items={data?.logs?.logGroups || []} service="logs" onDelete={handleDelete} tokens={tokens} />
          <FlociResourceCategoryCard title="EventBridge Buses" items={data?.eventbridge?.buses || []} service="eventbridge" onDelete={handleDelete} tokens={tokens} />
        </div>
      </div>
    </div>
  );
}
