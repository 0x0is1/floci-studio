'use client';

import React from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { LuWorkflow, LuBoxes, LuLayers, LuCpu } from 'react-icons/lu';

interface Props {
  onCreateClick: () => void;
}

const TEMPLATES = [
  {
    title: 'Standard 3-Tier Web App',
    desc: 'Client -> EC2 Web -> S3 Assets & SQS Queue',
    icon: LuWorkflow,
    badge: 'Starter',
  },
  {
    title: 'Serverless Event Pipeline',
    desc: 'Client -> Lambda -> DynamoDB & CloudWatch',
    icon: LuBoxes,
    badge: 'Serverless',
  },
  {
    title: 'Relational Database Stack',
    desc: 'EC2 App Cluster -> RDS MySQL / Postgres',
    icon: LuLayers,
    badge: 'Database',
  },
];

export function HomeQuickstarts({ onCreateClick }: Props) {
  const { tokens } = useTheme();

  return (
    <div className="rounded-xl border p-4 space-y-3 shadow-xs" style={{ backgroundColor: tokens.cardBg, borderColor: tokens.border }}>
      <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: tokens.border }}>
        <div className="flex items-center gap-2">
          <LuCpu className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold tracking-wide">Architecture Starters</h3>
        </div>
      </div>

      <div className="space-y-2">
        {TEMPLATES.map((tpl) => {
          const Icon = tpl.icon;
          return (
            <div
              key={tpl.title}
              onClick={onCreateClick}
              className="p-2.5 rounded-lg border transition-all hover:border-sky-400/50 hover:scale-[1.01] cursor-pointer space-y-1"
              style={{ backgroundColor: tokens.cardBgAlt, borderColor: tokens.border }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-xs font-semibold" style={{ color: tokens.textPrimary }}>
                    {tpl.title}
                  </span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  {tpl.badge}
                </span>
              </div>
              <p className="text-[11px] leading-tight" style={{ color: tokens.textMuted }}>
                {tpl.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}