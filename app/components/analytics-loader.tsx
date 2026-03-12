'use client'

import Script from 'next/script'
import { useConsent } from './consent-provider'

const AnalyticsLoader = () => {
  const { consent } = useConsent()
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  if (consent !== 'accepted' || !gaId) {
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
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  )
}

export default AnalyticsLoader
