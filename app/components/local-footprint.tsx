import { MapPinIcon } from '@heroicons/react/24/solid'

const footprintItems = [
  {
    title: 'Riebeek Kasteel HQ',
    description:
      "Our main operations center providing expert support and managing the valley's fibre backbone.",
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=6%20Church%20Rd%2C%20Riebeek-Kasteel%2C%207307',
  },
  {
    title: 'Malmesbury Coverage',
    description:
      'Full ISP and technical support services extended to the growing business and residential hubs of Malmesbury.',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Malmesbury%2C%20Western%20Cape%2C%20South%20Africa',
  },
  {
    title: 'Swartland Region',
    description:
      'Comprehensive coverage across the wider Swartland area, serving surrounding farms and communities with reliable connectivity.',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Swartland%2C%20Western%20Cape%2C%20South%20Africa',
  },
]

const LocalFootprint = () => {
  return (
    <section className="scroll-mt-28 bg-[radial-gradient(circle_at_18%_10%,rgba(20,184,166,0.08),transparent_38%),linear-gradient(to_bottom,#0c0e11,#111315)] py-14 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]">Coverage</p>
          <h2 className="heading-compact mt-3 text-3xl font-black tracking-tight sm:text-4xl">Our Local Footprint</h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-300">
            We are deeply rooted in the Western Cape. Our network infrastructure is purpose-built to provide reliable, high-speed internet to the valley and its surrounding hubs.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {footprintItems.map((item) => (
            <a
              key={item.title}
              href={item.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer rounded-3xl border border-white/10 bg-[#15181b] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#14b8a6]/60 hover:shadow-[0_18px_34px_rgba(20,184,166,0.12)]"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#f97316] text-black shadow-[0_8px_22px_rgba(249,115,22,0.22)] transition group-hover:scale-110">
                <MapPinIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300 sm:text-base">{item.description}</p>
            </a>
          ))}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
          <div className="rounded-3xl border border-white/10 bg-[#15181b] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <p className="text-sm font-bold uppercase tracking-wide text-[#f97316]">Active Service Area</p>
            <p className="mt-4 text-base leading-relaxed text-zinc-300">
              Coverage: Riebeek Kasteel, Malmesbury, Gouda, Riebeek West, Hermon, Abbotsdale, Chatsworth and Swartland region
            </p>
            <div className="mt-6 rounded-2xl border border-[#14b8a6]/25 bg-[#14b8a6]/10 p-4">
              <p className="text-sm font-semibold text-zinc-100">
                Local technicians, regional routing, and practical site surveys keep coverage grounded in real terrain.
              </p>
            </div>
          </div>

          <div className="relative self-center overflow-hidden rounded-3xl border border-white/10 bg-[#15181b] shadow-[0_22px_45px_rgba(0,0,0,0.38)]">
            <div className="absolute left-4 right-4 top-4 z-10 rounded-2xl border border-white/10 bg-[#111315]/95 px-4 py-3 shadow">
              <p className="text-sm font-bold uppercase tracking-wide text-zinc-300">
                Swartland coverage map
              </p>
            </div>

            <iframe
              title="Swartland coverage map"
              src="https://maps.google.com/maps?q=Riebeek+Kasteel+Swartland&t=&z=11&ie=UTF8&iwloc=&output=embed"
              className="h-[520px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default LocalFootprint
