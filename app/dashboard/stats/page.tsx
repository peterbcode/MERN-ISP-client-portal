'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { safeAlert } from '@/lib/native-dialog';
import { runSpeedTest as runLocalSpeedTest, speedColor, speedRating } from '@/lib/speedtest';

interface InternetStats {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  connectionType: string;
  ispName: string;
  planType: string;
  lastSpeedTest: string;
}

export default function StatsPage() {
  const [stats, setStats] = useState<InternetStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpeedTestRunning, setIsSpeedTestRunning] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    priority: 'medium'
  });

  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (!auth.isAuthenticated()) {
        router.push('/login');
        return;
      }

      const response = await auth.getCurrentUser();
      if (response.success) {
        loadStats();
      } else {
        auth.clearToken();
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    }
  };

  const loadStats = async () => {
    try {
      // Use mock data for now
      setStats({
        downloadSpeed: 85.5,
        uploadSpeed: 42.3,
        ping: 12,
        connectionType: 'Fiber',
        ispName: 'Valley Computers ISP',
        planType: 'Premium 500GB',
        lastSpeedTest: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runSpeedTest = async () => {
    setIsSpeedTestRunning(true);
    try {
      if (stats) {
        const result = await runLocalSpeedTest();
        setStats({
          ...stats,
          downloadSpeed: result.downloadMbps,
          uploadSpeed: result.uploadMbps,
          ping: result.latencyMs,
          lastSpeedTest: new Date().toISOString()
        });
        
        safeAlert('Speed test completed successfully!');
      }
    } catch (error) {
      console.error('Speed test failed:', error);
      safeAlert('Speed test failed. Please try again.');
    } finally {
      setIsSpeedTestRunning(false);
    }
  };

  const submitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
      safeAlert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate ticket submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowTicketModal(false);
      setTicketForm({ subject: '', description: '', priority: 'medium' });
      safeAlert('Support ticket submitted successfully! We will contact you soon.');
    } catch (error) {
      console.error('Ticket submission failed:', error);
      safeAlert('Failed to submit ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-white">Loading stats...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Internet Statistics</h1>
        <p className="text-zinc-400">Monitor your connection usage and performance</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-zinc-800 rounded-lg p-6 border border-zinc-700">
            <h2 className="text-xl font-bold text-white mb-4">Connection Overview</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {stats.downloadSpeed.toFixed(3)}
                </div>
                <div className="text-sm text-zinc-400">Download Mbps</div>
                <div className={`text-lg font-medium ${speedColor('download', stats.downloadSpeed)}`}>
                  {speedRating('download', stats.downloadSpeed)}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {stats.uploadSpeed.toFixed(3)}
                </div>
                <div className="text-sm text-zinc-400">Upload Mbps</div>
                <div className={`text-lg font-medium ${speedColor('upload', stats.uploadSpeed)}`}>
                  {speedRating('upload', stats.uploadSpeed)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white mb-1">{stats.ping.toFixed(3)}</div>
                <div className="text-sm text-zinc-400">Ping (ms)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">{stats.connectionType}</div>
                <div className="text-sm text-zinc-400">Connection</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">{stats.planType}</div>
                <div className="text-sm text-zinc-400">Plan</div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-700">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-zinc-400">Last Speed Test</div>
                  <div className="text-white">
                    {new Date(stats.lastSpeedTest).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={runSpeedTest}
                  disabled={isSpeedTestRunning}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSpeedTestRunning ? 'Testing...' : 'Run Speed Test'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
            <h2 className="text-xl font-bold text-white mb-2">Support</h2>
            <p className="text-sm text-zinc-400 mb-4">
              Data usage isn&apos;t connected to a real ISP/router source yet, so it&apos;s hidden to avoid showing incorrect values.
            </p>
            <button
              onClick={() => setShowTicketModal(true)}
              className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Request Plan Change
            </button>
          </div>
        </div>
      )}

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
    </div>
  );
}
