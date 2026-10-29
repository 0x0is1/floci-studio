'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeTokens, DARK_TOKENS, LIGHT_TOKENS } from './tokens';

export type ThemeMode = 'dark' | 'light';

interface ThemeContextValue {
  theme: ThemeMode;
  tokens: ThemeTokens;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const tokens = theme === 'dark' ? DARK_TOKENS : LIGHT_TOKENS;

  useEffect(() => {
    try {
      const saved = localStorage.getItem('floci-theme') as ThemeMode | null;
      if (saved === 'dark' || saved === 'light') setTheme(saved);
    } catch {}
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    root.style.setProperty('--canvas-bg', tokens.canvasBg);
    root.style.setProperty('--card-bg', tokens.cardBg);
    root.style.setProperty('--card-bg-alt', tokens.cardBgAlt);
    root.style.setProperty('--sidebar-bg', tokens.sidebarBg);
    root.style.setProperty('--header-bg', tokens.headerBg);
    root.style.setProperty('--tray-bg', tokens.trayBg);
    root.style.setProperty('--border-color', tokens.border);
    root.style.setProperty('--text-primary', tokens.textPrimary);
    root.style.setProperty('--text-secondary', tokens.textSecondary);
    root.style.setProperty('--text-muted', tokens.textMuted);
    root.style.setProperty('--accent-color', tokens.accent);
    root.style.setProperty('--btn-bg', tokens.btnBg);
    root.style.setProperty('--btn-hover', tokens.btnHover);
    root.style.setProperty('--controls-bg', tokens.controlsBg);
    root.style.setProperty('--dot-color', tokens.dotColor);
    root.style.setProperty('--background', tokens.canvasBg);
    root.style.setProperty('--foreground', tokens.textPrimary);
    if (typeof document !== 'undefined' && document.body) {
      document.body.style.backgroundColor = tokens.canvasBg;
      document.body.style.color = tokens.textPrimary;
    }
  }, [theme, tokens]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('floci-theme', next); } catch {}
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, tokens, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeProvider() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeProvider must be used within ThemeProvider');
  return ctx;
}

export const useTheme = useThemeProvider;
