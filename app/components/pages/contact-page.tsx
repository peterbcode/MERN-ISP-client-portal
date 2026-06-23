'use client'

import { useState, useEffect } from 'react'
import AnimatedSection from '../ui/animated-section';
import PremiumButton from '../ui/premium-button';
import { safeAlert } from '@/lib/native-dialog'
import {
  ChatBubbleLeftRightIcon,
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  SignalIcon,
} from '@heroicons/react/24/solid'

const details = [
  { label: "Call Us", value: "079 938 1260", href: "tel:+27799381260", action: "Call", icon: PhoneIcon },
  { label: "Email", value: "info@valley-computers.co.za", href: "mailto:info@valley-computers.co.za?subject=Inquiry&body=Hi Valley Computers,", action: "Email", icon: EnvelopeIcon },
  { label: "Location", value: "6 Church Rd, Riebeek-Kasteel, 7307", href: "https://www.google.com/maps/search/?api=1&query=6%20Church%20Rd%2C%20Riebeek-Kasteel%2C%207307", target: "_blank", action: "Open Map", icon: MapPinIcon },
];

const responseHighlights = [
  { label: 'Fastest Channel', value: 'WhatsApp or phone', icon: ChatBubbleLeftRightIcon },
  { label: 'Support Window', value: 'Business hours plus outage escalation', icon: ClockIcon },
  { label: 'Service Area', value: 'Riebeek Valley and Swartland', icon: SignalIcon },
]

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
        // Handle ISP plan format: "ISP Plan - X Mbps (RXXX/mo)"
        if (service.startsWith('ISP Plan -')) {
          setServiceType(service);
          // Pre-fill message with plan information
          setFormData(prev => ({
            ...prev,
            message: `I'm interested in the ${service} plan. Please provide more information about availability and installation.`
          }));
        } else {
          setServiceType(service === 'it-support' ? 'IT Support' : service);
        }
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
    <main className="site-page text-white">
      <AnimatedSection direction="up" className="site-hero px-4 pb-20 pt-32 text-center sm:px-6 lg:px-8 lg:pt-48">
        <div className="relative mx-auto max-w-4xl">
          <p className="site-eyebrow">Contact</p>
          <h1 className="mt-6 text-5xl font-black leading-[0.9] tracking-[-0.03em] sm:text-6xl lg:text-8xl">
            Talk to the <span className="text-[#f97316]">local team</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
            New connection, urgent support, business network, or repair request. Send the details and we will route it to the right person.
          </p>
          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
            {responseHighlights.map((item) => (
              <div key={item.label} className="site-card rounded-2xl px-6 py-5 text-left border-zinc-800/50 backdrop-blur-md">
                <item.icon className="h-6 w-6 text-[#f97316]" />
                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{item.label}</p>
                <p className="mt-1 text-base font-bold leading-tight text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection direction="up" delay={200} className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.5fr]">
          <AnimatedSection direction="up" delay={300}>
            <div className="space-y-5">
              {details.map((item) => (
                <div
                  key={item.label}
                  className="site-card group block rounded-2xl p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[#f97316]/50 hover:bg-zinc-900/40"
                >
                  <div className="flex items-start gap-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f97316] text-white shadow-[0_12px_24px_rgba(249,115,22,0.3)] group-hover:scale-110 transition-transform duration-500">
                      <item.icon className="h-6 w-6" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f97316]">{item.label}</p>
                      <p className="mt-2 break-words text-lg font-bold leading-tight text-zinc-100 group-hover:text-white transition-colors">{item.value}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <a
                      href={item.href}
                      target={item.target || undefined}
                      rel={item.target ? "noopener noreferrer" : undefined}
                      className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#f97316] px-4 py-3 text-sm font-black text-white transition-all duration-300 hover:brightness-110 shadow-lg shadow-[#f97316]/20"
                    >
                      {item.action}
                    </a>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.label, item.value)}
                      className="inline-flex min-w-24 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm font-bold text-zinc-300 transition-all duration-300 hover:border-[#f97316] hover:text-white"
                    >
                      {copiedDetail === item.label ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              ))}
              <div className="site-panel rounded-2xl p-6 border-zinc-800/50 bg-zinc-900/30">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f97316]">Before you send</p>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                  For internet issues, include your <span className="text-zinc-200 font-semibold">address</span>, router status lights, and whether the fault affects every device or only Wi-Fi.
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={400} className="site-panel rounded-3xl p-8 sm:p-10 border-zinc-800/50">
            <div className="mb-8 border-b border-zinc-800 pb-6">
              <p className="site-eyebrow">Message</p>
              <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Send a request</h2>
              <p className="mt-3 text-sm font-medium text-zinc-500 uppercase tracking-wider">Request type: <span className="text-[#f97316] font-black">{serviceType}</span></p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-xs font-black uppercase tracking-widest text-zinc-500">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-black/40 px-4 py-3 text-base text-zinc-100 placeholder:text-zinc-600 focus:border-[#f97316] focus:outline-none focus:ring-4 focus:ring-[#f97316]/10 transition-all duration-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-xs font-black uppercase tracking-widest text-zinc-500">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-black/40 px-4 py-3 text-base text-zinc-100 placeholder:text-zinc-600 focus:border-[#f97316] focus:outline-none focus:ring-4 focus:ring-[#f97316]/10 transition-all duration-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-xs font-black uppercase tracking-widest text-zinc-500">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-black/40 px-4 py-3 text-base text-zinc-100 placeholder:text-zinc-600 focus:border-[#f97316] focus:outline-none focus:ring-4 focus:ring-[#f97316]/10 transition-all duration-500"
                  placeholder="+27"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-xs font-black uppercase tracking-widest text-zinc-500">
                  How can we help?
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="min-h-32 w-full rounded-xl border border-zinc-800 bg-black/40 px-4 py-3 text-base text-zinc-100 placeholder:text-zinc-600 focus:border-[#f97316] focus:outline-none focus:ring-4 focus:ring-[#f97316]/10 transition-all duration-500 resize-none"
                  placeholder="Tell us about your needs..."
                />
              </div>

              <PremiumButton
                variant="primary"
                size="lg"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 text-base font-black shadow-2xl shadow-[#f97316]/20"
              >
                {isSubmitting ? 'Sending Request...' : 'Send Message'}
              </PremiumButton>
            </form>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="mt-4 rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-center">
                <p className="text-green-400 font-semibold">Message sent successfully.</p>
                <p className="text-sm text-zinc-300 mt-1">We'll get back to you within 24 hours.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mt-4 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-center">
                <p className="text-red-400 font-semibold">Failed to send message.</p>
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
