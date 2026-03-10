'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  BuildingOffice2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CpuChipIcon,
  MapIcon,
} from '@heroicons/react/24/solid'
import Image from 'next/image'
import { StarIcon } from '@heroicons/react/24/solid'
import AnimatedSection from './ui/animated-section'
import HoverCard from './ui/hover-card'
import PremiumButton from './ui/premium-button'

const stories = [
  {
    quote:
      "Valley Computers completely transformed our business connectivity. We went from constant downtime and slow speeds to rock-solid 99% uptime. The team was professional, installed everything in one day, and their local support is incredible - they actually answer the phone!",
    author: "Sarah J.",
    role: "Operations Manager",
    location: "Riebeek-Kasteel",
    avatar: "https://i.pravatar.cc/150?img=47",
    company: "Riebeek Valley Logistics",
    rating: 5,
    date: "2 months ago"
  },
  {
    quote:
      "As a remote team, reliable internet is everything. Valley Computers delivered beyond expectations - our video calls are crystal clear, file transfers are instant, and the uncapped package means no surprises on our bill. Best decision we made for our business.",
    author: "David M.",
    role: "Business Owner",
    location: "Malmesbury",
    avatar: "https://i.pravatar.cc/150?img=32",
    company: "Digital Marketing Agency",
    rating: 5,
    date: "3 months ago"
  },
  {
    quote:
      "Our old network was a mess - dead spots, slow speeds, constant complaints from staff. Valley Computers came in, did a complete network audit, redesigned our WiFi setup, and now we have perfect coverage everywhere. The difference is night and day.",
    author: "John P.",
    role: "IT Coordinator",
    location: "Swartland",
    avatar: "https://i.pravatar.cc/150?img=12",
    company: "Manufacturing Company",
    rating: 4,
    date: "1 month ago"
  },
  {
    quote:
      "Working from home used to be frustrating with constant disconnections. Since switching to Valley Computers, I've had zero downtime, and their support team actually knows what they're doing. When I had a minor setup question, they remote-accessed and fixed it in 10 minutes.",
    author: "Alicia K.",
    role: "Office Manager",
    location: "Piketberg",
    avatar: "https://i.pravatar.cc/150?img=45",
    company: "Financial Services Firm",
    rating: 5,
    date: "2 weeks ago"
  },
  {
    quote:
      "We moved our entire operation online during COVID and needed bulletproof connectivity. Valley Computers not only provided rock-solid internet but also helped us set up our entire network infrastructure. They're not just an ISP - they're technology partners.",
    author: "Mark T.",
    role: "Retail Owner",
    location: "Wellington",
    avatar: "https://i.pravatar.cc/150?img=20",
    company: "Retail Chain",
    rating: 5,
    date: "4 months ago"
  },
];

const footprintItems = [
  {
    title: 'Riebeek Kasteel',
    description: 'Core support hub and fibre backbone operations.',
    icon: BuildingOffice2Icon,
  },
  {
    title: 'Malmesbury',
    description: 'Business and residential ISP coverage and support.',
    icon: CpuChipIcon,
  },
  {
    title: 'Swartland',
    description: 'Reliable connectivity across surrounding towns and farms.',
    icon: MapIcon,
  },
]

