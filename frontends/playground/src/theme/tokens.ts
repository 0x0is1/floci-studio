export interface ThemeTokens {
  canvasBg: string;
  cardBg: string;
  cardBgAlt: string;
  sidebarBg: string;
  headerBg: string;
  trayBg: string;
  border: string;
  borderSubtle: string;
  borderFocus: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  btnBg: string;
  btnHover: string;
  accent: string;
  accentHover: string;
  statusRunning: string;
  statusDeploying: string;
  statusError: string;
  statusDraft: string;
  dotColor: string;
  controlsBg: string;
  cardShadow: string;
}

export const DARK_TOKENS: ThemeTokens = {
  canvasBg: '#070a12',
  cardBg: '#0f172a',
  cardBgAlt: '#090d16',
  sidebarBg: '#090d16',
  headerBg: '#090d16',
  trayBg: '#05070e',
  border: '#1e293b',
  borderSubtle: '#141e33',
  borderFocus: '#38bdf8',
  textPrimary: '#f8fafc',
  textSecondary: '#cbd5e1',
  textMuted: '#64748b',
  btnBg: '#1e293b',
  btnHover: '#334155',
  accent: '#38bdf8',
  accentHover: '#0284c7',
  statusRunning: '#10b981',
  statusDeploying: '#f59e0b',
  statusError: '#ef4444',
  statusDraft: '#64748b',
  dotColor: '#334155',
  controlsBg: '#0f172a',
  cardShadow: '0 4px 16px rgba(0, 0, 0, 0.45)',
};

export const LIGHT_TOKENS: ThemeTokens = {
  canvasBg: '#f8fafc',
  cardBg: '#ffffff',
  cardBgAlt: '#f1f5f9',
  sidebarBg: '#ffffff',
  headerBg: '#ffffff',
  trayBg: '#f8fafc',
  border: '#cbd5e1',
  borderSubtle: '#e2e8f0',
  borderFocus: '#0284c7',
  textPrimary: '#0f172a',
  textSecondary: '#334155',
  textMuted: '#64748b',
  btnBg: '#f1f5f9',
  btnHover: '#e2e8f0',
  accent: '#0284c7',
  accentHover: '#0369a1',
  statusRunning: '#059669',
  statusDeploying: '#d97706',
  statusError: '#dc2626',
  statusDraft: '#94a3b8',
  dotColor: '#cbd5e1',
  controlsBg: '#ffffff',
  cardShadow: '0 4px 12px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.05)',
};
