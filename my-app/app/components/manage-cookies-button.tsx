'use client'

import { OPEN_COOKIE_SETTINGS_EVENT } from './consent-provider'

const ManageCookiesButton = () => {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
      className="text-zinc-500 transition hover:text-[#f97316]"
    >
      Manage Cookies
    </button>
  )
}

export default ManageCookiesButton
