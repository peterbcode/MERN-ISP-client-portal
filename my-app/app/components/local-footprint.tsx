const LocalFootprint = () => {
  return (
    <section className="bg-[#111111] py-16 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f36f00]">Coverage</p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Our Local Footprint</h2>
          <p className="mt-4 text-sm leading-7 text-zinc-300">
            We deliver dependable internet and IT services across Riebeek Kasteel and surrounding regions, with practical on-site support and proactive maintenance.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-zinc-200">
            <li>• Riebeek Kasteel</li>
            <li>• Riebeek West</li>
            <li>• Hermon</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="h-64 rounded-xl bg-zinc-700/60" />
        </div>
      </div>
    </section>
  )
}

export default LocalFootprint
