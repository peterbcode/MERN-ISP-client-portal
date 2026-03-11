const express = require('express');
const router = express.Router();
const TendaRouterAPI = require('../lib/tenda-router');

// Get router status
router.get('/status', async (req, res) => {
  try {
    const { routerIP } = req.query;
    const tenda = new TendaRouterAPI(routerIP);
    
    // Try to login with default password (you should make this configurable)
    const loginResult = await tenda.login('admin'); // Default Tenda password
    
    if (loginResult.success) {
      const statusResult = await tenda.getStatus();
      res.json({
        success: true,
        data: statusResult
      });
    } else {
      res.json({
        success: false,
        message: 'Failed to authenticate with router'
      });
    }
  } catch (error) {
    console.error('Router status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get router status'
    });
  }
});

// Get connected devices
router.get('/devices', async (req, res) => {
  try {
    const { routerIP } = req.query;
    const tenda = new TendaRouterAPI(routerIP);
    
    const loginResult = await tenda.login('admin');
    
    if (loginResult.success) {
      const devicesResult = await tenda.getDevices();
      res.json({
        success: true,
        data: devicesResult
      });
    } else {
      res.json({
        success: false,
        message: 'Failed to authenticate with router'
      });
    }
  } catch (error) {
    console.error('Router devices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get devices'
    });
  }
});

// Change router password
router.post('/password', async (req, res) => {
  try {
    const { routerIP, oldPassword, newPassword } = req.body;
    
    if (!routerIP || !oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    const tenda = new TendaRouterAPI(routerIP);
    
    // First authenticate with old password
    const loginResult = await tenda.login(oldPassword);
    
    if (loginResult.success) {
      const changeResult = await tenda.changePassword(oldPassword, newPassword);
      res.json(changeResult);
    } else {
      res.json({
        success: false,
        message: 'Invalid current password'
      });
    }
  } catch (error) {
    console.error('Router password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

// Run speed test
router.get('/speedtest', async (req, res) => {
  try {
    const startTime = Date.now();
    
    // Test download speed
    const downloadResponse = await fetch('https://speed.cloudflare.com/__down?bytes=100000000', {
      cache: 'no-store'
    });
    const downloadData = await downloadResponse.blob();
    const downloadTime = (Date.now() - startTime) / 1000;
    const downloadSpeed = (downloadData.size * 8) / (downloadTime * 1000000); // Mbps

    // Test upload speed
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
      timestamp: new Date().toISOString(),
      serverLocation: 'Cloudflare Speed Test'
    };

    // Store speed test result
    // In a real app, you'd save this to database
    
    res.json({
      success: true,
      data: speedResult
    });
  } catch (error) {
    console.error('Speed test error:', error);
    res.status(500).json({
      success: false,
      message: 'Speed test failed'
    });
  }
});

// Auto-detect router IP
router.get('/detect', async (req, res) => {
  try {
    // Get client IP
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const clientIP = ipData.ip;
    
    // Common router IP patterns based on client IP
    let likelyRouterIP = '192.168.0.1'; // Default
    
    if (clientIP.startsWith('192.168.')) {
      likelyRouterIP = '192.168.0.1';
    } else if (clientIP.startsWith('10.0.')) {
      likelyRouterIP = '10.0.0.1';
    } else if (clientIP.startsWith('172.16.')) {
      likelyRouterIP = '172.16.0.1';
    }
    
    res.json({
      success: true,
      data: {
        clientIP,
        likelyRouterIP,
        networkRange: clientIP.split('.').slice(0, 3).join('.') + '.0.1'
      }
    });
  } catch (error) {
    console.error('IP detection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to detect IP'
    });
  }
});

module.exports = router;
