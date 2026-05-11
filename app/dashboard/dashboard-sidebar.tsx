'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/auth';
import {
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  HomeIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const dashboardNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Stats', href: '/dashboard/stats', icon: ChartBarIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserCircleIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
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

  const initial = user?.profile?.firstName?.[0] || user?.username?.[0] || 'U';

  return (
    <div className="w-64 bg-zinc-800 min-h-screen border-r border-zinc-700">
      <div className="p-6 border-b border-zinc-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-2xl font-bold uppercase">{initial}</span>
          </div>
          <h3 className="text-white font-semibold">
            {user?.profile?.firstName || user?.username || 'User'}
          </h3>
          <p className="text-zinc-400 text-sm truncate">
            {user?.email || 'user@example.com'}
          </p>
        </div>
      </div>

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
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </div>

        {showLogout && (
          <div className="mt-8 pt-4 border-t border-zinc-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        )}
      </nav>
    </div>
  );
}
