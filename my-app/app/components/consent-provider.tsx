'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type ConsentChoice = 'accepted' | 'essential' | null

export const COOKIE_CHOICE_KEY = 'vc_cookie_choice'
export const OPEN_COOKIE_SETTINGS_EVENT = 'vc-open-cookie-settings'

type ConsentContextValue = {
  consent: ConsentChoice
  bannerOpen: boolean
  setConsent: (choice: Exclude<ConsentChoice, null>) => void
  openBanner: () => void
  closeBanner: () => void
}

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined)

export const ConsentProvider = ({ children }: { children: React.ReactNode }) => {
  const [consent, setConsentState] = useState<ConsentChoice>(null)
  const [bannerOpen, setBannerOpen] = useState(false)

  useEffect(() => {
    const savedChoice = window.localStorage.getItem(COOKIE_CHOICE_KEY) as ConsentChoice
    if (savedChoice === 'accepted' || savedChoice === 'essential') {
      setConsentState(savedChoice)
      setBannerOpen(false)
      return
    }

    const timer = window.setTimeout(() => setBannerOpen(true), 1200)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const openFromEvent = () => setBannerOpen(true)
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openFromEvent)
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openFromEvent)
  }, [])

  const setConsent = (choice: Exclude<ConsentChoice, null>) => {
    window.localStorage.setItem(COOKIE_CHOICE_KEY, choice)
    setConsentState(choice)
    setBannerOpen(false)
  }

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      bannerOpen,
      setConsent,
      openBanner: () => setBannerOpen(true),
      closeBanner: () => setBannerOpen(false),
    }),
    [consent, bannerOpen],
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
