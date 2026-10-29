'use client';

import React, { useState, useEffect } from 'react';
import { fetchFlociResources, deleteFlociResource, purgeAllFlociResources } from '@/lib/api/flociResourceClient';
import { useTheme } from '@/theme/ThemeProvider';
import { LuCloud, LuRefreshCw, LuTrash2 } from 'react-icons/lu';
import { toast } from 'sonner';
import { FlociResourceCategoryCard } from '@/components/floci/FlociResourceCategoryCard';

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

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono transition-colors" style={{ backgroundColor: tokens.trayBg }}>
      <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: tokens.border }}>
        <div className="flex items-center gap-2">
          <LuCloud className="w-4 h-4 text-sky-400" />
          <span className="font-semibold text-sm" style={{ color: tokens.textPrimary }}>Floci Cloud Resource Inventory (All Services)</span>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
  );
}
