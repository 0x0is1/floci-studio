'use client';

import React from 'react';
import { AwsPaletteItem } from '@/types/aws';
import { AwsIcon } from '@/components/icons/AwsIcons';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  item: AwsPaletteItem;
  onDragStart: (e: React.DragEvent, type: string) => void;
}

export function PaletteItemCard({ item, onDragStart }: Props) {
  const { tokens } = useTheme();

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item.type)}
      style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border, boxShadow: tokens.cardShadow }}
      className="flex items-center gap-2.5 p-2 rounded-lg border hover:border-sky-500 cursor-grab active:cursor-grabbing transition-all group"
    >
      <div
        className="w-8 h-8 rounded-md border flex items-center justify-center overflow-hidden shrink-0 p-0"
        style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}
      >
        <AwsIcon type={item.type} size={28} className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:block" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-xs font-semibold truncate" style={{ color: tokens.textPrimary }}>
            {item.name}
          </span>
          <span
            className="text-[9px] font-mono px-1 py-0.2 rounded border shrink-0 text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
          >
            {item.flociStatus}
          </span>
        </div>
        <p className="text-[10px] truncate" style={{ color: tokens.textMuted }}>
          {item.description}
        </p>
      </div>
    </div>
  );
}