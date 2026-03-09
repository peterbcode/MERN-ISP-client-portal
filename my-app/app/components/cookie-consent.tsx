'use client'

import { useConsent } from './consent-provider'

const CookieConsent = () => {
  const { bannerOpen, setConsent, closeBanner } = useConsent()
  if (!bannerOpen) return null

  return (
    <div className="fixed bottom-4 left-4 z-[65] w-[min(430px,92vw)] rounded-2xl border border-zinc-700 bg-zinc-900/95 p-4 text-zinc-200 shadow-[0_20px_40px_rgba(0,0,0,0.45)] sm:bottom-6 sm:left-6 sm:p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-400">Cookie Preferences</p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-300">
        We use essential cookies for site performance and optional cookies for analytics and improvements.
      </p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => setConsent('accepted')}
          className="rounded-lg bg-[#f97316] px-4 py-2 text-sm font-bold text-white transition hover:brightness-110"
        >
          Accept all
        </button>
        <button
          type="button"
          onClick={() => setConsent('essential')}
          className="rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500"
        >
          Essential only
        </button>
        <button
          type="button"
          onClick={closeBanner}
          className="rounded-lg border border-transparent px-4 py-2 text-sm font-semibold text-zinc-400 transition hover:text-zinc-200"
        >
          Later
        </button>
      </div>
    </div>
  )
}

export default CookieConsent
