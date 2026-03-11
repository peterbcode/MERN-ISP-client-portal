'use client';

import { useState } from 'react';

interface RouterConfig {
  routerIP: string;
  username: string;
  password: string;
  port: number;
  enableRemote: boolean;
}

export default function RouterSetupModal({ isOpen, onClose, onComplete }) {
  const [config, setConfig] = useState<RouterConfig>({
    routerIP: '192.168.0.1',
    username: 'admin',
    password: '',
    port: 8080,
    enableRemote: false
  });

  const [setupStep, setSetupStep] = useState(1);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const steps = [
    { id: 1, title: 'Router Config', description: 'Basic settings' },
    { id: 2, title: 'Port Forward', description: 'Network setup' },
    { id: 3, title: 'Test Connection', description: 'Verify access' }
  ];

  const testConnection = async () => {
    setIsTesting(true);
    try {
      // Simulate router connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTestResults({
        success: true,
        message: 'Router connection successful!',
        routerInfo: {
          model: 'Tenda AC1200',
          firmware: 'v6.0',
          uptime: '2 days, 14 hours'
        }
      });
    } catch (error) {
      setTestResults({
        success: false,
        message: 'Connection failed. Check settings.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = () => {
    onComplete({
      ...config,
      setupComplete: true,
      configuredAt: new Date().toISOString()
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 rounded-lg border border-zinc-700 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Router Setup</h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step.id <= setupStep ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-zinc-400'
                }`}>
                  {step.id}
                </div>
                <div className="ml-3">
                  <h3 className={`font-medium text-sm ${
                    step.id <= setupStep ? 'text-white' : 'text-zinc-400'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-zinc-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    step.id < setupStep ? 'bg-blue-600' : 'bg-zinc-700'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="space-y-6">
            {setupStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Router Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Router IP Address
                    </label>
                    <input
                      type="text"
                      value={config.routerIP}
                      onChange={(e) => setConfig({...config, routerIP: e.target.value})}
                      className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                      placeholder="192.168.0.1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Admin Username
                    </label>
                    <input
                      type="text"
                      value={config.username}
                      onChange={(e) => setConfig({...config, username: e.target.value})}
                      className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                      placeholder="admin"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Admin Password
                    </label>
                    <input
                      type="password"
                      value={config.password}
                      onChange={(e) => setConfig({...config, password: e.target.value})}
                      className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                      placeholder="Enter router password"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Remote Port
                    </label>
                    <input
                      type="number"
                      value={config.port}
                      onChange={(e) => setConfig({...config, port: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white"
                      placeholder="8080"
                    />
                  </div>
                </div>
                
                <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
                  <h4 className="text-blue-400 font-semibold mb-2">📋 Setup Instructions</h4>
                  <ol className="text-white text-sm space-y-1 list-decimal list-inside">
                    <li>Open browser and go to http://{config.routerIP}</li>
                    <li>Login with admin credentials</li>
                    <li>Go to Advanced Settings → Remote Management</li>
                    <li>Enable remote management on port {config.port}</li>
                    <li>Save settings and restart router</li>
                  </ol>
                </div>
              </div>
            )}

            {setupStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Port Forwarding</h3>
                
                <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Important</h4>
                  <p className="text-white text-sm">
                    Port forwarding allows external access to your router. Ensure your server IP is correct and security is properly configured.
                  </p>
                </div>
                
                <div className="bg-zinc-700 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">Port Forwarding Rules</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-zinc-600">
                      <span className="text-zinc-300">External Port</span>
                      <span className="text-white font-medium">{config.port}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-zinc-600">
                      <span className="text-zinc-300">Internal Port</span>
                      <span className="text-white font-medium">80</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-zinc-300">Server IP</span>
                      <span className="text-white font-medium">192.168.0.100</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {setupStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Test Connection</h3>
                
                <div className="text-center">
                  <button
                    onClick={testConnection}
                    disabled={isTesting}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isTesting ? 'Testing...' : 'Test Router Connection'}
                  </button>
                  
                  {testResults && (
                    <div className={`mt-4 p-4 rounded-lg ${
                      testResults.success ? 'bg-green-500/20 border border-green-500' : 
                      'bg-red-500/20 border border-red-500'
                    }`}>
                      <p className={`font-medium ${
                        testResults.success ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {testResults.message}
                      </p>
                      {testResults.routerInfo && (
                        <div className="mt-2 text-white text-sm">
                          <p>Model: {testResults.routerInfo.model}</p>
                          <p>Firmware: {testResults.routerInfo.firmware}</p>
                          <p>Uptime: {testResults.routerInfo.uptime}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-zinc-700">
            <button
              onClick={() => setSetupStep(Math.max(1, setupStep - 1))}
              disabled={setupStep === 1}
              className="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              Previous
            </button>
            
            {setupStep < 3 ? (
              <button
                onClick={() => setSetupStep(setupStep + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!testResults?.success}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Complete Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