const SuccessStories = () => {
  const [index, setIndex] = useState(0)
  const [cardsPerView, setCardsPerView] = useState(1)

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerView(3)
      } else if (window.innerWidth >= 640) {
        setCardsPerView(2)
      } else {
        setCardsPerView(1)
      }
    }

    updateCardsPerView()
    window.addEventListener('resize', updateCardsPerView)
    return () => window.removeEventListener('resize', updateCardsPerView)
  }, [])

  const maxIndex = Math.max(0, stories.length - cardsPerView)

  const activeIndex = Math.min(index, maxIndex)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIndex((current) => {
        const clamped = Math.min(current, maxIndex)
        return clamped >= maxIndex ? 0 : clamped + 1
      })
    }, 4500)
    return () => window.clearInterval(intervalId)
  }, [maxIndex])

  const translatePct = useMemo(() => (activeIndex * 100) / cardsPerView, [activeIndex, cardsPerView])

  return (
    <section id="testimonials" className="scroll-mt-28 bg-[#070707] py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection direction="up" className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="text-3xl font-black sm:text-5xl">Success Stories</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-300 sm:text-lg">
            Real results from businesses and homes we have connected across the valley.
          </p>
        </AnimatedSection>

        {/* Testimonials Carousel */}
        <AnimatedSection direction="up" delay={200} className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {stories.map((story, storyIndex) => (
                <div
                  key={storyIndex}
                  className="w-full flex-shrink-0 px-8 py-12 sm:px-12 lg:px-16"
                >
                  <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-6 flex justify-center">
                      <div className="relative">
                        <Image
                          src={story.avatar}
                          alt={`${story.author} avatar`}
                          width={80}
                          height={80}
                          className="h-20 w-20 rounded-full border-2 border-[#f97316] shadow-[0_8px_24px_rgba(243,111,0,0.25)]"
                          loading="lazy"
                        />
                        <div className="absolute -bottom-2 -right-2 rounded-full bg-[#f97316] p-1.5">
                          <StarIcon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(story.rating)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < story.rating ? 'text-yellow-400' : 'text-zinc-600'
                            }`} 
                          />
                        ))}
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                        {story.company} • {story.date}
                      </p>
                    </div>
                    
                    <blockquote className="mb-6 text-lg leading-relaxed text-zinc-200 sm:text-xl">
                      "{story.quote}"
                    </blockquote>
                    <div>
                      <p className="text-sm font-bold text-white">{story.author}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                        {story.role} • {story.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <PremiumButton
              variant="secondary"
              size="sm"
              onClick={() => setIndex((current) => {
                const clamped = Math.min(current, maxIndex)
                return clamped <= 0 ? maxIndex : clamped - 1
              })}
              className="rounded-full"
              aria-label="Previous testimonial"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </PremiumButton>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  type="button"
                  onClick={() => setIndex(dotIndex)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    dotIndex === activeIndex 
                      ? 'w-8 bg-[#f97316] shadow-[0_2px_8px_rgba(243,111,0,0.3)]' 
                      : 'w-2.5 bg-zinc-600 hover:bg-zinc-500'
                  }`}
                  aria-label={`Go to slide ${dotIndex + 1}`}
                />
              ))}
            </div>
            
            <PremiumButton
              variant="secondary"
              size="sm"
              onClick={() => setIndex((current) => {
                const clamped = Math.min(current, maxIndex)
                return clamped >= maxIndex ? 0 : clamped + 1
              })}
              className="rounded-full"
              aria-label="Next testimonial"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </PremiumButton>
          </div>
        </AnimatedSection>

        {/* Service Footprint */}
        <AnimatedSection direction="up" delay={400} className="mt-20">
          <div className="mx-auto max-w-4xl text-center">
            <h3 className="text-2xl font-bold sm:text-3xl">Service Footprint</h3>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-300">
              Comprehensive coverage across Riebeek Valley and surrounding areas.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {footprintItems.map((item, index) => (
              <AnimatedSection
                key={item.title}
                direction="up"
                delay={500 + index * 100}
                duration={600}
              >
                <HoverCard hoverScale={1.02} shadowIntensity="light">
                  <div className="p-6 text-center">
                    <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#f97316]/10 text-[#f97316]">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-bold text-white">{item.title}</h4>
                    <p className="mt-2 text-sm text-zinc-300">{item.description}</p>
                  </div>
                </HoverCard>
              </AnimatedSection>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a
              href="https://maps.google.com/maps?q=Riebeek+Kasteel+Malmesbury+Chatsworth+Swartland&t=&z=11&ie=UTF8&iwloc=&output=embed"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100 shadow hover:border-[#f97316] transition-colors duration-300"
            >
              <MapIcon className="mr-2 h-4 w-4" />
              Open in Maps
            </a>
          </div>

          <div className="mt-8 relative rounded-2xl border border-zinc-700 bg-zinc-900/95 px-4 py-3 shadow-lg">
            <p className="text-sm font-bold uppercase tracking-wide text-zinc-300">
              Coverage: Riebeek Kasteel, Malmesbury, Chatsworth and wider Swartland.
            </p>
          </div>

          <div className="mt-6 rounded-2xl overflow-hidden border border-zinc-700">
            <iframe
              title="Swartland coverage map"
              src="https://maps.google.com/maps?q=Riebeek+Kasteel+Malmesbury+Chatsworth+Swartland&t=&z=11&ie=UTF8&iwloc=&output=embed"
              className="h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

export default SuccessStories

