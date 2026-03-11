'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "../components/navbar";
import SiteFooter from "../components/site-footer";
import { auth } from '@/lib/auth';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalGames: number;
  totalHighScores: number;
  recentUsers: Array<{
    username: string;
    email: string;
    profile: {
      firstName?: string;
      lastName?: string;
    };
    stats: {
      accountCreated: string;
    };
  }>;
  topGames: Array<{
    name: string;
    category: string;
    stats: {
      totalPlays: number;
      highestScore: number;
    };
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
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
          await fetchAdminStats();
        } else {
          auth.clearToken();
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        auth.clearToken();
        router.push('/login');
      }
    };

    const fetchAdminStats = async () => {
      try {
        const token = auth.getToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        } else {
          setError('Failed to fetch admin statistics');
        }
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
        setError('Failed to fetch admin statistics');
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

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-zinc-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
                <p className="mt-2 text-zinc-400">Manage users, games, and monitor platform activity</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">👥</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-zinc-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
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
                  <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
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
                  <p className="text-sm text-zinc-400">Total Games - remove this!</p>
                  <p className="text-2xl font-bold text-white">{stats.totalGames}</p>
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
                  <p className="text-2xl font-bold text-white">{stats.totalHighScores}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Users */}
            <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
              <h2 className="text-xl font-bold text-white mb-4">Recent Users</h2>
              {stats.recentUsers.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentUsers.map((user, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-zinc-700 last:border-0">
                      <div>
                        <p className="text-white font-medium">{user.username}</p>
                        <p className="text-sm text-zinc-400">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-zinc-400">
                          {new Date(user.stats.accountCreated).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-400">No recent users</p>
              )}
            </div>

            {/* Top Games */}
            <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
              <h2 className="text-xl font-bold text-white mb-4">Top Games</h2>
              {stats.topGames.length > 0 ? (
                <div className="space-y-3">
                  {stats.topGames.map((game, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-zinc-700 last:border-0">
                      <div>
                        <p className="text-white font-medium">{game.name}</p>
                        <p className="text-sm text-zinc-400">{game.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-500">{game.stats.totalPlays}</p>
                        <p className="text-xs text-zinc-400">plays</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-400">No games available</p>
              )}
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

// Remove duplicate export - AdminDashboard is already exported above
