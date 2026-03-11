'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "../components/navbar";
import SiteFooter from "../components/site-footer";

interface InternetStats {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  totalDataUsed: number;
  dataLimit: number;
  connectionType: string;
  ispName: string;
  planType: string;
  lastSpeedTest: string;
  monthlyUsage: Array<{
    month: string;
    download: number;
    upload: number;
    total: number;
  }>;
}

export default function InternetStats() {
  const [stats, setStats] = useState<InternetStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    priority: 'medium'
  });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        await loadStats();
      } catch (error) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const loadStats = async () => {
    try {
      // Mock data for now
      const mockStats: InternetStats = {
        downloadSpeed: 85.5,
        uploadSpeed: 42.3,
        ping: 12,
        totalDataUsed: 245.6,
        dataLimit: 500,
        connectionType: 'Fiber',
        ispName: 'Valley Computers ISP',
        planType: 'Premium 500GB',
        lastSpeedTest: new Date().toISOString(),
        monthlyUsage: [
          { month: 'Jan 2026', download: 180.2, upload: 20.1, total: 200.3 },
          { month: 'Feb 2026', download: 210.5, upload: 22.8, total: 233.3 },
          { month: 'Mar 2026', download: 245.6, upload: 22.1, total: 267.7 }
        ]
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUsagePercentage = () => {
    if (!stats) return 0;
    return (stats.totalDataUsed / stats.dataLimit) * 100;
  };

  const getUsageColor = () => {
    const percentage = getUsagePercentage();
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getSpeedColor = (speed: number) => {
    if (speed >= 100) return 'text-green-400';
    if (speed >= 50) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const runSpeedTest = async () => {
    setIsLoading(true);
    try {
      // Mock speed test
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      if (stats) {
        const newStats = {
          ...stats,
          downloadSpeed: Math.random() * 50 + 75,
          uploadSpeed: Math.random() * 20 + 35,
          ping: Math.random() * 10 + 8,
          lastSpeedTest: new Date().toISOString()
        };
        setStats(newStats);
      }
      
      alert('Speed test completed successfully!');
    } catch (error) {
      console.error('Speed test failed:', error);
      alert('Speed test failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Mock ticket submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowTicketModal(false);
      setTicketForm({ subject: '', description: '', priority: 'medium' });
      alert('Support ticket submitted successfully! We will contact you soon.');
    } catch (error) {
      console.error('Ticket submission failed:', error);
      alert('Failed to submit ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white">Loading stats...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-zinc-900 py-8 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Internet Statistics</h1>
            <p className="text-zinc-400">Monitor your connection usage and performance</p>
          </div>

          {stats && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Connection Overview */}
              <div className="lg:col-span-2 bg-zinc-800 rounded-lg p-6 border border-zinc-700">
                <h2 className="text-xl font-bold text-white mb-4">Connection Overview</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">
                      {stats.downloadSpeed}
                    </div>
                    <div className="text-sm text-zinc-400">Download Mbps</div>
                    <div className={`text-lg font-medium ${getSpeedColor(stats.downloadSpeed)}`}>
                      {stats.downloadSpeed >= 100 ? 'Excellent' : 
                       stats.downloadSpeed >= 50 ? 'Good' : 
                       stats.downloadSpeed >= 25 ? 'Fair' : 'Poor'}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">
                      {stats.uploadSpeed}
                    </div>
                    <div className="text-sm text-zinc-400">Upload Mbps</div>
                    <div className={`text-lg font-medium ${getSpeedColor(stats.uploadSpeed)}`}>
                      {stats.uploadSpeed >= 50 ? 'Excellent' : 
                       stats.uploadSpeed >= 25 ? 'Good' : 
                       stats.uploadSpeed >= 10 ? 'Fair' : 'Poor'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">{stats.ping}ms</div>
                    <div className="text-sm text-zinc-400">Ping</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">{stats.connectionType}</div>
                    <div className="text-sm text-zinc-400">Connection</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">{stats.ispName}</div>
                    <div className="text-sm text-zinc-400">Provider</div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={runSpeedTest}
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Testing...' : 'Run Speed Test'}
                  </button>
                </div>
              </div>

              {/* Data Usage */}
              <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
                <h2 className="text-xl font-bold text-white mb-4">Data Usage</h2>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-zinc-400">Monthly Usage</span>
                    <span className="text-white">
                      {stats.totalDataUsed.toFixed(1)} GB / {stats.dataLimit} GB
                    </span>
                  </div>
                  
                  <div className="w-full bg-zinc-700 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${getUsageColor()}`}
                      style={{ width: `${getUsagePercentage()}%` }}
                    />
                  </div>
                </div>
                  
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>{getUsagePercentage().toFixed(1)}% used</span>
                  <span>{(stats.dataLimit - stats.totalDataUsed).toFixed(1)} GB remaining</span>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4">
                  <button
                    onClick={() => setShowTicketModal(true)}
                    className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Request Plan Change
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Service Details */}
              <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
                <h2 className="text-xl font-bold text-white mb-4">Service Details</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">ISP Provider:</span>
                    <span className="text-white font-medium">{stats.ispName}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Current Plan:</span>
                    <span className="text-white font-medium">{stats.planType}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Router IP:</span>
                    <span className="text-white font-medium">Your Router IP</span>
                  </div>
                </div>
              </div>

              {/* Monthly Usage Chart */}
              <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
                <h2 className="text-xl font-bold text-white mb-4">Monthly Usage Trend</h2>
                
                <div className="space-y-2">
                  {stats.monthlyUsage.map((month, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-zinc-700 last:border-0">
                      <div>
                        <div className="text-white font-medium">{month.month}</div>
                        <div className="text-sm text-zinc-400">
                          {month.download.toFixed(1)} GB down / {month.upload.toFixed(1)} GB up
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{month.total.toFixed(1)} GB</div>
                        <div className="text-xs text-zinc-400">
                          {((month.total / stats.dataLimit) * 100).toFixed(1)}% of plan
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Support Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Request Service Change</h3>
            
            <form onSubmit={submitTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Subject
                </label>
                <select
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                >
                  <option value="">Select a request type</option>
                  <option value="plan_upgrade">Upgrade Plan</option>
                  <option value="plan_downgrade">Downgrade Plan</option>
                  <option value="speed_issue">Speed Issues</option>
                  <option value="data_limit">Increase Data Limit</option>
                  <option value="technical_support">Technical Support</option>
                  <option value="billing_question">Billing Question</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Description
                </label>
                <textarea
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                  placeholder="Please describe what you'd like to change or any issues you're experiencing..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Priority
                </label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="flex-1 px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <SiteFooter />
    </>
  );
}
