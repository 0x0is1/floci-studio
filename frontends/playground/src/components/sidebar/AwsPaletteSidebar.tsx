'use client';

import React, { useState, useMemo } from 'react';
import { AWS_PALETTE_ITEMS, PALETTE_CATEGORIES } from '@/lib/constants/paletteItems';
import { useTheme } from '@/theme/ThemeProvider';
import { PaletteCategorySection } from './PaletteCategorySection';
import { LuSearch, LuBoxes } from 'react-icons/lu';

export function AwsPaletteSidebar() {
  const [search, setSearch] = useState('');
  const { tokens } = useTheme();

  const filteredItems = useMemo(() => {
    if (!search.trim()) return AWS_PALETTE_ITEMS;
    const q = search.toLowerCase();
    return AWS_PALETTE_ITEMS.filter((item) =>
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }, [search]);

  const onDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('application/floci-node', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-80 border-l flex flex-col h-full shrink-0 select-none transition-colors" style={{ backgroundColor: tokens.sidebarBg, borderColor: tokens.border }}>
      <div className="p-3 border-b space-y-2.5" style={{ borderColor: tokens.border }}>
        <div className="flex items-center justify-between" style={{ color: tokens.textPrimary }}>
          <div className="flex items-center gap-2">
            <LuBoxes className="w-4 h-4 text-sky-400" />
            <span className="text-sm font-semibold tracking-wide">AWS Components</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
            {filteredItems.length} Services
          </span>
        </div>

        <div className="relative">
          <LuSearch className="absolute left-2.5 top-2.5 w-4 h-4" style={{ color: tokens.textMuted }} />
          <input
            type="text"
            placeholder="Search components..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, color: tokens.textPrimary }}
            className="w-full rounded border pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {filteredItems.length === 0 ? (
          <div className="py-8 text-center text-xs space-y-1" style={{ color: tokens.textMuted }}>
            <p>No matching AWS components found.</p>
            <p className="text-[11px] opacity-75">Try another search keyword.</p>
          </div>
        ) : (
          PALETTE_CATEGORIES.map((cat) => {
            const catItems = filteredItems.filter((i) => i.category === cat.id);
            return (
              <PaletteCategorySection
                key={cat.id}
                categoryName={cat.name}
                items={catItems}
                onDragStart={onDragStart}
              />
            );
          })
        )}
      </div>
    </aside>
  );
}