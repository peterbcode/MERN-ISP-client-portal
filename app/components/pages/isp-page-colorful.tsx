"use client";

import Link from "next/link";
import { useState } from "react";
import AnimatedSection from "../ui/animated-section";
import PremiumButton from "../ui/premium-button";
import {
  BoltIcon,
  ChartBarIcon,
  LifebuoyIcon,
  MapPinIcon,
  ShieldCheckIcon,
  WifiIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const serviceAreas = ["Riebeek Kasteel", "Malmesbury", "Chatsworth", "Swartland Region"];

const valueCards = [
  {
    title: "Consistent Speed",
    text: "Optimized fibre and fixed wireless with stable performance during peak hours.",
    icon: BoltIcon,
  },
  {
    title: "99% Uptime",
    text: "Business-grade network reliability with proactive monitoring and failover planning.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Local Support Team",
    text: "Direct support from technicians based in your region, not a generic call center.",
    icon: LifebuoyIcon,
  },
];

const plans = [
  { speed: "2 Mbps", label: "Basic browsing", price: "R350/mo", message: "Perfect for light browsing, email and social media. Great for single users or couples." },
  { speed: "4 Mbps", label: "Streaming + work", price: "R550/mo", message: "Ideal for streaming HD content on one device and working from home. Supports smooth video calls and online meetings." },
  { speed: "6 Mbps", label: "Family use", price: "R650/mo", featured: true, message: "Perfect for smart TVs! Multiple devices can stream simultaneously. Great for families with 3-4 users watching different content." },
  { speed: "8 Mbps", label: "Power users", price: "R850/mo", message: "Excellent for heavy streaming, gaming, and multiple smart home devices. No buffering even during peak hours." },
  { speed: "10 Mbps", label: "Premium", price: "R1050/mo", message: "Perfect for multiple smart TVs! Supports 4K streaming on several devices simultaneously. Ideal for large families and home offices." },
];

const IspPageColorful = () => {
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);

  return (
    <main className="site-page text-white">
      {/* Hero Section */}
      <AnimatedSection direction="up" className="site-hero px-4 pb-20 pt-32 text-center sm:px-6 lg:pt-48">
        <div className="relative mx-auto max-w-7xl">
          <p className="site-eyebrow">Fiber & Wireless</p>
          <h1 className="mx-auto mt-6 max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.03em] sm:text-7xl lg:text-9xl">
            <span className="block text-[#f97316]">Professional</span>
            <span className="block text-white">Infrastructure</span>
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
            Uncapped fibre & wireless internet with local support. Built for homes and businesses in Riebeek Valley.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <PremiumButton variant="primary" size="lg" href="#plans" className="min-w-[180px] py-4 text-base font-black shadow-2xl shadow-[#f97316]/20">
              View Plans
            </PremiumButton>
            <PremiumButton variant="secondary" size="lg" href="/contact" className="min-w-[180px] py-4 text-base font-black border-zinc-800 bg-zinc-900/50">
              Talk to Sales
            </PremiumButton>
            <a
              href="https://wa.me/27799381260"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-2xl bg-[#f97316] px-8 py-4 text-base font-black text-white shadow-xl shadow-[#f97316]/20 transition-all duration-300 hover:brightness-110 hover:-translate-y-1"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              WhatsApp
            </a>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceAreas.map((area) => (
              <div key={area} className="site-card rounded-2xl px-6 py-5 border-zinc-800/50 backdrop-blur-md">
                <MapPinIcon className="mx-auto h-5 w-5 text-[#f97316]" />
                <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-200">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Value Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up" className="mx-auto max-w-3xl text-center">
            <p className="site-eyebrow">Why Valley Internet</p>
            <h2 className="mt-4 text-4xl font-black text-white sm:text-6xl tracking-tight">Built for dependable performance</h2>
          </AnimatedSection>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {valueCards.map((card, i) => (
              <AnimatedSection
                key={card.title}
                direction="up"
                delay={i * 100}
                className="site-card rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:border-[#f97316]/50 border-zinc-800/50"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f97316]/10 border border-[#f97316]/20">
                  <card.icon className="h-8 w-8 text-[#f97316]" />
                </div>
                <h3 className="mt-8 text-2xl font-black text-white">{card.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-zinc-400">{card.text}</p>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection direction="up" delay={400} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Uncapped data", "No throttling", "No lock-in contracts", "Professional install"].map((item) => (
              <div key={item} className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 px-6 py-4 text-center text-xs font-black uppercase tracking-[0.2em] text-zinc-300">
                {item}
              </div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-24 sm:py-32 bg-black/40 border-y border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up" className="mx-auto max-w-3xl text-center">
            <p className="site-eyebrow">Transparent Pricing</p>
            <h2 className="mt-4 text-4xl font-black text-white sm:text-6xl tracking-tight">Choose your speed</h2>
            <p className="mt-6 text-lg text-zinc-400">
              Simple monthly plans with no hidden costs.
            </p>
          </AnimatedSection>

          <div className="mt-16 grid gap-8 md:grid-cols-3 lg:grid-cols-5">
            {plans.map((plan, i) => (
              <AnimatedSection
                key={plan.speed}
                direction="up"
                delay={i * 100}
                className="site-card group relative cursor-pointer rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:border-[#f97316]/60 hover:shadow-2xl hover:shadow-[#f97316]/10 border-zinc-800/50"
                onClick={() => setSelectedPlan(plan)}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-[#f97316] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <p className="text-3xl font-black text-white">
                    {plan.speed}
                  </p>
                  <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-[#f97316]">
                    {plan.label}
                  </p>
                </div>

                <div className="mt-8 text-center border-t border-zinc-800/80 pt-8">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-black text-white">
                      {plan.price}
                    </span>
                  </div>
                </div>

                <ul className="mt-8 space-y-4 text-zinc-400">
                  <li className="flex items-center gap-3">
                    <CheckIcon className="h-5 w-5 text-[#f97316] flex-shrink-0" />
                    <span className="text-sm font-bold">Uncapped data</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon className="h-5 w-5 text-[#f97316] flex-shrink-0" />
                    <span className="text-sm font-bold">Fibre & Wireless</span>
                  </li>
                </ul>

                <button
                  className="mt-10 block w-full rounded-2xl bg-[#f97316] px-6 py-4 text-center text-sm font-black text-white transition-all duration-300 hover:brightness-110 shadow-lg shadow-[#f97316]/20"
                >
                  Select Plan
                </button>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection direction="up" delay={500} className="site-panel mt-12 grid gap-6 rounded-3xl border-zinc-800/50 bg-zinc-900/20 p-8 sm:grid-cols-3">
            <p className="text-center text-sm font-bold text-zinc-400">
              <span className="block text-xs font-black uppercase tracking-[0.2em] text-[#f97316] mb-1">Installation</span>
              <span className="text-xl text-white font-black">R1,000</span> one-time
            </p>
            <p className="text-center text-sm font-bold text-zinc-400">
              <span className="block text-xs font-black uppercase tracking-[0.2em] text-[#f97316] mb-1">Backup Power</span>
              <span className="text-xl text-white font-black">R100/mo</span> UPS rental
            </p>
            <p className="text-center text-sm font-bold text-zinc-400">
              <span className="block text-xs font-black uppercase tracking-[0.2em] text-[#f97316] mb-1">Commitment</span>
              <span className="text-xl text-white font-black">Month-to-Month</span>
            </p>
          </AnimatedSection>
        </div>
      </AnimatedSection>

      {/* Technology Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#f97316]/5 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up" className="mx-auto max-w-3xl text-center">
            <p className="site-eyebrow">Our Technology</p>
            <h2 className="mt-4 text-4xl font-black text-white sm:text-6xl tracking-tight">
              Enterprise-grade <span className="text-[#f97316]">Infrastructure</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              Engineered to deliver exceptional uptime, ultra-fast connectivity, and scalable performance across the Swartland.
            </p>
          </AnimatedSection>

          <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: WifiIcon,
                title: "Fibre Optic Network",
                desc: "Ultra-fast fibre backbone with redundant routing for maximum uptime.",
              },
              {
                icon: ChartBarIcon,
                title: "Fixed Wireless",
                desc: "Advanced wireless infrastructure connecting rural & remote regions.",
              },
              {
                icon: ShieldCheckIcon,
                title: "Enterprise Security",
                desc: "Bank-grade encryption, DDoS mitigation, and hardened infrastructure.",
              },
              {
                icon: BoltIcon,
                title: "24/7 Monitoring",
                desc: "Real-time system monitoring with proactive incident response.",
              },
            ].map((item, i) => (
              <AnimatedSection
                key={i}
                direction="up"
                delay={i * 100}
                className="site-card rounded-3xl p-8 border-zinc-800/50 group transition-all duration-500 hover:border-[#f97316]/50"
              >
                <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center transition-all duration-500 group-hover:bg-[#f97316]/10 group-hover:border-[#f97316]/30">
                  <item.icon className="h-7 w-7 text-zinc-500 group-hover:text-[#f97316]" />
                </div>
                <h3 className="mt-8 text-xl font-black text-white">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-zinc-500 font-bold group-hover:text-zinc-400 transition-colors">
                  {item.desc}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden bg-black border-t border-zinc-800/50">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up" className="relative overflow-hidden rounded-[3rem] border border-zinc-800/50 bg-zinc-900/20 p-12 text-center sm:p-20">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#f97316] via-orange-400 to-[#f97316]" />
            
            <p className="site-eyebrow">Next Step</p>
            <h2 className="mt-6 text-5xl font-black text-white sm:text-7xl tracking-tight">
              Ready to get <span className="text-[#f97316]">connected?</span>
            </h2>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400">
              Fast installations, reliable connectivity, and local support
              you can depend on. Check coverage and get connected today.
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <PremiumButton variant="primary" size="lg" href="/contact" className="min-w-[200px] py-4 text-base font-black shadow-2xl shadow-[#f97316]/20">
                Check Coverage
              </PremiumButton>
              <a
                href="tel:+27799381260"
                className="inline-flex min-w-[200px] items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/50 px-8 py-4 text-base font-black text-zinc-300 transition-all duration-300 hover:border-[#f97316] hover:text-white"
              >
                Call the Team
              </a>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-3">
              {[
                ["500+", "Happy Customers"],
                ["99%", "Uptime Guarantee"],
                ["24/7", "Local Support"],
              ].map(([value, label], i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl font-black text-white mb-2">{value}</div>
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-[#f97316]">{label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Plan Details Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSelectedPlan(null)}>
          <AnimatedSection direction="up" className="max-w-md w-full rounded-[2.5rem] border border-zinc-800/80 bg-zinc-950 p-10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-black text-white">{selectedPlan.speed}</h3>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f97316] mt-1">{selectedPlan.label}</p>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="rounded-xl p-3 text-zinc-500 hover:bg-zinc-900 hover:text-white transition-all"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-8">
              <p className="text-5xl font-black text-white">{selectedPlan.price}</p>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mt-2">Per Month Uncapped</p>
            </div>

            <div className="rounded-2xl bg-zinc-900/50 p-6 border border-zinc-800/50 mb-10">
              <p className="text-base leading-relaxed text-zinc-300 font-medium">{selectedPlan.message}</p>
            </div>

            <div className="flex flex-col gap-3">
              <PremiumButton
                variant="primary"
                size="lg"
                href={`/contact?service=${selectedPlan.speed}`}
                className="w-full py-4 text-base font-black shadow-xl shadow-[#f97316]/20"
                onClick={() => setSelectedPlan(null)}
              >
                Get Connected Now
              </PremiumButton>
              <button
                onClick={() => setSelectedPlan(null)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 px-6 py-4 text-sm font-black text-zinc-500 transition-all hover:text-white"
              >
                Go Back
              </button>
            </div>
          </AnimatedSection>
        </div>
      )}
    </main>
  );
};

export default IspPageColorful;

export default IspPageColorful;
