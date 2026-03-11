'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RouterSetupModal from "./router-setup-modal";
import { auth } from '@/lib/auth';

interface User {
  id: string;
  username: string;
  email: string;
  profile: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
  };
  stats: {
    loginCount: number;
    lastLogin: string;
    accountCreated: string;
  };
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRouterSetup, setShowRouterSetup] = useState(false);
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
          setUser(response.user);
        } else {
          auth.clearToken();
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth error:', error);
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
      console.error('Logout error:', error);
      router.push('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <div className="bg-zinc-800 border-b border-zinc-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user.profile.firstName || user.username}!
            </h1>
            <p className="text-zinc-400 text-sm">
              Manage your WiFi service and get support from Valley Computers
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
            <button
              onClick={() => setShowRouterSetup(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Router Setup
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Service Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <span className="text-2xl">🌐</span>
              </div>
              <span className="text-green-400 text-sm font-medium">Active</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Online</h3>
            <p className="text-zinc-400 text-sm">Internet Status</p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <span className="text-2xl">📶</span>
              </div>
              <span className="text-green-400 text-sm font-medium">Good</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">85.5</h3>
            <p className="text-zinc-400 text-sm">Speed (Mbps)</p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <span className="text-yellow-400 text-sm font-medium">245GB</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">49%</h3>
            <p className="text-zinc-400 text-sm">Data Used</p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <span className="text-2xl">🎫</span>
              </div>
              <span className="text-green-400 text-sm font-medium">0</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Open</h3>
            <p className="text-zinc-400 text-sm">Support Tickets</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service Overview */}
          <div className="lg:col-span-2 bg-zinc-800 rounded-xl border border-zinc-700">
            <div className="p-6 border-b border-zinc-700">
              <h2 className="text-xl font-bold text-white">Service Overview</h2>
              <p className="text-zinc-400 text-sm mt-1">Your WiFi connection and service details</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-zinc-700/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg">✅</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Connection Status</h4>
                      <p className="text-zinc-400 text-sm">Your internet is working properly</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-medium">Connected</p>
                    <p className="text-zinc-400 text-xs">Since 8:30 AM</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-700/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📡</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Router Information</h4>
                      <p className="text-zinc-400 text-sm">Tenda AC1200 - 192.168.0.1</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">Configured</p>
                    <p className="text-zinc-400 text-xs">3 days ago</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-700/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📱</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Connected Devices</h4>
                      <p className="text-zinc-400 text-sm">12 devices currently connected</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">12</p>
                    <p className="text-zinc-400 text-xs">Active</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-700/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📋</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Service Plan</h4>
                      <p className="text-zinc-400 text-sm">Premium 500GB - Fiber Connection</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">Active</p>
                    <p className="text-zinc-400 text-xs">Since Jan 15</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-zinc-800 rounded-xl border border-zinc-700">
            <div className="p-6 border-b border-zinc-700">
              <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-4">
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-left">
                <span className="mr-2">🎫</span> Create Support Ticket
              </button>
              <button className="w-full px-4 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors text-left">
                <span className="mr-2">📊</span> View Internet Stats
              </button>
              <button className="w-full px-4 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors text-left">
                <span className="mr-2">🌐</span> Router Management
              </button>
              <button className="w-full px-4 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors text-left">
                <span className="mr-2">👤</span> Update Profile
              </button>
              <button className="w-full px-4 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors text-left">
                <span className="mr-2">💳</span> View Billing
              </button>
              <button className="w-full px-4 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors text-left">
                <span className="mr-2">📞</span> Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Recent Support Tickets */}
          <div className="bg-zinc-800 rounded-xl border border-zinc-700">
            <div className="p-6 border-b border-zinc-700">
              <h2 className="text-xl font-bold text-white">Recent Support Tickets</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-zinc-700/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">Router Setup Help</h4>
                    <p className="text-zinc-400 text-sm">Resolved - Technician assisted with configuration</p>
                  </div>
                  <span className="text-green-400 text-sm">Closed</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-zinc-700/50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">Slow Internet Speed</h4>
                    <p className="text-zinc-400 text-sm">In progress - Awaiting technician visit</p>
                  </div>
                  <span className="text-yellow-400 text-sm">Pending</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-zinc-700/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">WiFi Password Reset</h4>
                    <p className="text-zinc-400 text-sm">Resolved - Password successfully changed</p>
                  </div>
                  <span className="text-green-400 text-sm">Closed</span>
                </div>
              </div>
              <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                View All Tickets
              </button>
            </div>
          </div>

          {/* Network Performance */}
          <div className="bg-zinc-800 rounded-xl border border-zinc-700">
            <div className="p-6 border-b border-zinc-700">
              <h2 className="text-xl font-bold text-white">Network Performance</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-zinc-700/50 rounded-lg">
                  <span className="text-zinc-300">Download Speed</span>
                  <span className="text-green-400 font-medium">85.5 Mbps</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-zinc-700/50 rounded-lg">
                  <span className="text-zinc-300">Upload Speed</span>
                  <span className="text-green-400 font-medium">42.3 Mbps</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-zinc-700/50 rounded-lg">
                  <span className="text-zinc-300">Ping (Latency)</span>
                  <span className="text-green-400 font-medium">12 ms</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-zinc-700/50 rounded-lg">
                  <span className="text-zinc-300">Data Usage This Month</span>
                  <span className="text-yellow-400 font-medium">245.6 GB / 500 GB</span>
                </div>
              </div>
              <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Run Speed Test
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Router Setup Modal */}
      <RouterSetupModal 
        isOpen={showRouterSetup}
        onClose={() => setShowRouterSetup(false)}
        onComplete={(config: any) => {
          console.log('Router setup completed:', config);
        }}
      />
    </div>
  );
}
