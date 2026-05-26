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

  const avatar = user?.profile?.avatar;
  const initial = user?.profile?.firstName?.[0] || user?.username?.[0] || 'U';
  const displayName = user?.profile?.firstName || user?.username || 'Client';

  return (
    <aside className="flex min-h-screen w-full flex-col border-r border-white/10 bg-[#0c0d10]">
      <div className="border-b border-white/10 p-5">
        <Link href="/" className="mb-6 flex min-w-0 items-center gap-3 pr-10 text-white no-accent-hover lg:pr-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-sm font-black text-white shadow-lg shadow-orange-500/20">
            VC
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight text-white">Valley Computers Client portal</p>
            <p className="text-xs text-zinc-500">Customer dashboard</p>
          </div>
        </Link>

        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 overflow-hidden rounded-lg bg-gradient-to-br from-orange-500 to-amber-400">
              {avatar ? (
                <span
                  className="block h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${JSON.stringify(avatar)})` }}
                  aria-hidden="true"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-lg font-bold uppercase text-white">{initial}</span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-white">{displayName}</h3>
              <p className="truncate text-xs text-zinc-500">{user?.email || 'Signed in'}</p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-md bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
            <span>Service status</span>
            <span className="font-semibold">Online</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {dashboardNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/15'
                  : 'text-zinc-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </div>

        {showLogout && (
          <div className="mt-8 border-t border-white/10 pt-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200"
            >
              <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        )}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <p className="text-xs font-medium text-zinc-300">Need support?</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">Create a ticket with your latest network test attached.</p>
        </div>
      </div>
    </aside>
  );
}
