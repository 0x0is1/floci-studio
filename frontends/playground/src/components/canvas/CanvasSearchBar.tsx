'use client';

import React, { useState } from 'react';
import { usePlaygroundStore } from '@/store/playgroundStore';
import { useReactFlow } from '@xyflow/react';
import { useTheme } from '@/theme/ThemeProvider';
import { LuSearch, LuX } from 'react-icons/lu';

export function CanvasSearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { nodes, selectNode } = usePlaygroundStore();
  const { setCenter } = useReactFlow();
  const { tokens } = useTheme();

  const matches = query.trim()
    ? nodes.filter((n) =>
        n.data.label.toLowerCase().includes(query.toLowerCase()) ||
        n.data.serviceType.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (nodeId: string, x: number, y: number) => {
    selectNode(nodeId);
    setCenter(x + 90, y + 45, { zoom: 1.2, duration: 600 });
    setIsOpen(false);
    setQuery('');
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{ backgroundColor: tokens.btnBg, borderColor: tokens.border, color: tokens.textSecondary }}
        className="absolute top-3 right-4 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium shadow-sm hover:opacity-85 cursor-pointer"
        title="Search canvas nodes"
      >
        <LuSearch className="w-3.5 h-3.5" />
        <span>Search</span>
      </button>
    );
  }

  return (
    <div
      style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border, boxShadow: tokens.cardShadow }}
      className="absolute top-3 right-4 z-20 w-64 rounded-lg border p-2 space-y-2 shadow-lg"
    >
      <div className="flex items-center gap-2">
        <LuSearch className="w-4 h-4 shrink-0" style={{ color: tokens.textMuted }} />
        <input
          type="text"
          autoFocus
          placeholder="Find node by name or type..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary }}
          className="flex-1 rounded border px-2 py-1 text-xs focus:outline-none focus:border-sky-500"
        />
        <button
          type="button"
          onClick={() => { setIsOpen(false); setQuery(''); }}
          style={{ color: tokens.textMuted }}
          className="p-1 rounded hover:opacity-85 cursor-pointer"
        >
          <LuX className="w-3.5 h-3.5" />
        </button>
      </div>

      {matches.length > 0 && (
        <div className="max-h-40 overflow-y-auto space-y-1 pt-1 border-t" style={{ borderColor: tokens.border }}>
          {matches.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => handleSelect(m.id, m.position.x, m.position.y)}
              style={{ color: tokens.textPrimary }}
              className="w-full flex items-center justify-between p-1.5 rounded text-left text-xs hover:bg-sky-500/10 cursor-pointer"
            >
              <span className="font-medium truncate">{m.data.label}</span>
              <span className="text-[10px] uppercase font-mono" style={{ color: tokens.textMuted }}>{m.data.serviceType}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

