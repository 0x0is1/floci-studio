'use client';

import React from 'react';
import { LuTrash2, LuCopy, LuCheck } from 'react-icons/lu';
import { toast } from 'sonner';

interface Props {
  title: string;
  items: string[];
  service: string;
  onDelete: (service: string, id: string) => void;
  tokens: any;
  isUrl?: boolean;
  isPort?: boolean;
}

export function FlociResourceCategoryCard({ title, items = [], service, onDelete, tokens, isUrl, isPort }: Props) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyItem = (item: string) => {
    navigator.clipboard.writeText(item);
    setCopiedId(item);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 1500);
  };

  const formatDisplay = (item: string) => {
    if (isUrl) return item.split('/').pop() || item;
    if (item.startsWith('arn:aws:')) return item.split(':').pop() || item;
    return item;
  };

  return (
    <div className="p-3 rounded-lg border space-y-2 select-text" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, userSelect: 'text' }}>
      <div className="flex items-center justify-between">
        <span className="font-semibold block text-[11px]" style={{ color: tokens.textPrimary }}>{title}</span>
        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border" style={{ borderColor: tokens.border, color: items.length > 0 ? tokens.accent : tokens.textMuted }}>
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-[10px]" style={{ color: tokens.textMuted }}>No active resources.</p>
      ) : (
        <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item} className="flex items-center justify-between p-1.5 rounded border text-[11px] gap-1" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}>
              <span className={`truncate mr-1 select-all ${isPort ? 'text-emerald-400 font-mono' : ''}`} title={item}>
                {formatDisplay(item)}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => copyItem(item)} className="text-slate-400 hover:text-sky-400 p-0.5 cursor-pointer" title="Copy ID/URI">
                  {copiedId === item ? <LuCheck className="w-3 h-3 text-emerald-400" /> : <LuCopy className="w-3 h-3" />}
                </button>
                <button type="button" onClick={() => onDelete(service, item)} className="text-red-400 p-0.5 hover:opacity-85 cursor-pointer" title="Delete resource">
                  <LuTrash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

