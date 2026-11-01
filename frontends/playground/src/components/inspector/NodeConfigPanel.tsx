'use client';

import React from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { renderServiceConfigForm } from './serviceConfigFormRegistry';
import { NodeIamSection } from './NodeIamSection';
import { LuTrash2 } from 'react-icons/lu';
import { toast } from 'sonner';

export function NodeConfigPanel() {
  const { selectedNodeId, nodes, updateNodeConfig, deleteNode } = usePlaygroundStore();
  const { tokens } = useTheme();
  const node = nodes.find((n) => n.id === selectedNodeId);

  if (!node) {
    return (
      <div className="p-4 text-xs text-center" style={{ color: tokens.textMuted }}>
        Select a component on the canvas to configure properties.
      </div>
    );
  }

  const { data } = node;
  const config = data.config || {};

  const handleChange = (key: string, val: any) => {
    updateNodeConfig(node.id, { ...config, [key]: val }, data.label);
  };

  const handleDelete = () => {
    deleteNode(node.id);
    toast.info('Component Deleted', { description: `Removed ${data.label}` });
  };

  return (
    <div className="p-4 space-y-4 text-xs">
      <div className="space-y-1">
        <label className="text-[10px] font-medium uppercase tracking-wider" style={{ color: tokens.textMuted }}>Display Title</label>
        <input
          type="text"
          value={data.label}
          onChange={(e) => updateNodeConfig(node.id, config, e.target.value)}
          style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary }}
          className="w-full rounded border px-2.5 py-1.5 focus:outline-none focus:border-sky-500"
        />
      </div>

      {renderServiceConfigForm(data.serviceType, config, handleChange)}

      <NodeIamSection node={node} config={config} onChange={handleChange} />

      <div className="pt-3 border-t" style={{ borderColor: tokens.border }}>
        <button
          type="button"
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium transition-colors cursor-pointer"
        >
          <LuTrash2 className="w-3.5 h-3.5" />
          <span>Delete Component</span>
        </button>
      </div>
    </div>
  );
}
