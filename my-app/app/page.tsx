import Navbar from "./components/navbar"
import Hero from "./components/hero"
import BrandCarousel from "./components/brand-carousel"
import Services from "./components/services"
import OurWork from "./components/our-work"
import SuccessStories from "./components/success-stories"
import LocalFootprint from "./components/local-footprint"
import ContactStrip from "./components/contact-strip"
import SiteFooter from "./components/site-footer"

const Page = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <BrandCarousel />
      <Services />
      <OurWork />
      <SuccessStories />
      <LocalFootprint />
      <ContactStrip />
      <SiteFooter />
    </>
  )
}

export default Page
