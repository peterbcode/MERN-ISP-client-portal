import Link from 'next/link'

const SiteFooter = () => {
  return (
    <footer className="border-t border-zinc-800 bg-[#060606] text-zinc-300">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-2xl font-black tracking-tight text-white">
              <span className="text-[#f36f00]">VALLEY</span> COMPUTERS
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-400">
              Professional ISP and IT services for homes and businesses across the Western Cape.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">Navigation</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/" className="transition hover:text-[#f36f00]">Home</Link></li>
              <li><Link href="/#services" className="transition hover:text-[#f36f00]">Services</Link></li>
              <li><Link href="/#success-stories" className="transition hover:text-[#f36f00]">Success Stories</Link></li>
              <li><Link href="/contact" className="transition hover:text-[#f36f00]">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">Core Services</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Fibre Internet</li>
              <li>Wireless Internet</li>
              <li>PC Repairs</li>
              <li>Network Engineering</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Riebeek Kasteel, Western Cape</li>
              <li>
                <a href="tel:+27799381260" className="transition hover:text-[#f36f00]">079 938 1260</a>
              </li>
              <li>
                <a href="mailto:info@valley-computers.co.za" className="transition hover:text-[#f36f00]">
                  info@valley-computers.co.za
                </a>
              </li>
              <li>
                <a href="https://wa.me/27799381260" className="transition hover:text-[#f36f00]">WhatsApp Support</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Subscribe to our mailing list</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Get updates on coverage rollouts, network upgrades, and service offers.
              </p>
            </div>
            <form className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#f36f00] focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#f36f00] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-5 text-xs text-zinc-500 sm:flex sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Valley Computers. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Built for reliable local connectivity.</p>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
