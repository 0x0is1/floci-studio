'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { AWS_IAM_ACTIONS, IamAction, getRecommendedIamActions } from '@/constants/iamPermissions';
import { LuSearch, LuPlus, LuCheck } from 'react-icons/lu';
import { toast } from 'sonner';

interface Props {
  existingPolicies: string[];
  serviceType?: string;
  onAddPolicy: (action: string) => void;
}

export function AwsPermissionMultiSelect({ existingPolicies, serviceType, onAddPolicy }: Props) {
  const { tokens } = useTheme();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const pool = query.trim() ? AWS_IAM_ACTIONS : getRecommendedIamActions(serviceType);
  const filtered = pool.filter(
    (item) => item.action.toLowerCase().includes(query.toLowerCase()) || item.description.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  const handleSelect = (item: IamAction) => {
    if (existingPolicies.includes(item.action)) {
      toast.info('Policy already added', { description: item.action });
      return;
    }
    onAddPolicy(item.action);
    setQuery('');
    setIsOpen(false);
  };

  const placeholder = serviceType === 'lambda'
    ? 'Search Lambda permissions (e.g. s3:GetObject)...'
    : 'Search AWS permissions (e.g. s3:*, lambda:InvokeFunction)...';

  return (
    <div ref={containerRef} className="relative space-y-1.5 pt-1">
      <div className="relative flex items-center">
        <LuSearch className="absolute left-2.5 w-3 h-3 text-slate-400 pointer-events-none" />
        <input
          type="text" value={query} onFocus={() => setIsOpen(true)}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }} placeholder={placeholder}
          style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, color: tokens.textPrimary }}
          className="w-full rounded border pl-7 pr-2 py-1 text-xs font-mono focus:outline-none focus:border-purple-500"
        />
      </div>

      {isOpen && (
        <div className="absolute z-30 left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-md border shadow-xl p-1 space-y-0.5 text-xs font-mono" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}>
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-[11px] text-slate-400 text-center font-sans">No matching valid AWS permissions found.</div>
          ) : (
            filtered.map((item) => {
              const alreadyAdded = existingPolicies.includes(item.action);
              return (
                <button
                  key={item.action} type="button" onClick={() => handleSelect(item)} disabled={alreadyAdded}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-purple-500/10 text-left transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex flex-col truncate pr-2">
                    <span className="font-semibold text-purple-400 text-[11px]">{item.action}</span>
                    <span className="text-[10px] text-slate-400 font-sans truncate">{item.description}</span>
                  </div>
                  {alreadyAdded ? <LuCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <LuPlus className="w-3 h-3 text-purple-400 shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
