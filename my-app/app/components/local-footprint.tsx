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
    <section className="bg-[radial-gradient(circle_at_50%_95%,rgba(243,111,0,0.12),transparent_55%),linear-gradient(to_bottom,#060606,#0a0a0a)] py-20 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Our Local Footprint</h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-300">
            We are deeply rooted in the Western Cape. Our network infrastructure is purpose-built to provide reliable, high-speed internet to the valley and its surrounding hubs.
          </p>

          <div className="mt-10 space-y-5">
            {footprintItems.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-[#f36f00]/30 bg-[linear-gradient(120deg,rgba(243,111,0,0.15),rgba(20,20,20,0.7))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f36f00] text-white">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{item.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-zinc-300">{item.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="relative self-center overflow-hidden rounded-3xl border border-[#f5d9bc]/70 bg-zinc-900 shadow-[0_22px_45px_rgba(0,0,0,0.45)]">
          <div className="absolute left-4 top-4 z-10">
            <a
              href="https://maps.google.com/?q=Riebeek-Kasteel"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-white/95 px-4 py-2 text-sm font-semibold text-slate-700 shadow hover:bg-white"
            >
              Open in Maps
            </a>
          </div>

          <div className="absolute left-4 right-4 top-20 z-10 rounded-2xl border border-zinc-300 bg-white/95 px-4 py-3 shadow">
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Coverage: Riebeek Kasteel, Malmesbury, Gouda, Riebeek West, Hermon, Abbotsdale, Chatsworth and the Swartland region
            </p>
          </div>

          <iframe
            title="Riebeek Valley coverage map"
            src="https://maps.google.com/maps?q=Riebeek-Kasteel&t=&z=12&ie=UTF8&iwloc=&output=embed"
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
