'use client'

import Link from 'next/link'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { MapPinIcon, PhoneIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { Facebook } from 'lucide-react'
import ManageCookiesButton from './manage-cookies-button'

const services = [
  { label: 'Fibre to the Home', href: '/isp#plans' },
  { label: 'Wireless Business Internet', href: '/isp#plans' },
  { label: 'PC Repairs', href: '/contact' },
  { label: 'Network Security', href: '/contact' },
  { label: 'Managed IT Support', href: '/contact' },
]

const supportHub = [
  { label: 'Remote Support', href: '/contact' },
  { label: 'Speed Test', href: '/dashboard/stats' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Acceptable Use', href: '/terms' },
]

const facebookUrl = 'https://www.facebook.com/people/Valley-Computers/100089852750217/'

const SiteFooter = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedEmail = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.')
      }

      setEmail('')
      setStatus('success')
      setMessage(data.message || 'Thanks, you are on the list.')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <footer className="border-t border-zinc-800 bg-[#060607] text-zinc-300">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-zinc-800/80 pb-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-3xl font-black tracking-tight text-zinc-100">
              <span className="text-[#f97316]">RV</span>COMPUTERS
            </p>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-zinc-400">
              Powering the Riebeek Valley with high-speed connectivity and precision IT engineering.
              Your local partner for a digital future.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-lg font-bold text-zinc-200 transition hover:border-[#f97316] hover:bg-zinc-800 hover:text-zinc-100"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="heading-compact text-2xl font-extrabold text-zinc-100">Services</h3>
            <div className="mt-3 h-0.5 w-[4.5rem] bg-[#f97316]" />
            <ul className="mt-5 space-y-3 text-base text-zinc-400">
              {services.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition hover:text-[#f97316]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="heading-compact text-2xl font-extrabold text-zinc-100">Support Hub</h3>
            <div className="mt-3 h-0.5 w-28 bg-[#f97316]" />
            <ul className="mt-5 space-y-3 text-base text-zinc-400">
              {supportHub.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition hover:text-[#f97316]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="heading-compact text-2xl font-extrabold text-zinc-100">Stay Connected</h3>
            <div className="mt-3 h-0.5 w-32 bg-[#f97316]" />
            <p className="mt-8 text-sm font-bold uppercase tracking-[0.14em] text-zinc-300">
              Join our mailing list
            </p>
            <form
              onSubmit={handleSubscribe}
              className="mt-4 flex w-full max-w-sm overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900"
            >
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (status !== 'loading') {
                    setStatus('idle')
                    setMessage('')
                  }
                }}
                placeholder="Email Address"
                autoComplete="email"
                aria-label="Email address"
                disabled={status === 'loading'}
                className="w-full bg-transparent px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                disabled={status === 'loading'}
                className="inline-flex w-14 items-center justify-center bg-[#f97316] text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </form>
            {message && (
              <p
                className={`mt-3 max-w-sm text-sm ${
                  status === 'success' ? 'text-emerald-400' : 'text-red-400'
                }`}
                aria-live="polite"
              >
                {message}
              </p>
            )}

            <div className="mt-16 space-y-3 text-base text-zinc-300">
              <a
                href="https://www.google.com/maps/search/?api=1&query=6%20Church%20Rd%2C%20Riebeek-Kasteel%2C%207307"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition hover:text-[#f97316]"
              >
                <MapPinIcon className="h-5 w-5 text-[#f97316]" />
                6 Church Rd, Riebeek-Kasteel, 7307
              </a>
              <a href="tel:+27799381260" className="flex items-center gap-2 transition hover:text-[#f97316]">
                <PhoneIcon className="h-5 w-5 text-[#f97316]" />
                079 938 1260
              </a>
            </div>
          </div>
        </div>

        <div className="pt-7 text-sm text-zinc-500 sm:flex sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-3">
            <span>(c) 2026 Riebeek Valley Computers (Pty) Ltd.</span>
            <span>|</span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#f97316]" />
              Network Status: Online
            </span>
            <span>|</span>
            <ManageCookiesButton />
          </p>
          <p className="mt-3 sm:mt-0">Reg No: 20XX/XXXXXX/07 | ICASA Licensed Provider</p>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
