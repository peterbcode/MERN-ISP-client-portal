export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: any;
  message?: string;
}

export interface AuthMethods {
  register: (userData: any) => Promise<AuthResponse>;
  login: (credentials: any) => Promise<AuthResponse>;
  googleLogin: () => Promise<AuthResponse>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<any>;
  updateProfile: (profileData: any) => Promise<AuthResponse>;
  changePassword: (passwordData: any) => Promise<AuthResponse>;
  forgotPassword: (email: string) => Promise<AuthResponse>;
  resetPassword: (token: string, newPassword: string) => Promise<AuthResponse>;
  isAuthenticated: () => boolean;
  getToken: () => string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

declare const auth: AuthMethods;
export { auth };
