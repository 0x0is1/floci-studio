'use client';

import React, { useState } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { LuKey, LuX, LuPlus } from 'react-icons/lu';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

export function Ec2KeyModal({ isOpen, onClose, onSubmit }: Props) {
  const { tokens } = useTheme();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const keyName = name.trim() || `key-${Date.now().toString().slice(-4)}`;
      await onSubmit(keyName);
      setName('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-xl border p-5 shadow-2xl space-y-4"
        style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textPrimary }}
      >
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: tokens.border }}>
          <div className="flex items-center gap-2">
            <LuKey className="w-4 h-4 text-amber-400" />
            <h2 className="font-semibold text-xs">Generate SSH Key Pair</h2>
          </div>
          <button type="button" onClick={onClose} style={{ color: tokens.textMuted }} className="p-1 rounded hover:opacity-85 cursor-pointer">
            <LuX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono tracking-wider" style={{ color: tokens.textMuted }}>Key Pair Name</label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. dev-cluster-key (leave blank to auto-generate)"
              style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary }}
              className="w-full rounded-md border px-2.5 py-1.5 font-mono text-xs focus:outline-none focus:border-amber-400"
            />
            <p className="text-[10px]" style={{ color: tokens.textMuted }}>
              RSA-2048 private key provisioned for container SSH execution.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              style={{ backgroundColor: tokens.btnBg, borderColor: tokens.border, color: tokens.textPrimary }}
              className="px-3 py-1 rounded border hover:opacity-85 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1 px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold cursor-pointer transition-colors shadow-xs"
            >
              <LuPlus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Generating...' : 'Generate Key'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
