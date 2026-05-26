'use client'

import { useState, useEffect } from 'react'
import AnimatedSection from '../ui/animated-section';
import PremiumButton from '../ui/premium-button';
import { safeAlert } from '@/lib/native-dialog'

const details = [
  { label: "Call Us", value: "079 938 1260", href: "tel:+27799381260" },
  { label: "Email", value: "info@valley-computers.co.za", href: "mailto:info@valley-computers.co.za" },
  { label: "Location", value: "Riebeek Kasteel, Western Cape", href: "https://www.google.com/maps/search/?api=1&query=Riebeek%20Kasteel%2C%20Western%20Cape", target: "_blank" },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copiedDetail, setCopiedDetail] = useState<string | null>(null);

  // Get service type from URL query parameter
  const [serviceType, setServiceType] = useState('General Inquiry');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const service = urlParams.get('service');
      if (service) {
        setServiceType(service === 'it-support' ? 'IT Support' : service);
      }
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      safeAlert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          service: serviceType
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Form submission failed:', error);
      setSubmitStatus('error');
      safeAlert(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (label: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedDetail(label);
    window.setTimeout(() => setCopiedDetail(null), 1600);
  };

  return (
    <main className="bg-black text-white">
      <AnimatedSection direction="up" className="mx-auto max-w-7xl px-4 pb-14 pt-32 sm:px-6 lg:px-8 lg:pt-40">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]">Contact</p>
        <h1 className="mt-4 text-4xl font-black sm:text-5xl lg:text-6xl">Get In Touch</h1>
        <p className="mt-5 max-w-3xl text-zinc-300">
          Reach out for ISP signups, support requests, and project enquiries.
        </p>
      </AnimatedSection>

      <AnimatedSection direction="up" delay={200} className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <AnimatedSection direction="up" delay={300}>
            <div className="space-y-3">
              {details.map((item) => (
                <div
                  key={item.label}
                  className="group block rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-[#f97316]/50 hover:bg-zinc-900/70 cursor-pointer"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#f97316] transition-colors group-hover:text-[#f97316]/80">{item.label}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-zinc-200 group-hover:text-white transition-colors">{item.value}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <a
                      href={item.href}
                      target={item.target || undefined}
                      rel={item.target ? "noopener noreferrer" : undefined}
                      className="inline-flex flex-1 items-center justify-center rounded-lg bg-[#f97316] px-3 py-2 text-sm font-bold text-white transition hover:brightness-110"
                    >
                      {item.label === "Call Us" ? "Call" : item.label === "Email" ? "Email" : "Open Map"}
                    </a>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.label, item.value)}
                      className="inline-flex min-w-20 items-center justify-center rounded-lg border border-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-200 transition hover:border-[#f97316] hover:text-white"
                    >
                      {copiedDetail === item.label ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={400} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-zinc-200">
                  Name *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 transition-all duration-300"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-zinc-200">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 transition-all duration-300"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-zinc-200">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 transition-all duration-300"
                  placeholder="+27 12 345 6789"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-semibold text-zinc-200">
                  How can we help? *
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="min-h-28 w-full rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 transition-all duration-300 resize-none"
                  placeholder="Tell us about your project or support needs..."
                />
              </div>

              <PremiumButton
                variant="primary"
                size="lg"
                type="submit"
                disabled={isSubmitting}
                className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </PremiumButton>
            </form>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="mt-4 rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-center">
                <p className="text-green-400 font-semibold">✅ Message sent successfully!</p>
                <p className="text-sm text-zinc-300 mt-1">We'll get back to you within 24 hours.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mt-4 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-center">
                <p className="text-red-400 font-semibold">❌ Failed to send message</p>
                <p className="text-sm text-zinc-300 mt-1">Please try again or call us directly.</p>
              </div>
            )}
          </AnimatedSection>
        </div>
      </AnimatedSection>
    </main>
  );
};

export default ContactPage;
