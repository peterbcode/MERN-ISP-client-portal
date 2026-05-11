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
    <div className="flex min-h-screen bg-zinc-900">
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-zinc-800 lg:hidden">
            <DashboardSidebar showLogout={false} />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white lg:hidden"
              aria-label="Close dashboard menu"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </>
      )}

      <div className="hidden lg:block lg:w-64">
        <DashboardSidebar />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-700">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Open dashboard menu"
          >
            <Bars3Icon className="h-5 w-5" />
            Menu
          </button>
        </div>

        <div className="max-w-6xl mx-auto p-4 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
