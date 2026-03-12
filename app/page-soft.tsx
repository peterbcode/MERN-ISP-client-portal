'use client'

import { useEffect } from 'react'
import './design-system.css'
import NavbarSoft from "./components/navbar-soft"
import HeroSoft from "./components/hero-soft"
import BrandCarousel from "./components/brand-carousel"
import ServicesSoft from "./components/services-soft"
import Gallery from "./components/gallery"
import SuccessStories from "./components/success-stories"
import ContactStripSoft from "./components/contact-strip-soft"
import EasterEggGames from "./components/easter-egg-games"
import SiteFooter from "./components/site-footer"

const PageSoft = () => {
  useEffect(() => {
    // Scroll to top on page load/reload
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <NavbarSoft />
      <HeroSoft />
      <BrandCarousel />
      <ServicesSoft />
      <Gallery />
      <SuccessStories />
      <ContactStripSoft />
      <EasterEggGames />
      <SiteFooter />
    </>
  )
}

export default PageSoft
