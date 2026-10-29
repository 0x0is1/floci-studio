'use client';

import React, { useState, useEffect } from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useTheme } from '@/theme/ThemeProvider';
import { listEc2Keys, generateEc2Key } from '@/lib/api/flociClient';
import { LuKey, LuPlus } from 'react-icons/lu';
import { toast } from 'sonner';
import { Ec2KeyActions } from './Ec2KeyActions';
import { Ec2KeyModal } from './Ec2KeyModal';

interface Props {
  config: Record<string, any>;
  onChange: (key: string, val: any) => void;
}

export function Ec2KeyManager({ config, onChange }: Props) {
  const { activeProjectId } = usePlaygroundStore();
  const { tokens } = useTheme();
  const [keys, setKeys] = useState<Array<{ name: string }>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const projectId = activeProjectId || 'default';

  useEffect(() => {
    listEc2Keys(projectId).then((res) => { if (res?.keys) setKeys(res.keys); }).catch(() => {});
  }, [projectId]);

  const handleCreateKey = async (name: string) => {
    try {
      const res = await generateEc2Key(projectId, name);
      if (res?.success) {
        onChange('keyName', res.key.keyName);
        setKeys((prev) => (prev.some((k) => k.name === res.key.keyName) ? prev : [...prev, { name: res.key.keyName }]));
        toast.success(res.key.reused ? 'Key Selected' : 'SSH Key Generated', { description: `Key: ${res.key.keyName}.pem` });
      }
    } catch {
      toast.error('Failed to generate key pair');
    }
  };

  const selectedKey = config.keyName || 'default-key';
  const allKeys = Array.from(new Set(['default-key', ...keys.map((k) => k.name), selectedKey]));

  return (
    <div className="rounded-lg border p-3 space-y-2.5 transition-colors" style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: tokens.textPrimary }}>
          <LuKey className="w-3.5 h-3.5 text-amber-400" />
          <span>SSH Key &amp; Remote Access</span>
        </span>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          style={{ backgroundColor: tokens.btnBg, borderColor: tokens.border, color: tokens.accent }}
          className="flex items-center gap-1 px-2 py-0.5 rounded border hover:opacity-85 text-[10px] font-medium transition-colors cursor-pointer"
        >
          <LuPlus className="w-3 h-3" />
          <span>New Key</span>
        </button>
      </div>

      <div className="space-y-1">
        <select
          value={selectedKey}
          onChange={(e) => onChange('keyName', e.target.value)}
          style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textPrimary }}
          className="w-full rounded border px-2 py-1 text-xs focus:outline-none"
        >
          {allKeys.map((k) => (
            <option key={k} value={k}>
              {k === 'default-key' ? 'default-key (Project Shared)' : `${k}.pem`}
            </option>
          ))}
        </select>
      </div>

      <Ec2KeyActions projectId={projectId} selectedKey={selectedKey} />
      <Ec2KeyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateKey} />
    </div>
  );
}
