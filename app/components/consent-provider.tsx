'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type ConsentChoice = 'accepted' | 'essential' | null

export const COOKIE_CHOICE_KEY = 'vc_cookie_choice'
export const OPEN_COOKIE_SETTINGS_EVENT = 'vc-open-cookie-settings'

type ConsentContextValue = {
  consent: ConsentChoice
  bannerOpen: boolean
  isMounted: boolean
  setConsent: (choice: Exclude<ConsentChoice, null>) => void
  openBanner: () => void
  closeBanner: () => void
}

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined)

export const ConsentProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize state from localStorage to avoid setState in useEffect
  const getInitialConsent = (): ConsentChoice => {
    if (typeof window === 'undefined') return null
    try {
      const savedChoice = window.localStorage.getItem(COOKIE_CHOICE_KEY) as ConsentChoice
      return (savedChoice === 'accepted' || savedChoice === 'essential') ? savedChoice : null
    } catch (e) {
      console.warn('Failed to read from localStorage:', e)
      return null
    }
  }

  const [consent, setConsentState] = useState<ConsentChoice>(getInitialConsent)
  const [isMounted, setIsMounted] = useState(false)
  const [bannerOpen, setBannerOpen] = useState(() => getInitialConsent() === null)

  useEffect(() => {
    setIsMounted(true)
    // Only set up timer if no consent was given
    if (consent === null) {
      const timer = window.setTimeout(() => setBannerOpen(true), 1200)
      return () => window.clearTimeout(timer)
    }
  }, [consent])

  useEffect(() => {
    const openFromEvent = () => setBannerOpen(true)
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openFromEvent)
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openFromEvent)
  }, [])

  const setConsent = (choice: Exclude<ConsentChoice, null>) => {
    try {
      window.localStorage.setItem(COOKIE_CHOICE_KEY, choice)
    } catch (e) {
      console.warn('Failed to write to localStorage:', e)
    }
    setConsentState(choice)
    setBannerOpen(false)
  }

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      bannerOpen,
      isMounted,
      setConsent,
      openBanner: () => setBannerOpen(true),
      closeBanner: () => setBannerOpen(false),
    }),
    [consent, bannerOpen, isMounted],
  )

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
}

export const useConsent = () => {
  const context = useContext(ConsentContext)
  if (!context) {
    throw new Error('useConsent must be used inside ConsentProvider')
  }
  return context
}
