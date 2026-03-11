'use client';

import { useState, useEffect } from 'react';
import TendaRouterAPI from '@/lib/tenda-router';

export default function RouterManager() {
  const [routerIP, setRouterIP] = useState('192.168.0.1');
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState(null);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const router = new TendaRouterAPI(routerIP);

  useEffect(() => {
    checkRouterConnection();
  }, []);

  const checkRouterConnection = async () => {
    setIsLoading(true);
    try {
      // Try to detect router IP automatically
      const detectedIP = await detectRouterIP();
      if (detectedIP) {
        setRouterIP(detectedIP);
        router.routerIP = detectedIP;
      }

      // Check if router is accessible
      const response = await fetch(`http://${router.routerIP}`);
      if (response.ok) {
        setIsConnected(true);
        await loadRouterStatus();
      } else {
        setError('Router not accessible. Please check IP address.');
      }
    } catch (error) {
      setError('Failed to connect to router: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const detectRouterIP = async () => {
    try {
      // Get local IP and guess router IP
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      const localIP = data.ip;
      
      // Common router IP patterns
      if (localIP.startsWith('192.168.')) {
        return '192.168.0.1';
      } else if (localIP.startsWith('10.0.')) {
        return '10.0.0.1';
      } else if (localIP.startsWith('172.16.')) {
        return '172.16.0.1';
      }
      
      return '192.168.0.1'; // Default
    } catch (error) {
      return null;
    }
  };

  const loadRouterStatus = async () => {
    const statusResult = await router.getStatus();
    if (statusResult.success) {
      setStatus(statusResult.data);
      await loadDevices();
    } else {
      setError(statusResult.error);
    }
  };

  const loadDevices = async () => {
    const devicesResult = await router.getDevices();
    if (devicesResult.success) {
      setDevices(devicesResult.data);
    }
  };

  const handleRouterLogin = async (password) => {
    setIsLoading(true);
    const loginResult = await router.login(password);
    if (loginResult.success) {
      await loadRouterStatus();
      setError('');
    } else {
      setError(loginResult.error);
    }
    setIsLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsLoading(true);
    const changeResult = await router.changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword
    );

    if (changeResult.success) {
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setError('');
      alert('Password changed successfully!');
    } else {
      setError(changeResult.error);
    }
    setIsLoading(false);
  };

  const runSpeedTest = async () => {
    setIsLoading(true);
    try {
      const startTime = Date.now();
      
      // Download test
      const downloadResponse = await fetch('https://speed.cloudflare.com/__down?bytes=100000000', {
        cache: 'no-store'
      });
      const downloadData = await downloadResponse.blob();
      const downloadTime = (Date.now() - startTime) / 1000;
      const downloadSpeed = (downloadData.size * 8) / (downloadTime * 1000000); // Mbps

      // Upload test
      const uploadStartTime = Date.now();
      const uploadData = new Blob([new ArrayBuffer(10000000)]);
      const uploadResponse = await fetch('https://speed.cloudflare.com/__up', {
        method: 'POST',
        body: uploadData,
        cache: 'no-store'
      });
      const uploadTime = (Date.now() - uploadStartTime) / 1000;
      const uploadSpeed = (uploadData.size * 8) / (uploadTime * 1000000); // Mbps

      const speedResult = {
        download: downloadSpeed.toFixed(2),
        upload: uploadSpeed.toFixed(2),
        ping: Math.round(downloadTime / 2), // Approximate
        timestamp: new Date().toISOString()
      };

      // Save speed test result
      localStorage.setItem('lastSpeedTest', JSON.stringify(speedResult));
      
      alert(`Speed Test Complete:\nDownload: ${speedResult.download} Mbps\nUpload: ${speedResult.upload} Mbps\nPing: ${speedResult.ping} ms`);
    } catch (error) {
      setError('Speed test failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Router Management</h1>
          <p className="text-zinc-400">Manage your Tenda router and monitor network performance</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Connection Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
            <h2 className="text-xl font-bold text-white mb-4">Connection Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-zinc-400">Router IP:</span>
                <span className="text-white font-medium">{routerIP}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Status:</span>
                <span className={`font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              {status && (
                <>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">WAN IP:</span>
                    <span className="text-white font-medium">{status.ipAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Uptime:</span>
                    <span className="text-white font-medium">{status.uptime}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Speed Test */}
          <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
            <h2 className="text-xl font-bold text-white mb-4">Speed Test</h2>
            <div className="space-y-4">
              <button
                onClick={runSpeedTest}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Run Speed Test'}
              </button>
              <p className="text-sm text-zinc-400 mt-2">
                Test your internet download and upload speeds
              </p>
            </div>
          </div>

          {/* Password Management */}
          <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
            <h2 className="text-xl font-bold text-white mb-4">Password Management</h2>
            <div className="space-y-4">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Change Router Password
              </button>
              <p className="text-sm text-zinc-400 mt-2">
                Update your router admin password
              </p>
            </div>
          </div>
        </div>

        {/* Connected Devices */}
        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <h2 className="text-xl font-bold text-white mb-4">Connected Devices ({devices.length})</h2>
          {devices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="text-left py-3 px-4">Device Name</th>
                    <th className="text-left py-3 px-4">IP Address</th>
                    <th className="text-left py-3 px-4">MAC Address</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device, index) => (
                    <tr key={index} className="border-b border-zinc-700">
                      <td className="py-3 px-4">{device.name}</td>
                      <td className="py-3 px-4">{device.ip}</td>
                      <td className="py-3 px-4">{device.mac}</td>
                      <td className="py-3 px-4">{device.type}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          device.status === 'Online' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {device.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-zinc-400">No devices detected or not connected to router</p>
          )}
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-white mb-4">Change Router Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
