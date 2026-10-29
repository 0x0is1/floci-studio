'use client';

import React from 'react';
import { AwsIcon } from '@/components/icons/AwsIcons';
import { LuNetwork, LuX, LuTrash2 } from 'react-icons/lu';
import { AppNode, AppEdge, usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { toast } from 'sonner';

export function NodeInspectorHeader({ node, onClose, isReadOnly }: { node: AppNode; onClose: () => void; isReadOnly?: boolean }) {
  const { tokens } = useTheme();
  const deleteNode = usePlaygroundStore((s) => s.deleteNode);

  const handleDelete = () => {
    deleteNode(node.id);
    toast.info('Component Deleted', { description: `Removed ${node.data.label}` });
  };

  return (
    <div className="flex items-center justify-between border-b px-4 py-3" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-lg border flex items-center justify-center overflow-hidden shrink-0 p-0" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}>
          <AwsIcon type={node.data.serviceType} size={40} className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:block" />
        </div>
        <div>
          <h3 className="font-semibold text-xs truncate max-w-[150px]" style={{ color: tokens.textPrimary }}>{node.data.label}</h3>
          <span className="text-[10px] text-sky-400 font-mono uppercase tracking-wider">{node.data.serviceType}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {!isReadOnly && (
          <button
            type="button"
            onClick={handleDelete}
            className="p-1.5 rounded text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Delete component"
          >
            <LuTrash2 className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          style={{ color: tokens.textMuted }}
          className="p-1.5 rounded hover:opacity-85 transition-colors cursor-pointer"
          title="Close inspector"
        >
          <LuX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function EdgeInspectorHeader({ edge, onClose, isReadOnly }: { edge: AppEdge; onClose: () => void; isReadOnly?: boolean }) {
  const { tokens } = useTheme();
  const deleteEdge = usePlaygroundStore((s) => s.deleteEdge);

  const handleDelete = () => {
    deleteEdge(edge.id);
    toast.info('Link Deleted', { description: 'Connection link removed.' });
  };

  return (
    <div className="flex items-center justify-between border-b px-4 py-3" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded border bg-sky-500/10 border-sky-500/30">
          <LuNetwork className="w-4 h-4 text-sky-400" />
        </div>
        <div>
          <h3 className="font-semibold text-xs" style={{ color: tokens.textPrimary }}>Connection Link</h3>
          <span className="text-[10px] font-mono" style={{ color: tokens.textMuted }}>{edge.source} -&gt; {edge.target}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {!isReadOnly && (
          <button
            type="button"
            onClick={handleDelete}
            className="p-1.5 rounded text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Delete link"
          >
            <LuTrash2 className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          style={{ color: tokens.textMuted }}
          className="p-1.5 rounded hover:opacity-85 transition-colors cursor-pointer"
          title="Close inspector"
        >
          <LuX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
