'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { usePlaygroundStore, AppNode } from '@/store/playgroundStore';
import { LuShieldCheck } from 'react-icons/lu';
import { toast } from 'sonner';
import { NodeIamPolicyList } from './NodeIamPolicyList';
import { AwsPermissionMultiSelect } from './AwsPermissionMultiSelect';

interface Props {
  node: AppNode;
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function NodeIamSection({ node, config, onChange }: Props) {
  const { tokens } = useTheme();
  const { edges } = usePlaygroundStore();

  const defaultRole = `${node.data.label.toLowerCase().replace(/[^a-z0-9-]/g, '-')}-role`;
  const roleName = config.iamRole || defaultRole;
  const customPolicies: string[] = Array.isArray(config.iamPolicies) ? config.iamPolicies : [];

  const edgePolicies = edges
    .filter((e) => e.source === node.id && e.data?.iamPolicy)
    .flatMap((e) => String(e.data?.iamPolicy).split(',').map((p) => p.trim()))
    .filter(Boolean);

  const handleAddPolicy = (action: string) => {
    if (customPolicies.includes(action)) {
      toast.info('Policy already added');
      return;
    }
    const updated = [...customPolicies, action];
    onChange('iamPolicies', updated);
    toast.success('IAM Policy Added', { description: `Added ${action} (deployed on next deploy)` });
  };

  const handleDeletePolicy = (index: number) => {
    const updated = customPolicies.filter((_, i) => i !== index);
    onChange('iamPolicies', updated);
    toast.info('IAM Policy Removed');
  };

  return (
    <div className="rounded-lg border p-3 space-y-3" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
      <div className="flex items-center gap-1.5 font-semibold text-[11px]" style={{ color: tokens.textPrimary }}>
        <LuShieldCheck className="w-4 h-4 text-purple-400" />
        <span>IAM Role &amp; Access Policies</span>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] uppercase font-mono tracking-wider" style={{ color: tokens.textMuted }}>Assigned IAM Role</label>
        <input
          type="text"
          value={roleName}
          onChange={(e) => onChange('iamRole', e.target.value)}
          placeholder="e.g. ec2-app-role"
          style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textPrimary }}
          className="w-full rounded border px-2 py-1 text-xs font-mono focus:outline-none focus:border-purple-500"
        />
      </div>

      <NodeIamPolicyList edgePolicies={edgePolicies} customPolicies={customPolicies} onDeletePolicy={handleDeletePolicy} />

      <AwsPermissionMultiSelect existingPolicies={customPolicies} serviceType={node.data.serviceType} onAddPolicy={handleAddPolicy} />

      <p className="text-[10px]" style={{ color: tokens.textMuted }}>Select verified AWS IAM actions. Takes effect on next deploy.</p>
    </div>
  );
}