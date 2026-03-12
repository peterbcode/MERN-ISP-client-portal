import Link from "next/link";
import {
  BoltIcon,
  ChartBarIcon,
  LifebuoyIcon,
  MapPinIcon,
  ShieldCheckIcon,
  WifiIcon,
  ArrowRightIcon,
  CheckIcon,
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
  { speed: "2 Mbps", label: "Basic browsing", price: "R350/mo" },
  { speed: "4 Mbps", label: "Streaming + work", price: "R550/mo" },
  { speed: "6 Mbps", label: "Family use", price: "R650/mo", featured: true },
  { speed: "8 Mbps", label: "Power users", price: "R850/mo" },
  { speed: "10 Mbps", label: "Premium", price: "R1050/mo" },
];

const IspPageColorful = () => {
  return (
    <main className="bg-[#050505] text-white">
      {/* Hero Section - Black background like homepage */}
      <section className="relative overflow-hidden bg-[#050505] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(249,115,22,0.15),transparent_42%),radial-gradient(circle_at_85%_10%,rgba(249,115,22,0.12),transparent_35%),linear-gradient(to_bottom,rgba(0,0,0,0.45),rgba(0,0,0,0.92))]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-18 pt-40 text-center sm:px-6 lg:px-8 lg:pb-22 lg:pt-52">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/85 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-300">
            <WifiIcon className="h-4 w-4 text-[#f97316]" />
            Fibre & Wireless Internet
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-black leading-[0.95] text-zinc-100 sm:text-6xl lg:text-7xl">
            Professional Internet Infrastructure for Homes and Businesses
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-300 sm:text-lg">
            Uncapped fibre & wireless internet with local support.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#plans"
              className="rounded-xl bg-[#f97316] px-7 py-3 text-sm font-bold text-white transition hover:brightness-110"
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

      {/* Value Section - Orange accent section */}
      <section className="bg-[radial-gradient(circle_at_50%_85%,rgba(243,111,0,0.08),transparent_52%),linear-gradient(to_bottom,#070707,#0b0b0b)] py-16 sm:py-20">
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

          <div className="mt-10 grid gap-4 lg:grid-cols-5">
            {plans.map((plan) => (
              <article
                key={plan.speed}
                className={`rounded-2xl border p-5 ${
                  plan.featured
                    ? "border-[#f97316] bg-zinc-950 shadow-[0_0_34px_rgba(249,115,22,0.22)]"
                    : "border-zinc-800 bg-zinc-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xl font-black text-zinc-100">{plan.speed}</p>
                  {plan.featured ? (
                    <span className="rounded-full bg-[#f97316] px-2 py-1 text-[10px] font-bold uppercase text-white">
                      Popular
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-xs text-zinc-400">{plan.label}</p>
                <div className="mt-4 rounded-lg border border-zinc-700 bg-black/30 px-3 py-2">
                  <p className="text-4xl font-black leading-none text-white sm:text-[2.7rem]">{plan.price}</p>
                </div>
                <ul className="mt-4 space-y-2 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <ChartBarIcon className="h-3.5 w-3.5 text-[#f97316]" />
                    Uncapped
                  </li>
                  <li className="flex items-center gap-2">
                    <ChartBarIcon className="h-3.5 w-3.5 text-[#f97316]" />
                    Fibre & Wireless
                  </li>
                  <li className="flex items-center gap-2">
                    <ChartBarIcon className="h-3.5 w-3.5 text-[#f97316]" />
                    Local Support
                  </li>
                </ul>
                <Link
                  href="/contact"
                  className={`mt-5 block w-full rounded-lg px-4 py-2 text-center text-sm font-bold ${
                    plan.featured ? "bg-white text-black" : "bg-[#f97316] text-white"
                  }`}
                >
                  Get Started
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-7 grid gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:grid-cols-3">
            <p className="text-center text-sm text-zinc-300">
              <span className="font-black text-zinc-100">R1,000</span> one-time installation
            </p>
            <p className="text-center text-sm text-zinc-300">
              <span className="font-black text-zinc-100">R100/mo</span> optional UPS rental
            </p>
            <p className="text-center text-sm text-zinc-300">
              <span className="font-black text-emerald-400">R0</span> contract lock-in fee
            </p>
          </div>
        </div>
      </section>

      {/* Technology Section - Orange accent section */}
      <section className="bg-[radial-gradient(circle_at_50%_85%,rgba(243,111,0,0.08),transparent_52%),linear-gradient(to_bottom,#070707,#0b0b0b)] py-16 sm:py-20">
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
