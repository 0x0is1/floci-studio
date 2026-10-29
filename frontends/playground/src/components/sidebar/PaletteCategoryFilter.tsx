'use client';

import React from 'react';
import { PALETTE_CATEGORIES } from '@/lib/constants/paletteItems';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  categoryCounts: Record<string, number>;
  totalCount: number;
}

export function PaletteCategoryFilter({ selectedCategory, onSelectCategory, categoryCounts, totalCount }: Props) {
  const { tokens } = useTheme();

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
      <button
        type="button"
        onClick={() => onSelectCategory('all')}
        className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer border ${
          selectedCategory === 'all'
            ? 'bg-sky-500 text-slate-950 border-sky-400 font-semibold'
            : 'border-transparent hover:border-slate-700'
        }`}
        style={selectedCategory !== 'all' ? { backgroundColor: tokens.cardBgAlt, color: tokens.textSecondary } : {}}
      >
        <span>All</span>
        <span className="ml-1 text-[10px] opacity-75">({totalCount})</span>
      </button>

      {PALETTE_CATEGORIES.map((cat) => {
        const count = categoryCounts[cat.id] || 0;
        const isActive = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer border ${
              isActive
                ? 'bg-sky-500 text-slate-950 border-sky-400 font-semibold'
                : 'border-transparent hover:border-slate-700'
            }`}
            style={!isActive ? { backgroundColor: tokens.cardBgAlt, color: tokens.textSecondary } : {}}
          >
            <span>{cat.name}</span>
            <span className="ml-1 text-[10px] opacity-75">({count})</span>
          </button>
        );
      })}
    </div>
  );
}