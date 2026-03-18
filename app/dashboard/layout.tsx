'use client';

import { ReactNode, useState } from 'react';
import DashboardSidebar from './dashboard-sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
          
          {/* Mobile Sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-zinc-800 lg:hidden">
            <DashboardSidebar showLogout={false} />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white lg:hidden"
            >
              ✕
            </button>
          </div>
        </>
      )}

      {/* Desktop Sidebar - Always visible on large screens */}
      <div className="hidden lg:block lg:w-64">
        <DashboardSidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Header with Menu Toggle */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-700">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-zinc-400 hover:text-white"
          >
            ☰ Menu
          </button>
        </div>
        
        <div className="max-w-6xl mx-auto p-4 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
