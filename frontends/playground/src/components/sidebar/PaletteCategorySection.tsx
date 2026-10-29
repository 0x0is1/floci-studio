'use client';

import React from 'react';
import { AwsPaletteItem } from '@/types/aws';
import { useTheme } from '@/theme/ThemeProvider';
import { PaletteItemCard } from './PaletteItemCard';

interface Props {
  categoryName: string;
  items: AwsPaletteItem[];
  onDragStart: (e: React.DragEvent, type: string) => void;
}

export function PaletteCategorySection({ categoryName, items, onDragStart }: Props) {
  const { tokens } = useTheme();

  if (items.length === 0) return null;

  return (
    <div className="space-y-1.5 pt-3 first:pt-1">
      <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: tokens.border }}>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400">
          {categoryName}
        </span>
        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded" style={{ backgroundColor: tokens.cardBgAlt, color: tokens.textMuted }}>
          {items.length}
        </span>
      </div>

      <div className="space-y-1.5 pt-0.5">
        {items.map((item) => (
          <PaletteItemCard key={item.type} item={item} onDragStart={onDragStart} />
        ))}
      </div>
    </div>
  );
}
