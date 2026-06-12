'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { auth } from '@/lib/auth';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const inputClass = (hasError?: boolean) =>
    `w-full px-4 py-3 bg-zinc-800 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
      hasError ? 'border-red-500' : 'border-zinc-700'
    }`;

  const getErrorMessage = (error: any, fallback: string) => {
    if (error?.code === 'ECONNREFUSED' || error?.code === 'ERR_NETWORK') {
      return 'Cannot connect to the server. Please try again in a moment.';
    }

    return error?.message || error?.error || fallback;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const email = formData.email.trim();

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isFormValid = validateForm();
    if (!isFormValid) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await auth.login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      
      if (response.success) {
        router.push('/dashboard');
      } else {
        setErrors({
          general: response.message || 'Login failed'
        });
      }
    } catch (error: any) {
      setErrors({
        general: getErrorMessage(error, 'Login failed. Please try again.')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setErrors({});
      
      // Redirect to Google OAuth
      window.location.href = '/api/auth/google';
    } catch (error) {
      console.error('Google login error:', error);
      setErrors({
        general: 'Failed to start Google authentication. Please try again.'
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass(!!errors.email)}
            placeholder="Enter your email"
            disabled={isLoading}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-400">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className={`${inputClass(!!errors.password)} pr-12`}
              placeholder="Enter your password"
              disabled={isLoading}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white disabled:opacity-50"
              disabled={isLoading}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="mt-1 text-sm text-red-400">{errors.password}</p>
          )}
        </div>

        {errors.general && (
          <div className="flex gap-2 rounded-lg border border-red-500 bg-red-900/50 p-3">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-none text-red-300" />
            <p className="text-sm text-red-400">{errors.general}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="w-4 h-4 bg-zinc-800 border-zinc-600 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-zinc-300">
              Remember me
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm text-orange-500 hover:text-orange-400 transition-all duration-200 hover:scale-105 font-medium inline-block"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-700"></div>
          </div>
          <div className="relative flex justify-center text-lg">
            <span className="px-2 bg-zinc-900 text-zinc-400">Or continue with</span>
          </div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full px-6 py-3 bg-white text-zinc-800 rounded-lg hover:bg-zinc-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center border border-zinc-700"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l2.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {isLoading ? 'Connecting...' : 'Continue with Google'}
        </button>

        <div className="text-center">
          <p className="text-sm text-zinc-400">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="text-orange-500 hover:text-orange-400 transition-all duration-200 hover:scale-105 font-medium inline-block"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
