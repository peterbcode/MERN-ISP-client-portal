'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { 
  WifiIcon, 
  GlobeAltIcon, 
  SignalIcon, 
  ClockIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowsPointingOutIcon,
  ChatBubbleLeftRightIcon,
  TicketIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

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
}

interface NetworkStats {
  publicIP: string;
  downloadSpeed: number;
  uploadSpeed: number;
  latency: number;
  networkType: string;
  connectionTime: string;
  lastUpdated: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<NetworkStats>({
    publicIP: 'Detecting...',
    downloadSpeed: 0,
    uploadSpeed: 0,
    latency: 0,
    networkType: 'Detecting...',
    connectionTime: '0:00:00',
    lastUpdated: new Date().toLocaleTimeString()
  });
  const [isSpeedTestRunning, setIsSpeedTestRunning] = useState(false);
  const [testProgress, setTestProgress] = useState('');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!auth.isAuthenticated()) {
          router.push('/login');
          return;
        }

        const response = await auth.getCurrentUser();
        if (response && response.success) {
          setUser(response.user);
        } else {
          auth.clearToken();
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth error:', error);
        auth.clearToken();
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    // Get public IP
    const getPublicIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setStats(prev => ({ ...prev, publicIP: data.ip }));
      } catch (error) {
        console.error('Failed to get IP:', error);
        setStats(prev => ({ ...prev, publicIP: 'Unavailable' }));
      }
    };

    // Get network type
    const getNetworkType = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (connection) {
        const effectiveType = connection.effectiveType || 'Unknown';
        setStats(prev => ({ ...prev, networkType: effectiveType.charAt(0).toUpperCase() + effectiveType.slice(1) }));
      } else {
        setStats(prev => ({ ...prev, networkType: 'Unknown' }));
      }
    };

    // Start connection timer
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      setStats(prev => ({ 
        ...prev, 
        connectionTime: `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` 
      }));
    }, 1000);

    getPublicIP();
    getNetworkType();

    return () => clearInterval(timer);
  }, []);

  const runSpeedTest = async () => {
    setIsSpeedTestRunning(true);
    setTestProgress('Testing latency...');
    
    try {
      // Reset stats
      setStats(prev => ({ ...prev, downloadSpeed: 0, uploadSpeed: 0, latency: 0 }));
      
      // Test latency first (multiple pings for accuracy)
      setTestProgress('Testing latency...');
      const latencyPromises = [];
      for (let i = 0; i < 5; i++) {
        latencyPromises.push(
          fetch('https://httpbin.org/get', { cache: 'no-cache' }).then(() => {
            const start = performance.now();
            return fetch('https://httpbin.org/get', { cache: 'no-cache' }).then(() => {
              const end = performance.now();
              return end - start;
            });
          })
        );
      }
      
      const latencyResults = await Promise.all(latencyPromises);
      const avgLatency = Math.round(latencyResults.reduce((a, b) => a + b, 0) / latencyResults.length);
      
      // Test download speed (multiple concurrent connections)
      setTestProgress('Testing download speed...');
      const downloadStartTime = performance.now();
      const downloadPromises = [];
      
      // Use multiple larger files for better accuracy
      for (let i = 0; i < 3; i++) {
        downloadPromises.push(
          fetch('https://httpbin.org/bytes/5242880', { // 5MB files
            cache: 'no-cache'
          }).then(response => response.blob())
        );
      }
      
      const downloadBlobs = await Promise.all(downloadPromises);
      const downloadEndTime = performance.now();
      
      const totalDownloadSize = downloadBlobs.reduce((total, blob) => total + blob.size, 0);
      const downloadDuration = (downloadEndTime - downloadStartTime) / 1000; // seconds
      const downloadSpeed = (totalDownloadSize / downloadDuration) * 8 / 1024 / 1024; // Mbps
      
      // Test upload speed (using POST requests)
      setTestProgress('Testing upload speed...');
      const uploadStartTime = performance.now();
      const uploadData = new ArrayBuffer(1048576); // 1MB upload
      const uploadPromises = [];
      
      for (let i = 0; i < 2; i++) {
        uploadPromises.push(
          fetch('https://httpbin.org/post', {
            method: 'POST',
            body: uploadData,
            cache: 'no-cache'
          })
        );
      }
      
      await Promise.all(uploadPromises);
      const uploadEndTime = performance.now();
      
      const uploadDuration = (uploadEndTime - uploadStartTime) / 1000;
      const uploadSpeed = (uploadData.byteLength * 2 / uploadDuration) * 8 / 1024 / 1024; // Mbps
      
      setTestProgress('Finalizing results...');
      setStats(prev => ({
        ...prev,
        downloadSpeed: parseFloat((downloadSpeed * 1000).toFixed(3)) / 1000,
        uploadSpeed: parseFloat((uploadSpeed * 1000).toFixed(3)) / 1000,
        latency: avgLatency,
        lastUpdated: new Date().toLocaleTimeString()
      }));
      
      setTimeout(() => setTestProgress(''), 1000);
      
    } catch (error) {
      console.error('Speed test failed:', error);
      setTestProgress('Test failed. Please try again.');
      setTimeout(() => setTestProgress(''), 3000);
    } finally {
      setIsSpeedTestRunning(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/');
    }
  };

  const submitTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      alert('Please fill in both subject and message fields');
      return;
    }

    setIsSubmittingTicket(true);
    
    try {
      // Create ticket locally (in real app, this would save to backend)
      const ticket: SupportTicket = {
        id: Date.now().toString(),
        subject: newTicket.subject,
        message: newTicket.message,
        priority: newTicket.priority,
        status: 'open',
        createdAt: new Date().toISOString()
      };

      setTickets(prev => [ticket, ...prev]);
      setNewTicket({ subject: '', message: '', priority: 'medium' });
      setShowTicketForm(false);
      
      // Open WhatsApp with pre-filled message
      const whatsappMessage = encodeURIComponent(
        `🎫 *New Support Ticket*\n\n` +
        `*From:* ${user?.profile.firstName || user?.username || 'User'} (${user?.email || 'N/A'})\n` +
        `*Priority:* ${newTicket.priority.toUpperCase()}\n` +
        `*Subject:* ${newTicket.subject}\n` +
        `*Message:* ${newTicket.message}\n\n` +
        `*Public IP:* ${stats.publicIP}\n` +
        `*Network Type:* ${stats.networkType}\n` +
        `*Speed Test:* ${stats.downloadSpeed > 0 ? `${stats.downloadSpeed} Mbps` : 'Not run yet'}`
      );
      
      window.open(`https://wa.me/27799381260?text=${whatsappMessage}`, '_blank');
      
    } catch (error) {
      console.error('Failed to submit ticket:', error);
      alert('Failed to submit ticket. Please try again.');
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-zinc-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-400';
      case 'in-progress': return 'text-yellow-400';
      case 'resolved': return 'text-green-400';
      default: return 'text-zinc-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <div className="bg-[#050505] border-b border-zinc-800 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">
              Welcome back, {user.profile.firstName || user.username}!
            </h1>
            <p className="text-zinc-400 text-sm">
              Network performance dashboard
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={runSpeedTest}
              disabled={isSpeedTestRunning}
              className="px-4 py-2 bg-[#f97316] text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSpeedTestRunning ? 'Testing...' : 'Run Speed Test'}
            </button>
            <button
              onClick={() => setShowTicketForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <TicketIcon className="h-4 w-4 mr-2" />
              New Ticket
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Public IP */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <GlobeAltIcon className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-zinc-100 mb-2 break-all">{stats.publicIP}</h3>
            <p className="text-zinc-400 text-sm">Public IP Address</p>
          </div>

          {/* Download Speed */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <ArrowDownIcon className="h-6 w-6 text-green-400" />
                </div>
                {stats.downloadSpeed > 0 && (
                  <span className="text-green-400 text-xs font-medium bg-green-500/20 px-2 py-1 rounded-full">
                    ACTIVE
                  </span>
                )}
              </div>
              <h3 className="text-3xl font-black text-zinc-100 mb-2">
                {stats.downloadSpeed > 0 ? `${stats.downloadSpeed}` : '--'}
                <span className="text-lg font-normal text-zinc-400 ml-1">Mbps</span>
              </h3>
              <p className="text-zinc-400 text-sm mb-2">Download Speed</p>
              {stats.downloadSpeed > 0 && (
                <div className="space-y-2">
                  <div className="w-full bg-zinc-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((stats.downloadSpeed / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-zinc-500">
                    {stats.downloadSpeed >= 50 ? 'Excellent' : 
                     stats.downloadSpeed >= 25 ? 'Good' : 
                     stats.downloadSpeed >= 10 ? 'Fair' : 'Poor'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Upload Speed */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <ArrowUpIcon className="h-6 w-6 text-orange-400" />
                </div>
                {stats.uploadSpeed > 0 && (
                  <span className="text-orange-400 text-xs font-medium bg-orange-500/20 px-2 py-1 rounded-full">
                    ACTIVE
                  </span>
                )}
              </div>
              <h3 className="text-3xl font-black text-zinc-100 mb-2">
                {stats.uploadSpeed > 0 ? `${stats.uploadSpeed}` : '--'}
                <span className="text-lg font-normal text-zinc-400 ml-1">Mbps</span>
              </h3>
              <p className="text-zinc-400 text-sm mb-2">Upload Speed</p>
              {stats.uploadSpeed > 0 && (
                <div className="space-y-2">
                  <div className="w-full bg-zinc-700 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((stats.uploadSpeed / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-zinc-500">
                    {stats.uploadSpeed >= 20 ? 'Excellent' : 
                     stats.uploadSpeed >= 10 ? 'Good' : 
                     stats.uploadSpeed >= 5 ? 'Fair' : 'Poor'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Latency */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <SignalIcon className="h-6 w-6 text-purple-400" />
                </div>
                {stats.latency > 0 && (
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stats.latency <= 20 ? 'text-green-400 bg-green-500/20' :
                    stats.latency <= 50 ? 'text-yellow-400 bg-yellow-500/20' :
                    'text-red-400 bg-red-500/20'
                  }`}>
                    {stats.latency <= 20 ? 'EXCELLENT' :
                     stats.latency <= 50 ? 'GOOD' : 'HIGH'}
                  </span>
                )}
              </div>
              <h3 className="text-3xl font-black text-zinc-100 mb-2">
                {stats.latency > 0 ? `${stats.latency}` : '--'}
                <span className="text-lg font-normal text-zinc-400 ml-1">ms</span>
              </h3>
              <p className="text-zinc-400 text-sm mb-2">Latency (Ping)</p>
              {stats.latency > 0 && (
                <div className="space-y-2">
                  <div className="w-full bg-zinc-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        stats.latency <= 20 ? 'bg-green-500 w-4/5' :
                        stats.latency <= 50 ? 'bg-yellow-500 w-3/5' :
                        'bg-red-500 w-2/5'
                      }`}
                    ></div>
                  </div>
                  <p className="text-xs text-zinc-500">
                    {stats.latency <= 20 ? 'Gaming Ready' : 
                     stats.latency <= 50 ? 'Good for Video' : 'May Lag'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Network Information */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800">
            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-zinc-100 flex items-center">
                <WifiIcon className="h-5 w-5 mr-2 text-[#f97316]" />
                Network Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                <span className="text-zinc-400">Connection Type</span>
                <span className="text-zinc-100 font-medium">{stats.networkType}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                <span className="text-zinc-400">Connection Time</span>
                <span className="text-zinc-100 font-medium">{stats.connectionTime}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-zinc-400">Last Updated</span>
                <span className="text-zinc-100 font-medium">{stats.lastUpdated}</span>
              </div>
            </div>
          </div>

        {/* Support Tickets Section */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center justify-between">
              <span className="flex items-center">
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-[#f97316]" />
                Support Tickets
              </span>
              <button
                onClick={() => setShowTicketForm(true)}
                className="px-3 py-1 bg-[#f97316] text-white text-sm rounded-lg hover:bg-orange-600 transition-colors flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                New Ticket
              </button>
            </h2>
          </div>
          
          <div className="p-6">
            {tickets.length === 0 ? (
              <div className="text-center py-8">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">No support tickets yet. Create your first ticket for any network issues.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority.toUpperCase()}
                          </span>
                          <span className={`text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-white font-medium">{ticket.subject}</h4>
                        <p className="text-zinc-400 text-sm mt-1">{ticket.message}</p>
                      </div>
                      <div className="text-zinc-500 text-xs">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ticket Form Modal */}
      {showTicketForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-xl border border-zinc-700 p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-zinc-100">Create Support Ticket</h3>
              <button
                onClick={() => setShowTicketForm(false)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Priority</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#f97316]"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Subject</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="e.g., WiFi password change, IP configuration issue"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#f97316]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Message</label>
                <textarea
                  value={newTicket.message}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Describe your issue in detail..."
                  rows={4}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#f97316] resize-none"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                <p className="text-zinc-400 text-sm">
                  📱 This will open WhatsApp with your ticket details for quick support
                </p>
                <button
                  onClick={() => window.open('https://wa.me/27799381260', '_blank')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                  Open WhatsApp
                </button>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowTicketForm(false)}
                className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitTicket}
                disabled={isSubmittingTicket}
                className="px-4 py-2 bg-[#f97316] text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingTicket ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
