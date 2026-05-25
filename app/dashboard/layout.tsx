'use client';

import { ReactNode, useState } from 'react';
import DashboardSidebar from './dashboard-sidebar';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#08090b] text-zinc-100">
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 z-50 w-[min(18rem,calc(100vw-1rem))] border-r border-white/10 bg-[#0c0d10] shadow-2xl lg:hidden">
            <DashboardSidebar showLogout={false} />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white lg:hidden"
              aria-label="Close dashboard menu"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </>
      )}

      <div className="hidden lg:block lg:w-72 lg:shrink-0">
        <DashboardSidebar />
      </div>

      <div className="min-w-0 flex-1 overflow-auto">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#08090b]/85 p-4 backdrop-blur-xl lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-200 hover:bg-white/10"
            aria-label="Open dashboard menu"
          >
            <Bars3Icon className="h-5 w-5" />
            Menu
          </button>
          <span className="text-sm font-semibold text-zinc-300">Client Portal</span>
        </div>

        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
