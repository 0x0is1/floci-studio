'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { useServiceHealth } from '@/context/ServiceHealthContext';
import { LuSunMedium, LuMoon } from 'react-icons/lu';

export function HomeNavbar() {
  const { theme, tokens, toggleTheme } = useTheme();
  const { healthState } = useServiceHealth();

  const isHealthy = healthState === 'healthy';
  const badgeColor = isHealthy ? 'bg-emerald-400' : healthState === 'docker_not_running' ? 'bg-amber-400' : 'bg-red-400';
  const badgeText = isHealthy ? 'ONLINE' : healthState === 'docker_not_running' ? 'DOCKER INACTIVE' : 'OFFLINE';
  const textColor = isHealthy ? 'text-emerald-400' : healthState === 'docker_not_running' ? 'text-amber-400' : 'text-red-400';

  return (
    <header className="h-14 border-b px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 transition-colors" style={{ backgroundColor: tokens.headerBg, borderColor: tokens.border }}>
      <div className="flex items-center gap-3">
        <img src="/floci-logo.png" alt="Floci" className="w-7 h-7 object-contain" />
        <span className="font-bold text-sm tracking-wider uppercase" style={{ color: tokens.textPrimary }}>Floci Studio</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-mono" style={{ borderColor: tokens.border, backgroundColor: tokens.cardBgAlt }}>
          <span className={`w-2 h-2 rounded-full ${badgeColor}`} />
          <span style={{ color: tokens.textMuted }}>Services:</span>
          <span className={`${textColor} font-semibold`}>
            {badgeText}
          </span>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          style={{ backgroundColor: tokens.btnBg, borderColor: tokens.border, color: tokens.textPrimary }}
          className="flex items-center gap-1.5 px-3 py-1 rounded border text-xs font-mono uppercase hover:opacity-85 cursor-pointer"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <LuMoon className="w-3.5 h-3.5" /> : <LuSunMedium className="w-3.5 h-3.5" />}
          <span className="text-[10px]">{theme === 'dark' ? 'DARK' : 'LIGHT'}</span>
        </button>
      </div>
    </header>
  );
}
