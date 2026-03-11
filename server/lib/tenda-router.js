// Mock TendaRouterAPI for development
class TendaRouterAPI {
  constructor(routerIP) {
    this.routerIP = routerIP || '192.168.0.1';
  }

  async getStatus() {
    // Mock router status
    return {
      success: true,
      data: {
        ipAddress: this.routerIP,
        wanStatus: 'Connected',
        connectedDevices: 12,
        uptime: '2 days, 14 hours',
        firmware: 'V15.03.05.19'
      }
    };
  }

  async getConnectedDevices() {
    // Mock connected devices
    return {
      success: true,
      data: [
        { name: 'iPhone', ip: '192.168.0.100', mac: '00:11:22:33:44:55', type: 'mobile' },
        { name: 'Laptop', ip: '192.168.0.101', mac: 'AA:BB:CC:DD:EE:FF', type: 'computer' },
        { name: 'Smart TV', ip: '192.168.0.102', mac: '11:22:33:44:55:66', type: 'tv' }
      ]
    };
  }

  async changePassword(oldPassword, newPassword) {
    // Mock password change
    return {
      success: true,
      message: 'Password changed successfully'
    };
  }

  async runSpeedTest() {
    // Mock speed test
    return {
      success: true,
      data: {
        download: 85.5,
        upload: 42.3,
        ping: 12,
        timestamp: new Date().toISOString()
      }
    };
  }

  async detectRouterIP() {
    // Mock IP detection
    return {
      success: true,
      data: {
        ip: '192.168.0.1',
        gateway: '192.168.0.1'
      }
    };
  }

  async login(password) {
    // Mock login
    return {
      success: true,
      message: 'Login successful'
    };
  }
}

module.exports = TendaRouterAPI;
