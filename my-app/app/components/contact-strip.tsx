import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

const inputClass =
  'w-full rounded-xl border border-zinc-700 bg-zinc-900/70 px-4 py-3 text-base text-zinc-100 placeholder:text-zinc-500 focus:border-[#f97316] focus:outline-none'

const ContactStrip = () => {
  return (
    <section className="scroll-mt-28 bg-[#f97316] py-16 text-white sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold !text-black sm:text-5xl">Check Your Coverage</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/90 sm:text-lg">
            Enter your address to see if we provide service in your area.
          </p>
        </div>

        <form className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_16px_35px_rgba(0,0,0,0.35)] sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-200">Street Address</span>
              <input className={inputClass} placeholder="6 Church Rd" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-200">Area/Suburb</span>
              <input className={inputClass} placeholder="Riebeek Kasteel" />
            </label>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-200">City</span>
              <input className={inputClass} placeholder="Western Cape" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-200">Postal Code</span>
              <input className={inputClass} placeholder="7307" />
            </label>
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#f97316] px-7 py-3 text-lg font-bold text-white transition hover:brightness-110 lg:w-auto"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              Check Coverage
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default ContactStrip
