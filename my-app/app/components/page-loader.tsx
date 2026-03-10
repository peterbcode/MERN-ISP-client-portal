'use client'

import { useEffect, useState } from 'react'

const loadingMessages = [
  'Optimizing network pathways for peak performance...',
  'Calibrating fiber optic signals with precision...',
  'Deploying enterprise-grade security protocols...',
  'Synchronizing distributed network nodes...',
  'Validating ISP service level agreements...',
  'Configuring advanced routing algorithms...',
  'Establishing secure VPN tunnels...',
  'Performing bandwidth optimization analysis...',
  'Implementing network traffic shaping policies...',
  'Verifying DNS resolution across all zones...',
  'Activating redundant failover systems...',
  'Fine-tuning wireless antenna alignments...',
  'Conducting latency reduction protocols...',
  'Establishing peer-to-peer network connections...',
  'Optimizing cloud infrastructure resources...',
  'Validating network topology mappings...',
  'Configuring Quality of Service parameters...',
  'Performing comprehensive network diagnostics...',
  'Establishing secure firewall rulesets...',
  'Optimizing database query performance...',
]

const PageLoader = () => {
  const [visible, setVisible] = useState(true)
  const [subText, setSubText] = useState(loadingMessages[0])

  useEffect(() => {
    let messageIndex = 0
    const messageTimer = window.setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length
      setSubText(loadingMessages[messageIndex])
    }, 900)

    const hideLoader = () => {
      window.setTimeout(() => setVisible(false), 900)
    }

    if (document.readyState === 'complete') {
      hideLoader()
    } else {
      window.addEventListener('load', hideLoader, { once: true })
    }

    return () => {
      window.clearInterval(messageTimer)
      window.removeEventListener('load', hideLoader)
    }
  }, [])

  if (!visible) return null

  return (
    <div className="page-loader" role="status" aria-live="polite" aria-label="Loading website">
      <div className="page-loader__bg-orbs">
        <div className="page-loader__orb page-loader__orb--1" />
        <div className="page-loader__orb page-loader__orb--2" />
        <div className="page-loader__orb page-loader__orb--3" />
      </div>
      <div className="page-loader__inner">
        <p className="page-loader__chip">Booting Valley Systems</p>
        <div className="page-loader__ring" />
        <p className="page-loader__logo">
          <span className="page-loader__logo-rv">VALLEY</span>
          <span className="page-loader__logo-text">COMPUTERS</span>
        </p>
        <p className="page-loader__tagline">IT - ISP - NETWORKING</p>
        <div className="page-loader__bar-wrap">
          <div className="page-loader__bar" />
        </div>
        <div className="page-loader__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="page-loader__sub">{subText}</p>
      </div>
    </div>
  )
}

export default PageLoader
