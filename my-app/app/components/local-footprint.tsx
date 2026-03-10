import { BuildingOffice2Icon, CpuChipIcon, MapIcon } from '@heroicons/react/24/solid'

const footprintItems = [
  {
    title: 'Riebeek Kasteel HQ',
    description:
      "Our main operations center providing expert support and managing the valley's fibre backbone.",
    icon: BuildingOffice2Icon,
  },
  {
    title: 'Malmesbury Coverage',
    description:
      'Full ISP and technical support services extended to the growing business and residential hubs of Malmesbury.',
    icon: CpuChipIcon,
  },
  {
    title: 'Swartland Region',
    description:
      'Comprehensive coverage across the wider Swartland area, serving surrounding farms and communities with reliable connectivity.',
    icon: MapIcon,
  },
]

const LocalFootprint = () => {
  return (
    <section className="scroll-mt-28 bg-[radial-gradient(circle_at_50%_5%,rgba(249,115,22,0.09),transparent_45%),linear-gradient(to_bottom,#070707,#0b0b0b)] py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]">Coverage</p>
          <h2 className="heading-compact mt-3 text-3xl font-black tracking-tight sm:text-4xl">Our Local Footprint</h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-300">
            We are deeply rooted in the Western Cape. Our network infrastructure is purpose-built to provide reliable, high-speed internet to the valley and its surrounding hubs.
          </p>

          <div className="mt-8 space-y-4">
            {footprintItems.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f97316] text-white">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-300 sm:text-base">{item.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="relative self-center overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-[0_22px_45px_rgba(0,0,0,0.45)]">
          <div className="absolute left-4 top-4 z-10">
            <a
              href="https://maps.google.com/?q=Riebeek+Kasteel+Swartland"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100 shadow hover:border-[#f97316]"
            >
              Open in Maps
            </a>
          </div>

          <div className="absolute left-4 right-4 top-20 z-10 rounded-2xl border border-zinc-700 bg-zinc-900/95 px-4 py-3 shadow">
            <p className="text-sm font-bold uppercase tracking-wide text-zinc-300">
              Coverage: Riebeek Kasteel, Malmesbury, Gouda, Riebeek West, Hermon, Abbotsdale, Chatsworth and the Swartland region
            </p>
          </div>

          <iframe
            title="Swartland coverage map"
            src="https://maps.google.com/maps?q=Riebeek+Kasteel+Swartland&t=&z=11&ie=UTF8&iwloc=&output=embed"
            className="h-[560px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}

export default LocalFootprint
