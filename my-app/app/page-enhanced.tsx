import Navbar from "./components/navbar"
import Hero from "./components/hero"
import BrandCarousel from "./components/brand-carousel"
import Services from "./components/services"
import Gallery from "./components/gallery"
import SuccessStories from "./components/success-stories"
import ContactStrip from "./components/contact-strip"
import EasterEggGames from "./components/easter-egg-games"
import SiteFooter from "./components/site-footer"

const Page = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <BrandCarousel />
      <Services />
      <Gallery />
      <SuccessStories />
      <ContactStrip />
      <EasterEggGames />
      <SiteFooter />
    </>
  )
}

export default Page
