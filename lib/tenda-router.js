// Tenda Router API Service
// This service connects to Tenda router for management features

class TendaRouterAPI {
  constructor(routerIP = '192.168.0.1') {
    this.routerIP = routerIP;
    this.baseURL = `http://${routerIP}`;
    this.isAuthenticated = false;
    this.sessionCookie = null;
  }

  // Login to router
  async login(password) {
    try {
      const response = await fetch(`${this.baseURL}/login.cgi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: 'admin',
          password: password
        })
      });

      if (response.ok) {
        const cookies = response.headers.get('set-cookie');
        this.sessionCookie = cookies;
        this.isAuthenticated = true;
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get router status
  async getStatus() {
    if (!this.isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const response = await fetch(`${this.baseURL}/status.cgi`, {
        headers: {
          'Cookie': this.sessionCookie
        }
      });

      if (response.ok) {
        const data = await response.text();
        return this.parseStatusData(data);
      }
      return { success: false, error: 'Failed to get status' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get connected devices
  async getDevices() {
    if (!this.isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const response = await fetch(`${this.baseURL}/deviceList.cgi`, {
        headers: {
          'Cookie': this.sessionCookie
        }
      });

      if (response.ok) {
        const data = await response.text();
        return this.parseDeviceData(data);
      }
      return { success: false, error: 'Failed to get devices' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Change router password
  async changePassword(oldPassword, newPassword) {
    try {
      const response = await fetch(`${this.baseURL}/password.cgi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': this.sessionCookie
        },
        body: new URLSearchParams({
          oldPassword: oldPassword,
          newPassword: newPassword
        })
      });

      if (response.ok) {
        return { success: true, message: 'Password changed successfully' };
      }
      return { success: false, error: 'Failed to change password' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Parse router status data
  parseStatusData(htmlData) {
    // Parse HTML response to extract status information
    const status = {
      ipAddress: this.extractIP(htmlData),
      wanStatus: this.extractWANStatus(htmlData),
      connectedDevices: this.extractDeviceCount(htmlData),
      uptime: this.extractUptime(htmlData),
      firmware: this.extractFirmware(htmlData)
    };
    return { success: true, data: status };
  }

  // Extract IP address from response
  extractIP(html) {
    const ipMatch = html.match(/WAN IP.*?(\d+\.\d+\.\d+\.\d+)/);
    return ipMatch ? ipMatch[1] : 'Unknown';
  }

  // Extract WAN status
  extractWANStatus(html) {
    const statusMatch = html.match(/WAN Status.*?(\w+)/);
    return statusMatch ? statusMatch[1] : 'Disconnected';
  }

  // Extract device count
  extractDeviceCount(html) {
    const deviceMatch = html.match(/Connected Devices.*?(\d+)/);
    return deviceMatch ? parseInt(deviceMatch[1]) : 0;
  }

  // Extract uptime
  extractUptime(html) {
    const uptimeMatch = html.match(/Uptime.*?([\d:]+)/);
    return uptimeMatch ? uptimeMatch[1] : 'Unknown';
  }

  // Extract firmware version
  extractFirmware(html) {
    const firmwareMatch = html.match(/Firmware Version.*?([\d.]+)/);
    return firmwareMatch ? firmwareMatch[1] : 'Unknown';
  }

  // Parse device data
  parseDeviceData(htmlData) {
    // Parse HTML response to extract device information
    const devices = [];
    const deviceMatches = htmlData.matchAll(/<tr[^>]*>.*?<\/tr>/g);
    
    deviceMatches.forEach(device => {
      const deviceInfo = {
        name: this.extractDeviceName(device),
        ip: this.extractDeviceIP(device),
        mac: this.extractDeviceMAC(device),
        type: this.extractDeviceType(device),
        status: this.extractDeviceStatus(device)
      };
      devices.push(deviceInfo);
    });

    return { success: true, data: devices };
  }

  extractDeviceName(device) {
    const nameMatch = device.match(/<td[^>]*>([^<]+)<\/td>/);
    return nameMatch ? nameMatch[1].trim() : 'Unknown Device';
  }

  extractDeviceIP(device) {
    const ipMatch = device.match(/(\d+\.\d+\.\d+\.\d+)/);
    return ipMatch ? ipMatch[1] : 'Unknown IP';
  }

  extractDeviceMAC(device) {
    const macMatch = device.match(/([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}/i);
    return macMatch ? macMatch[0] : 'Unknown MAC';
  }

  extractDeviceType(device) {
    if (device.includes('phone') || device.includes('mobile')) return 'Mobile';
    if (device.includes('laptop') || device.includes('pc')) return 'Computer';
    if (device.includes('tv')) return 'Smart TV';
    if (device.includes('camera')) return 'Security Camera';
    return 'Unknown';
  }

  extractDeviceStatus(device) {
    if (device.includes('online') || device.includes('connected')) return 'Online';
    if (device.includes('offline') || device.includes('disconnected')) return 'Offline';
    return 'Unknown';
  }

  // Logout from router
  async logout() {
    try {
      await fetch(`${this.baseURL}/logout.cgi`, {
        headers: {
          'Cookie': this.sessionCookie
        }
      });
      this.isAuthenticated = false;
      this.sessionCookie = null;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default TendaRouterAPI;
