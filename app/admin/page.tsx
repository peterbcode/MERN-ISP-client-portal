'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "../components/navbar";
import SiteFooter from "../components/site-footer";
import { auth } from '@/lib/auth';

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
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
          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-white">Admin Dashboard</h1>
              <p className="mt-1 lg:mt-2 text-sm lg:text-base text-zinc-400">Manage users, games, and monitor platform activity</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-2 lg:px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm lg:text-base"
            >
              Logout
            </button>
          </div>

          {/* Admin Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">👥</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-zinc-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">✅</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-zinc-400">Active Users</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">🎮</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-zinc-400">Total Games</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">🏆</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-zinc-400">High Scores</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
              Manage Users
            </button>
            <button className="px-6 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors font-medium">
              Manage Games
            </button>
            <button className="px-6 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors font-medium">
              View Leaderboard
            </button>
            <button className="px-6 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors font-medium">
              System Settings
            </button>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
