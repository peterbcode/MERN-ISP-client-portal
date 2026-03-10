'use client'

import { useEffect, useState } from 'react'
import {
  ArrowUpIcon,
  PaperAirplaneIcon,
  WifiIcon,
  ComputerDesktopIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid'

const WHATSAPP_NUMBER = '27799381260'
const CHAT_DISMISS_KEY = 'vc_chat_dismiss_until'

const quickReplies = [
  { label: 'Internet plans & pricing', icon: WifiIcon },
  { label: 'PC repair support', icon: ComputerDesktopIcon },
  { label: 'Report an issue', icon: ExclamationTriangleIcon },
]

const WhatsAppLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
    <path d="M13.601 2.326A7.85 7.85 0 0 0 8.06 0C3.65 0 .064 3.583.064 7.993c0 1.398.366 2.762 1.06 3.965L0 16l4.159-1.122a7.94 7.94 0 0 0 3.9 1.014h.003c4.41 0 7.996-3.584 7.996-7.994a7.94 7.94 0 0 0-2.457-5.572zm-5.54 12.24h-.003a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.468.666.66-2.407-.156-.248a6.6 6.6 0 0 1-1.012-3.505c0-3.66 2.98-6.64 6.646-6.64a6.6 6.6 0 0 1 4.695 1.945 6.6 6.6 0 0 1 1.944 4.696c-.001 3.664-2.981 6.645-6.65 6.645z" />
    <path d="M11.18 9.672c-.2-.1-1.176-.58-1.357-.646-.182-.067-.315-.1-.448.1-.133.2-.514.646-.63.78-.116.133-.232.15-.43.05-.2-.1-.84-.309-1.6-.986-.592-.527-.992-1.178-1.108-1.378-.116-.2-.012-.308.087-.407.09-.09.2-.232.3-.348.1-.116.133-.2.2-.333.066-.133.033-.25-.017-.348-.05-.1-.448-1.08-.613-1.48-.161-.387-.325-.335-.448-.342h-.38c-.133 0-.348.05-.53.25-.182.2-.695.679-.695 1.655s.712 1.919.811 2.052c.1.133 1.402 2.141 3.397 3.003.475.205.845.327 1.133.418.476.151.909.13 1.251.079.382-.057 1.176-.48 1.342-.943.166-.464.166-.862.116-.943-.05-.08-.182-.13-.381-.23z" />
  </svg>
)

const FloatingActions = () => {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true

      window.requestAnimationFrame(() => {
        const scrollBottom = window.scrollY + window.innerHeight
        const docHeight = document.documentElement.scrollHeight
        setShowBackToTop(window.scrollY > 450 && scrollBottom >= docHeight - 220)
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const openWhatsApp = (text: string) => {
    const encoded = encodeURIComponent(text)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank', 'noopener,noreferrer')
  }

  const closeDialog = () => {
    setChatOpen(false)
    const dismissFor24Hours = Date.now() + 24 * 60 * 60 * 1000
    window.localStorage.setItem(CHAT_DISMISS_KEY, String(dismissFor24Hours))
  }

  return (
    <div className="fixed bottom-4 right-4 z-[70] flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isMounted && showBackToTop ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/95 text-zinc-100 shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition hover:border-[#f97316] hover:text-[#f97316]"
          aria-label="Scroll to top"
        >
          <ArrowUpIcon className="h-5 w-5" />
        </button>
      ) : null}

      {chatOpen ? (
        <div className="w-[min(360px,92vw)] overflow-hidden rounded-2xl border border-zinc-700 bg-[#f2f4f3] shadow-[0_18px_38px_rgba(0,0,0,0.45)]">
          <div className="flex items-start justify-between bg-[#0f766e] px-4 py-3 text-white">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <WhatsAppLogo className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-bold">Valley Computers Support</p>
                <p className="text-sm text-emerald-100">Typically replies same day</p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeDialog}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10"
              aria-label="Close WhatsApp dialog"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="bg-[#ece9e3] px-4 py-5">
            <div className="max-w-[290px] rounded-xl bg-white p-4 text-zinc-700 shadow-sm">
              <p className="text-base leading-relaxed">
                Hi there! Need help with internet, support or pricing? Start a chat and our team will assist.
              </p>
            </div>
          </div>

          <div className="px-4 pb-4 pt-5">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">Quick Replies</p>
            <div className="mt-3 space-y-2.5">
              {quickReplies.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => openWhatsApp(item.label)}
                  className="flex w-full items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-base text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100"
                >
                  <item.icon className="h-5 w-5 text-emerald-500" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2.5">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Type a message..."
                className="h-11 w-full rounded-full border border-zinc-800 bg-zinc-900 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#f97316] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => openWhatsApp(message.trim() || 'Hi, I need help with your services.')}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#22c55e] text-white transition hover:brightness-110"
                aria-label="Send WhatsApp message"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="rounded-full border border-zinc-700 bg-zinc-900/95 px-3 py-1 text-xs font-semibold text-zinc-300 shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
          Need help? Chat with us
        </p>
      )}

      <button
        type="button"
        onClick={() => setChatOpen((current) => !current)}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#22c55e] text-white shadow-[0_10px_24px_rgba(34,197,94,0.45)] transition hover:brightness-110"
        aria-label="Open WhatsApp chat"
      >
        <WhatsAppLogo className="h-7 w-7" />
      </button>
    </div>
  )
}

export default FloatingActions
