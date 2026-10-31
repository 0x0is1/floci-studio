'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { usePlaygroundStore, AppNode } from '@/store/playgroundStore';
import { useCanvasTabStore } from '@/store/canvasTabStore';
import { LuShieldCheck } from 'react-icons/lu';
import { toast } from 'sonner';
import { NodeIamPolicyList } from './NodeIamPolicyList';
import { AwsPermissionMultiSelect } from './AwsPermissionMultiSelect';

interface Props {
  node: AppNode;
  config: Record<string, any>;
  onChange?: (key: string, val: any) => void;
  isReadOnly?: boolean;
}

export function NodeIamSection({ node, config, onChange, isReadOnly = false }: Props) {
  const { tokens } = useTheme();
  const { edges, deployedEdges } = usePlaygroundStore();
  const isDeployedTab = useCanvasTabStore((s) => s.activeTab === 'deployed');
  const activeEdges = isDeployedTab && deployedEdges.length > 0 ? deployedEdges : edges;

  const defaultRole = `${node.data.label.toLowerCase().replace(/[^a-z0-9-]/g, '-')}-role`;
  const roleName = config.iamRole || defaultRole;
  const customPolicies: string[] = Array.isArray(config.iamPolicies) ? config.iamPolicies : [];

  const edgePolicies = activeEdges
    .filter((e) => (e.source === node.id || e.target === node.id) && e.data?.iamPolicy)
    .flatMap((e) => String(e.data?.iamPolicy).split(',').map((p) => p.trim()))
    .filter(Boolean);

  const handleAddPolicy = (action: string) => {
    if (!onChange || customPolicies.includes(action)) return;
    onChange('iamPolicies', [...customPolicies, action]);
    toast.success('IAM Policy Added', { description: `Added ${action}` });
  };

  const handleDeletePolicy = (index: number) => {
    if (!onChange) return;
    onChange('iamPolicies', customPolicies.filter((_, i) => i !== index));
    toast.info('IAM Policy Removed');
  };

  return (
    <div className="rounded-lg border p-3 space-y-3 select-text" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, userSelect: 'text' }}>
      <div className="flex items-center gap-1.5 font-semibold text-[11px]" style={{ color: tokens.textPrimary }}>
        <LuShieldCheck className="w-4 h-4 text-purple-400" />
        <span>IAM Role &amp; Access Policies</span>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] uppercase font-mono tracking-wider" style={{ color: tokens.textMuted }}>Assigned IAM Role</label>
        {isReadOnly ? (
          <div className="w-full rounded border px-2 py-1 text-xs font-mono select-all truncate" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textPrimary }}>
            {roleName}
          </div>
        ) : (
          <input
            type="text" value={roleName} onChange={(e) => onChange?.('iamRole', e.target.value)}
            placeholder="e.g. ec2-app-role"
            style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textPrimary }}
            className="w-full rounded border px-2 py-1 text-xs font-mono focus:outline-none focus:border-purple-500"
          />
        )}
      </div>

      <NodeIamPolicyList edgePolicies={edgePolicies} customPolicies={customPolicies} onDeletePolicy={isReadOnly ? undefined : handleDeletePolicy} />

      {!isReadOnly && onChange && (
        <>
          <AwsPermissionMultiSelect existingPolicies={customPolicies} serviceType={node.data.serviceType} onAddPolicy={handleAddPolicy} />
          <p className="text-[10px]" style={{ color: tokens.textMuted }}>Select verified AWS IAM actions. Takes effect on next deploy.</p>
        </>
      )}
    </div>
  );
}
