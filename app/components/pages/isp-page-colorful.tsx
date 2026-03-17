"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BoltIcon,
  ChartBarIcon,
  LifebuoyIcon,
  MapPinIcon,
  ShieldCheckIcon,
  WifiIcon,
  ArrowRightIcon,
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
    <main className="bg-[#050505] text-white">
      {/* Hero Section - Matching homepage style with variety */}
      <section className="relative overflow-hidden bg-[#050505] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(249,115,22,0.18),transparent_45%),radial-gradient(circle_at_75%_85%,rgba(249,115,22,0.12),transparent_40%),linear-gradient(to_bottom,rgba(0,0,0,0.4),rgba(0,0,0,0.95))]" />
        <div className="hero-grid absolute inset-0 opacity-10" />
        
        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-36 text-center sm:px-6 lg:px-8 lg:pb-16 lg:pt-44">
          <WifiIcon className="mx-auto h-6 w-6 text-[#f97316]" />
          <h1 className="mx-auto mt-6 max-w-5xl text-4xl font-black leading-[0.9] tracking-[-0.02em] sm:text-5xl lg:text-7xl">
            <span className="block text-[#f97316] drop-shadow-[0_0_24px_rgba(243,111,0,0.35)]">Professional Internet</span>
            <span className="block text-white [text-shadow:0_0_26px_rgba(255,255,255,0.12)]">Infrastructure</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-zinc-300 sm:mt-8 sm:text-lg lg:text-xl">
            Uncapped fibre & wireless internet with local support. Built for homes and businesses in Riebeek Valley.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <a
              href="#plans"
              className="rounded-xl bg-[#f97316] px-7 py-3 text-sm font-bold text-white transition hover:brightness-110 shadow-lg"
            >
              View Plans
            </a>
            <Link
              href="/contact"
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-7 py-3 text-sm font-bold text-zinc-100 transition hover:border-[#f97316]/70"
            >
              Talk to Sales
            </Link>
          </div>
          <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {serviceAreas.map((area) => (
              <div key={area} className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-4">
                <MapPinIcon className="mx-auto h-4 w-4 text-[#f97316]" />
                <p className="mt-2 text-sm font-semibold text-zinc-200">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Section - Consistent background */}
      <section className="bg-[#050505] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#f97316]">Why Valley Internet</p>
            <h2 className="mt-3 text-4xl font-black text-zinc-100 sm:text-5xl">Built for dependable everyday performance</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {valueCards.map((card) => (
              <article
                key={card.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <card.icon className="h-8 w-8 text-[#f97316]" />
                <h3 className="mt-5 text-xl font-extrabold text-zinc-100">{card.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-zinc-300">{card.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["Uncapped data", "No throttling", "No lock-in contracts", "Professional install"].map((item) => (
              <div key={item} className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-center text-sm font-bold text-zinc-100">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section - Black background */}
      <section id="plans" className="bg-[#050505] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#f97316]">Transparent Pricing</p>
            <h2 className="mt-3 text-4xl font-black text-zinc-100 sm:text-5xl">Choose your speed</h2>
            <p className="mt-4 text-sm text-zinc-300 sm:text-base">
              Simple monthly plans.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {plans.map((plan) => (
              <article
                key={plan.speed}
                className={`group relative rounded-2xl border border-[#f97316] bg-gradient-to-b from-zinc-900 to-black p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-[0_0_40px_rgba(249,115,22,0.3)]`}
                onClick={() => setSelectedPlan(plan)}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#f97316] to-orange-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {plan.speed}
                  </p>
                  <p className="mt-2 text-sm font-medium text-zinc-300">
                    {plan.label}
                  </p>
                </div>
                
                <div className="mt-6 text-center border-t border-zinc-700 pt-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                  </div>
                </div>
                
                <ul className="mt-6 space-y-3 text-zinc-300">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-[#f97316] flex-shrink-0" />
                    <span className="text-sm">Uncapped data</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-[#f97316] flex-shrink-0" />
                    <span className="text-sm">Fibre & Wireless</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-[#f97316] flex-shrink-0" />
                    <span className="text-sm">24/7 Local Support</span>
                  </li>
                </ul>
                
                <Link
                  href="/contact"
                  className="mt-8 block w-full rounded-xl bg-[#f97316] px-4 py-3 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-orange-600 shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  Get Started
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-7 grid gap-3 rounded-2xl border border-[#f97316] bg-gradient-to-b from-zinc-900 to-black p-5 sm:grid-cols-3 shadow-[0_0_40px_rgba(249,115,22,0.3)]">
            <p className="text-center text-sm text-zinc-300">
              <span className="font-black text-white">R1,000</span> one-time installation
            </p>
            <p className="text-center text-sm text-zinc-300">
              <span className="font-black text-white">R100/mo</span> optional UPS rental
            </p>
            <p className="text-center text-sm text-zinc-300">
              <span className="font-black text-[#f97316]">R0</span> contract lock-in fee
            </p>
          </div>

          {/* Custom Message Modal */}
          {selectedPlan && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedPlan(null)}>
              <div className="max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-black text-zinc-900">{selectedPlan.speed}</h3>
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-zinc-600 mb-3">{selectedPlan.label}</p>
                <p className="text-3xl font-black text-zinc-900 mb-4">{selectedPlan.price}</p>
                <p className="text-zinc-700 leading-relaxed mb-6">{selectedPlan.message}</p>
                <div className="flex gap-3">
                  <Link
                    href="/contact"
                    className="flex-1 rounded-lg bg-[#f97316] px-4 py-3 text-center text-sm font-bold text-white transition hover:brightness-110"
                    onClick={() => setSelectedPlan(null)}
                  >
                    Get Started
                  </Link>
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="flex-1 rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-center text-sm font-bold text-zinc-900 transition hover:bg-zinc-100"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Technology Section - Consistent background */}
      <section className="bg-[#050505] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#f97316]">Our Technology</p>
            <h2 className="mt-3 text-4xl font-black text-zinc-100 sm:text-5xl">Modern Infrastructure</h2>
          </div>
          
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="rounded-lg bg-[#f97316] p-3">
                  <WifiIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">Fibre Optic Network</h3>
                  <p className="mt-1 text-zinc-300">High-speed fibre with redundant paths.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="rounded-lg bg-[#f97316] p-3">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">Fixed Wireless</h3>
                  <p className="mt-1 text-zinc-300">Advanced wireless for rural areas.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="rounded-lg bg-[#f97316] p-3">
                  <ShieldCheckIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">Enterprise Security</h3>
                  <p className="mt-1 text-zinc-300">Bank-grade encryption and DDoS protection.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="rounded-lg bg-[#f97316] p-3">
                  <BoltIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">24/7 Monitoring</h3>
                  <p className="mt-1 text-zinc-300">Proactive monitoring with instant resolution.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Black background */}
      <section className="bg-[#050505] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#f97316]">Next Step</p>
            <h2 className="mt-3 text-4xl font-black text-zinc-100 sm:text-5xl">Ready to get connected?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-300 sm:text-base">
              Contact us for coverage checks and installation.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="tel:+27799381260"
                className="rounded-xl bg-[#f97316] px-7 py-3 text-sm font-bold text-white transition hover:brightness-110"
              >
                Call 079 938 1260
              </a>
              <Link
                href="/contact"
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-7 py-3 text-sm font-bold text-zinc-100 transition hover:border-[#f97316]/70"
              >
                Send Enquiry
              </Link>
            </div>
            
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#f97316]">500+</div>
                <div className="text-sm text-zinc-400">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#f97316]">99%</div>
                <div className="text-sm text-zinc-400">Uptime Guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#f97316]">24/7</div>
                <div className="text-sm text-zinc-400">Local Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default IspPageColorful;
