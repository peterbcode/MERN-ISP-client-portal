'use client'

import { useState } from 'react'
import Link from "next/link";
import AnimatedSection from '../ui/animated-section';
import PremiumButton from '../ui/premium-button';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.serviceType) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would normally send to your backend/API
      console.log('Signup form submitted:', formData);
      
      setSubmitStatus('success');
      setFormData({ 
        firstName: '', lastName: '', email: '', phone: '', 
        company: '', serviceType: '', message: '' 
      });
    } catch (error) {
      console.error('Signup failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-28 text-white">
      <AnimatedSection direction="up" className="w-full max-w-lg">
        <section className="rounded-2xl border border-orange-500/40 bg-zinc-950 p-8 shadow-2xl shadow-orange-900/30">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-orange-500">Signup</h1>
            <p className="mt-2 text-sm text-orange-100/80">
              Join Valley Computers and grow your business with our reliable network solutions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-1 block text-sm text-orange-100">
                  First Name *
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full rounded-lg border border-orange-600/60 bg-black px-3 py-2 text-white placeholder:text-orange-100/50 focus:outline-none focus:ring-2 focus:ring-orange-500/60 transition-all duration-300"
                  placeholder="John"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="mb-1 block text-sm text-orange-100">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full rounded-lg border border-orange-600/60 bg-black px-3 py-2 text-white placeholder:text-orange-100/50 focus:outline-none focus:ring-2 focus:ring-orange-500/60 transition-all duration-300"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-orange-100">
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full rounded-lg border border-orange-600/60 bg-black px-3 py-2 text-white placeholder:text-orange-100/50 focus:outline-none focus:ring-2 focus:ring-orange-500/60 transition-all duration-300"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 block text-sm text-orange-100">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full rounded-lg border border-orange-600/60 bg-black px-3 py-2 text-white placeholder:text-orange-100/50 focus:outline-none focus:ring-2 focus:ring-orange-500/60 transition-all duration-300"
                placeholder="+27 12 345 6789"
              />
            </div>

            <div>
              <label htmlFor="company" className="mb-1 block text-sm text-orange-100">
                Company Name
              </label>
              <input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full rounded-lg border border-orange-600/60 bg-black px-3 py-2 text-white placeholder:text-orange-100/50 focus:outline-none focus:ring-2 focus:ring-orange-500/60 transition-all duration-300"
                placeholder="Your Business Ltd"
              />
            </div>

            <div>
              <label htmlFor="serviceType" className="mb-1 block text-sm text-orange-100">
                Service Type *
              </label>
              <select
                id="serviceType"
                required
                value={formData.serviceType}
                onChange={(e) => handleInputChange('serviceType', e.target.value)}
                className="w-full rounded-lg border border-orange-600/60 bg-black px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/60 transition-all duration-300"
              >
                <option value="">Select service type...</option>
                <option value="isp">ISP Reseller</option>
                <option value="installer">Network Installer</option>
                <option value="consultant">IT Consultant</option>
                <option value="reseller">Hardware Reseller</option>
                <option value="other">Other Partnership</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="mb-1 block text-sm text-orange-100">
                Tell us about your business
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="w-full rounded-lg border border-orange-600/60 bg-black px-3 py-2 text-white placeholder:text-orange-100/50 focus:outline-none focus:ring-2 focus:ring-orange-500/60 transition-all duration-300 resize-none"
                placeholder="Describe your business goals and how we can work together..."
              />
            </div>
          </form>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="mt-4 rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-center">
              <p className="text-green-400 font-semibold">✅ Signup successful!</p>
              <p className="text-sm text-orange-100/80 mt-1">We'll contact you within 48 hours to discuss next steps.</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mt-4 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-center">
              <p className="text-red-400 font-semibold">❌ Submission failed</p>
              <p className="text-sm text-orange-100/80 mt-1">Please try again or contact us directly.</p>
            </div>
          )}

          <div className="mt-6 space-y-3">
            <PremiumButton
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Create Account'}
            </PremiumButton>
            
            <div className="mt-4 text-center">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 rounded-lg border border-orange-500/30 bg-zinc-900/50 px-4 py-2.5 text-sm font-medium text-orange-100/80 hover:border-orange-500/60 hover:bg-zinc-900/70 hover:text-orange-300 transition-all duration-300 hover:shadow-[0_4px_12px_rgba(249,115,22,0.15)]"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </main>
  );
};

export default SignupPage;
