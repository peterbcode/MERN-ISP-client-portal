import {
  BoltIcon,
  ChartBarIcon,
  LifebuoyIcon,
  MapPinIcon,
  ShieldCheckIcon,
  WifiIcon,
} from "@heroicons/react/24/solid";

const locationStats = [
  "Riebeek Kasteel",
  "Malmesbury",
  "Swartland",
  "99% Uptime",
];

const valueCards = [
  {
    title: "Lightning Fast",
    text: "Built for streaming, remote work, and always-on devices.",
    icon: BoltIcon,
  },
  {
    title: "99% Uptime",
    text: "Business-grade reliability with consistent local performance.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Local Support",
    text: "Real people, real support, from your local team.",
    icon: LifebuoyIcon,
  },
];

const priceCards = [
  { speed: "2 Mbps", label: "Basic browsing", price: "R350/mo" },
  { speed: "4 Mbps", label: "Streaming + work", price: "R550/mo" },
  { speed: "6 Mbps", label: "Family usage", price: "R650/mo", featured: true },
  { speed: "8 Mbps", label: "Heavy usage", price: "R850/mo" },
  { speed: "10 Mbps", label: "Premium speed", price: "R1050/mo" },
];

const IspPage = () => {
  return (
    <main className="bg-black text-white">
      <section className="relative overflow-hidden border-b border-zinc-900 bg-[radial-gradient(circle_at_20%_10%,rgba(243,111,0,0.2),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(243,111,0,0.12),transparent_40%),linear-gradient(to_bottom,#040404,#090909)]">
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(to right, #f97316 1px, transparent 1px), linear-gradient(to bottom, #f97316 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-44 text-center sm:px-6 sm:pt-48 lg:px-8 lg:pt-56">
          <WifiIcon className="mx-auto h-6 w-6 text-[#f36f00]" />
          <h1 className="mt-4 text-5xl font-black leading-[0.95] sm:text-6xl lg:text-8xl">
            <span className="block text-[#f36f00]">Blazing Fast</span>
            <span className="block">Internet at</span>
            <span className="block text-[#f36f00]">3 Mbps</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm text-zinc-300 sm:text-base">
            Uncapped Fibre and Wireless for Riebeek Valley. No throttling, no limits, just pure speed with 99% uptime.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button className="rounded-xl bg-[#f36f00] px-7 py-3 text-sm font-bold transition hover:brightness-110">View Plans</button>
            <button className="rounded-xl border border-zinc-700 bg-zinc-900 px-7 py-3 text-sm font-bold transition hover:border-zinc-500">Get In Touch</button>
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {locationStats.map((item) => (
              <div key={item} className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-4">
                <MapPinIcon className="mx-auto h-4 w-4 text-[#f36f00]" />
                <p className="mt-2 text-xs font-semibold text-zinc-200">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-cursor-invert className="bg-[#f36f00] py-16 text-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.15em] text-white/85">Why We&apos;re Different</p>
          <h2 className="mt-3 text-center text-4xl font-black text-white sm:text-5xl">Why Choose Our Internet</h2>
          <p className="mt-4 text-center text-sm text-white/85">Built for the Western Cape with local support and enterprise-grade reliability.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {valueCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-black/20 bg-zinc-950 p-7 text-white">
                <card.icon className="h-8 w-8 text-[#f36f00]" />
                <h3 className="mt-5 text-xl font-extrabold">{card.title}</h3>
                <p className="mt-3 text-sm text-zinc-300">{card.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-zinc-950 px-4 py-3 text-center text-sm font-bold text-white">Uncapped Data</div>
            <div className="rounded-lg bg-zinc-950 px-4 py-3 text-center text-sm font-bold text-white">No Throttling</div>
            <div className="rounded-lg bg-zinc-950 px-4 py-3 text-center text-sm font-bold text-white">Free Router Setup</div>
            <div className="rounded-lg bg-zinc-950 px-4 py-3 text-center text-sm font-bold text-white">No Contracts</div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-zinc-900 bg-[linear-gradient(to_bottom,#040404,#090909)] py-16">
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(to right, #f97316 1px, transparent 1px), linear-gradient(to bottom, #f97316 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.15em] text-[#f36f00]">Transparent Pricing</p>
          <h2 className="mt-3 text-center text-4xl font-black sm:text-5xl">Choose Your Speed</h2>
          <p className="mt-4 text-center text-sm text-zinc-300">No hidden fees. Just fast, reliable internet on every plan.</p>
          <div className="mt-10 grid gap-4 lg:grid-cols-5">
            {priceCards.map((plan) => (
              <article
                key={plan.speed}
                className={`rounded-2xl border p-5 ${
                  plan.featured
                    ? "border-[#f36f00] bg-zinc-950 shadow-[0_0_35px_rgba(243,111,0,0.28)]"
                    : "border-zinc-800 bg-zinc-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xl font-black">{plan.speed}</p>
                  {plan.featured ? <span className="rounded-full bg-[#f36f00] px-2 py-1 text-[10px] font-bold uppercase">Most Popular</span> : null}
                </div>
                <p className="mt-2 text-xs text-zinc-400">{plan.label}</p>
                <p className="mt-4 text-3xl font-extrabold text-white">{plan.price}</p>
                <ul className="mt-4 space-y-2 text-xs text-zinc-300">
                  <li className="flex items-center gap-2"><ChartBarIcon className="h-3.5 w-3.5 text-[#f36f00]" />Uncapped data</li>
                  <li className="flex items-center gap-2"><ChartBarIcon className="h-3.5 w-3.5 text-[#f36f00]" />Wireless or fibre</li>
                  <li className="flex items-center gap-2"><ChartBarIcon className="h-3.5 w-3.5 text-[#f36f00]" />Priority support</li>
                </ul>
                <button className={`mt-5 w-full rounded-lg px-4 py-2 text-sm font-bold ${plan.featured ? "bg-white text-black" : "bg-[#f36f00]"}`}>Get Started</button>
              </article>
            ))}
          </div>
          <div className="mt-7 grid gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:grid-cols-3">
            <p className="text-center text-sm"><span className="font-black text-white">R1,000</span> one-off installation</p>
            <p className="text-center text-sm"><span className="font-black text-white">R100/mo</span> optional UPS rental</p>
            <p className="text-center text-sm"><span className="font-black text-emerald-400">R0</span> contract lock-in fee</p>
          </div>
        </div>
      </section>

      <section data-cursor-invert className="bg-[#f36f00] py-16 text-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.15em] text-white/85">Let&apos;s Get You Connected</p>
          <h2 className="mt-3 text-center text-4xl font-black text-white sm:text-5xl">Ready to Get Connected?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-white/85">
            Join happy customers in Riebeek Valley enjoying fast internet with local support.
          </p>
          <div className="mx-auto mt-6 grid max-w-2xl grid-cols-3 border border-black/20 bg-[#f58226] text-center text-sm font-extrabold text-white">
            <div className="py-2">99% Uptime</div>
            <div className="py-2">24/7 Support</div>
            <div className="py-2">Local Team</div>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-black/20 bg-zinc-950 p-6 text-white">
              <h3 className="text-xl font-extrabold">Call Us</h3>
              <p className="mt-2 text-sm text-zinc-300">079 938 1260</p>
              <h3 className="mt-6 text-xl font-extrabold">Email</h3>
              <p className="mt-2 text-sm text-zinc-300">info@valley-computers.co.za</p>
              <h3 className="mt-6 text-xl font-extrabold">WhatsApp</h3>
              <p className="mt-2 text-sm text-zinc-300">+27 79 938 1260</p>
              <h3 className="mt-6 text-xl font-extrabold">Visit Us</h3>
              <p className="mt-2 text-sm text-zinc-300">6 Church Rd, Riebeek-Kasteel, 7307</p>
            </article>
            <form className="rounded-2xl border border-black/20 bg-zinc-950 p-6 text-white">
              <h3 className="text-xl font-extrabold">Send us a message</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" placeholder="Full Name" />
                <input className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" placeholder="Email" />
                <input className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" placeholder="Phone" />
                <select className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300">
                  <option>Select a service</option>
                  <option>Fibre</option>
                  <option>Wireless</option>
                  <option>Business Networking</option>
                </select>
                <textarea className="min-h-28 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm sm:col-span-2" placeholder="Tell us about your internet needs..." />
              </div>
              <button className="mt-4 w-full rounded-lg bg-[#f36f00] px-4 py-2.5 text-sm font-bold text-white hover:brightness-110">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default IspPage;
