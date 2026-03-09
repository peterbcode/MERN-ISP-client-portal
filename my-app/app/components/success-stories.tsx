'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@heroicons/react/24/solid'

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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f36f00]">Client Testimonials</p>
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
                    <div className="flex items-center gap-1 text-[#f36f00]">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <StarIcon key={starIndex} className="h-4 w-4" />
                      ))}
                    </div>
                    <p className="mt-5 text-base leading-relaxed text-zinc-200">&ldquo;{story.quote}&rdquo;</p>
                    <div className="mt-6 flex items-center gap-3 border-t border-zinc-800 pt-4">
                      <img
                        src={story.avatar}
                        alt={`${story.author} profile`}
                        className="h-11 w-11 rounded-full border border-zinc-700 object-cover"
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
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-200 transition hover:border-[#f36f00] hover:text-[#f36f00]"
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
                  className={`h-2.5 rounded-full transition-all ${dotIndex === activeIndex ? 'w-7 bg-[#f36f00]' : 'w-2.5 bg-zinc-600'}`}
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
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-200 transition hover:border-[#f36f00] hover:text-[#f36f00]"
              aria-label="Next testimonial"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-5xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f36f00]">Why Choose Valley Computers</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-5">
              <p className="text-3xl font-black text-[#f36f00]">99%</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">Service Reliability</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-5">
              <p className="text-3xl font-black text-[#f36f00]">24/7</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">Team Support</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-5">
              <p className="text-3xl font-black text-[#f36f00]">Same Day</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">Fast Response</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-5">
              <p className="text-3xl font-black text-[#f36f00]">4.9/5</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">Client Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SuccessStories
