'use client';

import React from 'react';
import Image from 'next/image';
import { Wifi, WifiOff } from 'lucide-react';

interface SplashHeaderProps {
  isOffline: boolean;
}

export function SplashHeader({ isOffline }: SplashHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center mb-6">
      <div className="relative w-16 h-16 mb-3">
        <Image
          src="/floci-logo.png"
          alt="Floci Logo"
          width={64}
          height={64}
          priority
          className="object-contain"
        />
      </div>
      <h1 className="text-xl font-bold tracking-tight text-zinc-100">Floci Studio</h1>
      <p className="text-xs text-zinc-400 mt-1">AWS Visual Cloud Infrastructure Playground</p>
      <div className="mt-2.5">
        {isOffline ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-950/40 text-amber-300 border border-amber-800/60">
            <WifiOff className="w-3 h-3" /> Local Offline Mode
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-800/60">
            <Wifi className="w-3 h-3" /> Connected
          </span>
        )}
      </div>
    </div>
  );
}

