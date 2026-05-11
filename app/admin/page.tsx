'use client';

import { useEffect, useState } from 'react';
import type { ComponentType, SVGProps } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "../components/navbar";
import SiteFooter from "../components/site-footer";
import { auth } from '@/lib/auth';
import { apiClient } from '@/lib/api-client';
import AdminUsers from './components/admin-users';
import {
  ChartBarIcon,
  TrophyIcon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

type AdminStats = {
  totalUsers: number;
  activeUsers: number;
  totalGames: number;
  totalHighScores: number;
};

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalGames: 0,
    totalHighScores: 0,
  });
  const [statsError, setStatsError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!auth.isAuthenticated()) {
          router.push('/login');
          return;
        }

        const response = await auth.getCurrentUser();
        if (response.success) {
          if (response.user.role !== 'admin') {
            router.push('/dashboard');
            return;
          }
          await loadStats();
        } else {
          auth.clearToken();
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        auth.clearToken();
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const loadStats = async () => {
    setStatsError('');
    try {
      const response = await apiClient.admin.getStats();
      if (response.data?.success) {
        setStats({
          totalUsers: response.data.stats?.totalUsers || 0,
          activeUsers: response.data.stats?.activeUsers || 0,
          totalGames: response.data.stats?.totalGames || 0,
          totalHighScores: response.data.stats?.totalHighScores || 0,
        });
      } else {
        setStatsError(response.data?.message || 'Failed to load admin stats');
      }
    } catch (error: any) {
      setStatsError(error?.message || 'Failed to load admin stats');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-zinc-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-white">Admin Dashboard</h1>
              <p className="mt-1 lg:mt-2 text-sm lg:text-base text-zinc-400">
                Manage users, games, and monitor platform activity
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-2 lg:px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm lg:text-base"
            >
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Users" value={stats.totalUsers} icon={UsersIcon} className="bg-blue-500" />
            <StatCard label="Active Users" value={stats.activeUsers} icon={UserGroupIcon} className="bg-green-500" />
            <StatCard label="Total Games" value={stats.totalGames} icon={ChartBarIcon} className="bg-orange-500" />
            <StatCard label="High Scores" value={stats.totalHighScores} icon={TrophyIcon} className="bg-purple-500" />
          </div>

          {statsError ? <div className="mb-6 text-sm text-red-400">{statsError}</div> : null}

          <AdminUsers />
        </div>
      </div>
      <SiteFooter />
    </>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: number;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  className: string;
}) {
  return (
    <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${className}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="ml-4">
          <p className="text-sm text-zinc-400">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}
