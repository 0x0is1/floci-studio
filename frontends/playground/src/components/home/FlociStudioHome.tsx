'use client';

import React, { useState } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { HomeNavbar } from './HomeNavbar';
import { HomeProjectsSection } from './HomeProjectsSection';
import { HomeSidebar } from './HomeSidebar';
import { CreateProjectModal } from './CreateProjectModal';

export function FlociStudioHome() {
  const { tokens } = useTheme();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden" style={{ backgroundColor: tokens.canvasBg, color: tokens.textPrimary }}>
      <HomeNavbar />

      <main className="flex-1 overflow-y-auto w-full">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <HomeProjectsSection onCreateClick={() => setCreateModalOpen(true)} />
            </div>

            <div className="lg:col-span-4">
              <HomeSidebar onCreateClick={() => setCreateModalOpen(true)} />
            </div>
          </div>
        </div>
      </main>

      <CreateProjectModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} />
    </div>
  );
}