'use client';

import React from 'react';
import Link from 'next/link';
import { LuCircleAlert, LuRotateCw, LuHouse } from 'react-icons/lu';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="h-screen w-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 select-none">
      <div className="w-full max-w-md bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <LuCircleAlert className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight">Application Error</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            An unexpected error occurred while rendering the canvas interface.
          </p>
        </div>
        {error?.message && (
          <div className="w-full rounded-lg border px-3 py-2 text-left bg-zinc-900/80 border-zinc-800 text-[11px] font-mono text-rose-400 truncate">
            {error.message}
          </div>
        )}
        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <LuRotateCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/projects"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-zinc-700 hover:bg-zinc-800/50 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <LuHouse className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
