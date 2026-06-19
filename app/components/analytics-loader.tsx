'use client'

import Script from 'next/script'
import { useConsent } from './consent-provider'

const AnalyticsLoader = () => {
  const { consent } = useConsent()
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-8JD2TZ6FEF'

  if (consent !== 'accepted') {
    return null
  }

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="vc-google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  )
}

export default AnalyticsLoader
