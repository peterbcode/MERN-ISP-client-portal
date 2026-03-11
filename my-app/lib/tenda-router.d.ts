// TypeScript definitions for TendaRouterAPI
export interface TendaRouterStatus {
  ipAddress: string;
  wanStatus: string;
  connectedDevices: number;
  uptime: string;
  firmware: string;
}

export interface ConnectedDevice {
  name: string;
  ip: string;
  mac: string;
  type: string;
  status?: string;
}

export interface SpeedTestResult {
  download: number;
  upload: number;
  ping: number;
  timestamp: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

declare class TendaRouterAPI {
  constructor(routerIP: string);
  
  getStatus(): Promise<ApiResponse<TendaRouterStatus>>;
  getConnectedDevices(): Promise<ApiResponse<ConnectedDevice[]>>;
  changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse>;
  runSpeedTest(): Promise<ApiResponse<SpeedTestResult>>;
  detectRouterIP(): Promise<ApiResponse<{ ip: string; gateway: string }>>;
  login(password: string): Promise<ApiResponse>;
}

export default TendaRouterAPI;
