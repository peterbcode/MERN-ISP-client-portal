'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { safeAlert } from '@/lib/native-dialog';
import { runSpeedTest as runLocalSpeedTest } from '@/lib/speedtest';
import { 
  WifiIcon, 
  GlobeAltIcon, 
  SignalIcon, 
  ArrowDownIcon,
  ArrowUpIcon,
  ChatBubbleLeftRightIcon,
  TicketIcon,
  PlusIcon,
  XMarkIcon,
  ArrowPathIcon,
  BoltIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
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

      const result = await runLocalSpeedTest({ onProgress: setTestProgress });
      
      setStats(prev => ({
        ...prev,
        downloadSpeed: result.downloadMbps,
        uploadSpeed: result.uploadMbps,
        latency: result.latencyMs,
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
      safeAlert('Please fill in both subject and message fields');
      return;
    }

    setIsSubmittingTicket(true);
    
    try {
      // Ensure we have a speed test result before sending (so support can see it).
      let speedResult = {
        downloadMbps: stats.downloadSpeed,
        uploadMbps: stats.uploadSpeed,
        latencyMs: stats.latency,
      };

      const hasSpeedTest =
        Number.isFinite(speedResult.downloadMbps) &&
        Number.isFinite(speedResult.uploadMbps) &&
        Number.isFinite(speedResult.latencyMs) &&
        speedResult.downloadMbps > 0 &&
        speedResult.uploadMbps > 0 &&
        speedResult.latencyMs > 0;

      if (!hasSpeedTest) {
        setIsSpeedTestRunning(true);
        setTestProgress('Testing latency...');
        try {
          const result = await runLocalSpeedTest({ onProgress: setTestProgress });
          speedResult = result;
          setStats((prev) => ({
            ...prev,
            downloadSpeed: result.downloadMbps,
            uploadSpeed: result.uploadMbps,
            latency: result.latencyMs,
            lastUpdated: new Date().toLocaleTimeString(),
          }));
          setTimeout(() => setTestProgress(''), 1000);
        } catch (error) {
          console.error('Speed test failed:', error);
          safeAlert('Speed test failed. Please run a speed test and try submitting the ticket again.');
          return;
        } finally {
          setIsSpeedTestRunning(false);
        }
      }

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
      
      // Ask the server what IP it observes for this user (more reliable than client-side guessing).
      let observedIp: string | null = null;
      try {
        const ipRes = await fetch('/api/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject: ticket.subject }),
          cache: 'no-store'
        });
        const ipData = await ipRes.json();
        if (ipData?.success) observedIp = ipData.observedIp || null;
      } catch {
        // ignore IP lookup failures
      }

      // Open WhatsApp with pre-filled message
      const whatsappMessage = encodeURIComponent(
        `*New Support Ticket*\n\n` +
        `*From:* ${user?.profile.firstName || user?.username || 'User'} (${user?.email || 'N/A'})\n` +
        `*Priority:* ${newTicket.priority.toUpperCase()}\n` +
        `*Subject:* ${newTicket.subject}\n` +
        `*Message:* ${newTicket.message}\n\n` +
        `*Observed IP:* ${observedIp || 'Unknown'}\n` +
        `*Public IP (ipify):* ${stats.publicIP}\n` +
        `*Network Type:* ${stats.networkType}\n` +
        `*Speed Test:* Down ${speedResult.downloadMbps} Mbps / Up ${speedResult.uploadMbps} Mbps / ${speedResult.latencyMs} ms`
      );
      
      window.open(`https://wa.me/27799381260?text=${whatsappMessage}`, '_blank');
      
    } catch (error) {
      console.error('Failed to submit ticket:', error);
      safeAlert('Failed to submit ticket. Please try again.');
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-orange-400';
      case 'low': return 'text-green-400';
      default: return 'text-zinc-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-400';
      case 'in-progress': return 'text-orange-400';
      case 'resolved': return 'text-green-400';
      default: return 'text-zinc-400';
    }
  };

  const getSpeedLabel = (speed: number, type: 'download' | 'upload') => {
    const excellent = type === 'download' ? 50 : 20;
    const good = type === 'download' ? 25 : 10;
    const fair = type === 'download' ? 10 : 5;

    if (speed <= 0) return 'Not tested';
    if (speed >= excellent) return 'Excellent';
    if (speed >= good) return 'Good';
    if (speed >= fair) return 'Fair';
    return 'Needs attention';
  };

  const getLatencyLabel = (latency: number) => {
    if (latency <= 0) return 'Not tested';
    if (latency <= 20) return 'Excellent';
    if (latency <= 50) return 'Good';
    return 'High';
  };

  const metricCards = [
    {
      label: 'Public IP',
      value: stats.publicIP,
      sublabel: 'Detected from this connection',
      icon: GlobeAltIcon,
      accent: 'text-sky-300',
      iconBg: 'bg-sky-500/10',
      valueClass: 'break-all text-xl',
    },
    {
      label: 'Download',
      value: stats.downloadSpeed > 0 ? stats.downloadSpeed.toString() : '--',
      unit: 'Mbps',
      sublabel: getSpeedLabel(stats.downloadSpeed, 'download'),
      icon: ArrowDownIcon,
      accent: 'text-emerald-300',
      iconBg: 'bg-emerald-500/10',
      progress: Math.min(stats.downloadSpeed, 100),
      progressColor: 'bg-emerald-400',
    },
    {
      label: 'Upload',
      value: stats.uploadSpeed > 0 ? stats.uploadSpeed.toString() : '--',
      unit: 'Mbps',
      sublabel: getSpeedLabel(stats.uploadSpeed, 'upload'),
      icon: ArrowUpIcon,
      accent: 'text-orange-300',
      iconBg: 'bg-orange-500/10',
      progress: Math.min(stats.uploadSpeed * 2, 100),
      progressColor: 'bg-orange-400',
    },
    {
      label: 'Latency',
      value: stats.latency > 0 ? stats.latency.toString() : '--',
      unit: 'ms',
      sublabel: getLatencyLabel(stats.latency),
      icon: SignalIcon,
      accent: 'text-violet-300',
      iconBg: 'bg-violet-500/10',
      progress: stats.latency > 0 ? Math.max(12, 100 - Math.min(stats.latency, 100)) : 0,
      progressColor: stats.latency <= 20 ? 'bg-emerald-400' : stats.latency <= 50 ? 'bg-orange-400' : 'bg-red-400',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-zinc-300">
          Loading your portal...
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="space-y-6 text-white">
      <section className="overflow-hidden rounded-lg border border-white/10 bg-[#101114]">
        <div className="border-b border-white/10 bg-gradient-to-r from-orange-500/12 via-sky-500/8 to-emerald-500/10 px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Service online
              </div>
              <h1 className="heading-compact text-2xl font-bold text-white sm:text-3xl">
                Welcome back, {user.profile.firstName || user.username}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                Monitor your connection, run a quick speed test, and send support everything they need in one place.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:min-w-[520px]">
              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <p className="text-xs text-zinc-500">Connection</p>
                <p className="mt-1 truncate text-sm font-semibold text-zinc-100">{stats.networkType}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <p className="text-xs text-zinc-500">Session</p>
                <p className="mt-1 text-sm font-semibold text-zinc-100">{stats.connectionTime}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <p className="text-xs text-zinc-500">Updated</p>
                <p className="mt-1 text-sm font-semibold text-zinc-100">{stats.lastUpdated}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metricCards.map((card) => (
              <div key={card.label} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.iconBg}`}>
                    <card.icon className={`h-5 w-5 ${card.accent}`} />
                  </div>
                  <span className={`min-w-0 max-w-[70%] truncate rounded-md bg-white/5 px-2 py-1 text-xs font-medium ${card.accent}`}>
                    {card.sublabel}
                  </span>
                </div>
                <p className="text-sm text-zinc-500">{card.label}</p>
                <div className="mt-2 flex items-end gap-2">
                  <p className={`heading-compact font-bold text-white ${card.valueClass || 'text-3xl'}`}>{card.value}</p>
                  {card.unit && <span className="pb-1 text-sm font-medium text-zinc-500">{card.unit}</span>}
                </div>
                {typeof card.progress === 'number' && (
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className={`h-full rounded-full ${card.progressColor}`} style={{ width: `${card.progress}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {testProgress && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-orange-400/20 bg-orange-400/10 px-4 py-3 text-sm text-orange-200">
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
              {testProgress}
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={runSpeedTest}
              disabled={isSpeedTestRunning}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <BoltIcon className="h-4 w-4" />
              {isSpeedTestRunning ? 'Testing connection...' : 'Run Speed Test'}
            </button>
            <button
              onClick={() => setShowTicketForm(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 sm:w-auto"
            >
              <TicketIcon className="h-4 w-4" />
              New Ticket
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/5 hover:text-white sm:ml-auto sm:w-auto"
            >
              Logout
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1.15fr]">
        <section className="rounded-lg border border-white/10 bg-[#101114]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className="heading-compact flex items-center gap-2 text-base font-semibold text-white">
              <WifiIcon className="h-5 w-5 text-orange-300" />
              Network Information
            </h2>
          </div>
          <div className="divide-y divide-white/10 px-4 sm:px-5">
            {[
              { label: 'Connection Type', value: stats.networkType, icon: ShieldCheckIcon },
              { label: 'Connection Time', value: stats.connectionTime, icon: ClockIcon },
              { label: 'Last Updated', value: stats.lastUpdated, icon: CheckCircleIcon },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                    <item.icon className="h-4 w-4 text-zinc-400" />
                  </div>
                  <span className="text-sm text-zinc-400">{item.label}</span>
                </div>
                <span className="break-all text-sm font-semibold text-zinc-100 sm:text-right">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-[#101114]">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
            <h2 className="heading-compact flex items-center gap-2 text-base font-semibold text-white">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-orange-300" />
              Support Tickets
            </h2>
            <button
              onClick={() => setShowTicketForm(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              <PlusIcon className="h-4 w-4" />
              New
            </button>
          </div>

          <div className="p-4 sm:p-5">
            {tickets.length === 0 ? (
              <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] px-5 py-8 text-center">
                <TicketIcon className="mx-auto mb-3 h-10 w-10 text-zinc-600" />
                <h3 className="heading-compact text-base font-semibold text-white">No open tickets</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500">
                  Start a support request and your latest connection details will be prepared for the team.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                    <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <span className={`rounded-md bg-white/5 px-2 py-1 text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority.toUpperCase()}
                          </span>
                          <span className={`rounded-md bg-white/5 px-2 py-1 text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-white">{ticket.subject}</h4>
                        <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{ticket.message}</p>
                      </div>
                      <div className="text-xs text-zinc-500 sm:text-right">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {showTicketForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-0 backdrop-blur-sm sm:p-4">
          <div className="flex h-full w-full flex-col border border-white/10 bg-[#101114] shadow-2xl sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-lg">
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 p-5">
              <div>
                <h3 className="heading-compact text-lg font-semibold text-white">Create Support Ticket</h3>
                <p className="mt-1 max-w-[16rem] text-sm text-zinc-500 sm:max-w-none">A speed test will run first if no current result is available.</p>
              </div>
              <button
                onClick={() => setShowTicketForm(false)}
                className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                aria-label="Close ticket form"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                    className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">Subject</label>
                  <input
                    type="text"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="e.g., WiFi password change, IP configuration issue"
                    className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-3 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">Message</label>
                  <textarea
                    value={newTicket.message}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Describe your issue in detail..."
                    rows={6}
                    className="w-full resize-none rounded-lg border border-white/10 bg-zinc-900 px-3 py-3 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="shrink-0 border-t border-white/10 p-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowTicketForm(false)}
                  className="w-full rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold text-zinc-200 hover:bg-white/5 sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={submitTicket}
                  disabled={isSubmittingTicket}
                  className="w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {isSubmittingTicket ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
