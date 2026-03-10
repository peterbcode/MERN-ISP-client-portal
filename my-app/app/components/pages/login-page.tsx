'use client'

import { useState } from 'react'
import Link from "next/link";
import AnimatedSection from '../ui/animated-section';
import PremiumButton from '../ui/premium-button';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      alert('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);
    setLoginStatus('idle');

    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would normally authenticate with your backend
      console.log('Login attempt:', { email: formData.email });
      
      // Simulate successful login
      setLoginStatus('success');
      setFormData({ email: '', password: '' });
      
      // Redirect or handle successful login
      // window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login failed:', error);
      setLoginStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-28 text-white">
      <AnimatedSection direction="up" className="w-full max-w-md">
        <section className="rounded-2xl border border-orange-500/40 bg-zinc-950 p-8 shadow-2xl shadow-orange-900/30">
          <h1 className="text-2xl font-bold text-orange-500">Login</h1>
          <p className="mt-2 text-sm text-orange-100/80">Sign in to your account.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-orange-100">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full rounded-lg border border-orange-600/60 bg-black px-3 py-2 text-white placeholder:text-orange-100/50 focus:outline-none focus:ring-2 focus:ring-orange-500/60 transition-all duration-300"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="mb-1 block text-sm text-orange-100">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full rounded-lg border border-orange-600/60 bg-black px-3 py-2 text-white placeholder:text-orange-100/50 focus:outline-none focus:ring-2 focus:ring-orange-500/60 transition-all duration-300"
                placeholder="••••••••••"
              />
            </div>
            
            <PremiumButton
              variant="primary"
              size="lg"
              type="submit"
              disabled={isSubmitting}
              className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing in...' : 'Login'}
            </PremiumButton>
          </form>

          {/* Status Messages */}
          {loginStatus === 'success' && (
            <div className="mt-4 rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-center">
              <p className="text-green-400 font-semibold">✅ Login successful!</p>
              <p className="text-sm text-orange-100/80 mt-1">Redirecting to dashboard...</p>
            </div>
          )}

          {loginStatus === 'error' && (
            <div className="mt-4 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-center">
              <p className="text-red-400 font-semibold">❌ Login failed</p>
              <p className="text-sm text-orange-100/80 mt-1">Please check your credentials and try again.</p>
            </div>
          )}

          <div className="mt-6 text-sm text-orange-100/80">
            Need help?{" "}
            <Link href="/contact" className="font-semibold text-orange-400 hover:text-orange-300 transition-colors duration-300">
              Contact support
            </Link>
          </div>
        </section>
      </AnimatedSection>
    </main>
  );
};

export default LoginPage;
