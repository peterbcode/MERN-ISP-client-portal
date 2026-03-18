'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/auth';

const dashboardNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { name: 'Stats', href: '/dashboard/stats', icon: '📊' },
  { name: 'Profile', href: '/dashboard/profile', icon: '👤' },
  { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

interface DashboardSidebarProps {
  showLogout?: boolean;
}

export default function DashboardSidebar({ showLogout = true }: DashboardSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (auth.isAuthenticated()) {
        const response = await auth.getCurrentUser();
        if (response.success) {
          setUser(response.user);
        }
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/');
    }
  };

  return (
    <div className="w-64 bg-zinc-800 min-h-screen border-r border-zinc-700">
      {/* User Profile Section */}
      <div className="p-6 border-b border-zinc-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-2xl">
              {user?.profile?.firstName?.[0] || user?.username?.[0] || '👤'}
            </span>
          </div>
          <h3 className="text-white font-semibold">
            {user?.profile?.firstName || user?.username || 'User'}
          </h3>
          <p className="text-zinc-400 text-sm truncate">
            {user?.email || 'user@example.com'}
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <div className="space-y-2">
          {dashboardNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>

        {/* Logout Section */}
        {showLogout && (
          <div className="mt-8 pt-4 border-t border-zinc-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
            >
              <span className="mr-3 text-lg">🚪</span>
              Logout
            </button>
          </div>
        )}
      </nav>
    </div>
  );
}
