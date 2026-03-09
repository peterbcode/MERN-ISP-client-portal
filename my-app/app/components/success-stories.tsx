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

const stories = [
  {
    quote:
      'Valley Computers stabilized our warehouse and office links in under a week. Since then, uptime has been excellent and support has been fast and practical.',
    author: 'Sarah J.',
    role: 'Operations Manager',
    location: 'Riebeek-Kasteel',
    avatar: 'https://i.pravatar.cc/96?img=32',
  },
  {
    quote:
      'Our team needed dependable connectivity for cloud systems and VoIP. The rollout was smooth, performance improved immediately, and follow-up support has been consistent.',
    author: 'David M.',
    role: 'Business Owner',
    location: 'Malmesbury',
    avatar: 'https://i.pravatar.cc/96?img=11',
  },
  {
    quote:
      'From network cleanup to access-point optimization, everything was handled professionally. We now have stronger coverage and fewer support incidents.',
    author: 'John P.',
    role: 'IT Coordinator',
    location: 'Swartland',
    avatar: 'https://i.pravatar.cc/96?img=12',
  },
  {
    quote:
      'Installation was quick, signal quality is strong, and our remote team has had far fewer interruptions. Great communication throughout.',
    author: 'Alicia K.',
    role: 'Office Manager',
    location: 'Piketberg',
    avatar: 'https://i.pravatar.cc/96?img=45',
  },
  {
    quote:
      'We moved all business operations online and needed reliable uptime. Valley Computers delivered exactly that with solid after-sales support.',
    author: 'Mark T.',
    role: 'Retail Owner',
    location: 'Wellington',
    avatar: 'https://i.pravatar.cc/96?img=20',
  },
]

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
    <section
      id="success-stories"
      className="scroll-mt-28 bg-[radial-gradient(circle_at_50%_5%,rgba(243,111,0,0.09),transparent_45%),linear-gradient(to_bottom,#070707,#0b0b0b)] py-20 text-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]">Client Testimonials</p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl">Success Stories</h2>
          <p className="mt-4 text-base text-zinc-300 sm:text-lg">
            Trusted by local homes and businesses for reliable internet and practical IT support.
          </p>
        </div>

        <div className="mt-12">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${translatePct}%)` }}
            >
              {stories.map((story) => (
                <div key={`${story.author}-${story.location}`} className="w-full shrink-0 px-2 sm:w-1/2 lg:w-1/3">
                  <article className="h-full rounded-3xl border border-zinc-800 bg-zinc-950 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <div className="flex items-center gap-1 text-[#f97316]">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <StarIcon key={starIndex} className="h-4 w-4" />
                      ))}
                    </div>
                    <p className="mt-5 text-base leading-relaxed text-zinc-200">&ldquo;{story.quote}&rdquo;</p>
                    <div className="mt-6 flex items-center gap-3 border-t border-zinc-800 pt-4">
                      <Image
                        src={story.avatar}
                        alt={`${story.author} profile`}
                        className="h-11 w-11 rounded-full border border-zinc-700 object-cover"
                        width={44}
                        height={44}
                        loading="lazy"
                      />
                      <div>
                        <p className="text-sm font-bold text-white">{story.author}</p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                          {story.role} - {story.location}
                        </p>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIndex((current) => {
                const clamped = Math.min(current, maxIndex)
                return clamped <= 0 ? maxIndex : clamped - 1
              })}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-200 transition hover:border-[#f97316] hover:text-[#f97316]"
              aria-label="Previous testimonial"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  type="button"
                  onClick={() => setIndex(dotIndex)}
                  className={`h-2.5 rounded-full transition-all ${dotIndex === activeIndex ? 'w-7 bg-[#f97316]' : 'w-2.5 bg-zinc-600'}`}
                  aria-label={`Go to slide ${dotIndex + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIndex((current) => {
                const clamped = Math.min(current, maxIndex)
                return clamped >= maxIndex ? 0 : clamped + 1
              })}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-200 transition hover:border-[#f97316] hover:text-[#f97316]"
              aria-label="Next testimonial"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-14 border-t border-zinc-800/70 pt-10">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]">Coverage</p>
            <h3 className="mt-3 text-3xl font-extrabold sm:text-4xl">Our Local Footprint</h3>
            <p className="mt-4 text-base text-zinc-300">
              Focused coverage across key Swartland areas.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {footprintItems.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f97316] text-white">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-extrabold tracking-tight">{item.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-300">{item.description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="relative self-center overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-[0_22px_45px_rgba(0,0,0,0.45)]">
              <div className="absolute left-4 top-4 z-10">
                <a
                  href="https://maps.google.com/?q=Riebeek+Kasteel+Malmesbury+Chatsworth+Swartland"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100 shadow hover:border-[#f97316]"
                >
                  Open in Maps
                </a>
              </div>

              <div className="absolute left-4 right-4 top-20 z-10 rounded-2xl border border-zinc-700 bg-zinc-900/95 px-4 py-3 shadow">
                <p className="text-sm font-bold uppercase tracking-wide text-zinc-300">
                  Coverage: Riebeek Kasteel, Malmesbury, Chatsworth and wider Swartland.
                </p>
              </div>

              <iframe
                title="Swartland coverage map"
                src="https://maps.google.com/maps?q=Riebeek+Kasteel+Malmesbury+Chatsworth+Swartland&t=&z=11&ie=UTF8&iwloc=&output=embed"
                className="h-[420px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SuccessStories

