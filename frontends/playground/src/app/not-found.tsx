'use client';

import React from 'react';
import Link from 'next/link';
import { LuFileQuestion, LuArrowLeft } from 'react-icons/lu';

export default function NotFound() {
  return (
    <main className="h-screen w-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 select-none">
      <div className="w-full max-w-md bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-sky-500/10 border border-sky-500/20 text-sky-400">
          <LuFileQuestion className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight">Page Not Found</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The requested project canvas or route could not be found or has been removed.
          </p>
        </div>
        <Link
          href="/projects"
          className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer w-full"
        >
          <LuArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Projects</span>
        </Link>
      </div>
    </main>
  );
}

