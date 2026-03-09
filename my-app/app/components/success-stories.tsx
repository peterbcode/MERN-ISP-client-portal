import { StarIcon } from '@heroicons/react/24/solid'

const stories = [
  {
    quote:
      'Valley Computers stabilized our warehouse and office links in under a week. Since then, uptime has been excellent and support has been fast and practical.',
    author: 'Sarah J.',
    role: 'Operations Manager',
    location: 'Riebeek-Kasteel',
  },
  {
    quote:
      'Our team needed dependable connectivity for cloud systems and VoIP. The rollout was smooth, performance improved immediately, and follow-up support has been consistent.',
    author: 'David M.',
    role: 'Business Owner',
    location: 'Malmesbury',
  },
  {
    quote:
      'From network cleanup to access-point optimization, everything was handled professionally. We now have stronger coverage and fewer support incidents.',
    author: 'John P.',
    role: 'IT Coordinator',
    location: 'Swartland',
  },
]

const SuccessStories = () => {
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

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {stories.map((story) => (
            <article
              key={story.author}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
            >
              <div className="flex items-center gap-1 text-[#f36f00]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon key={index} className="h-4 w-4" />
                ))}
              </div>
              <p className="mt-5 text-base leading-relaxed text-zinc-200">&ldquo;{story.quote}&rdquo;</p>
              <div className="mt-6 border-t border-zinc-800 pt-4">
                <p className="text-sm font-bold text-white">{story.author}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                  {story.role} - {story.location}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-4 text-center sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-5">
            <p className="text-3xl font-black text-[#f36f00]">4.9/5</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">Client Rating</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-5">
            <p className="text-3xl font-black text-[#f36f00]">500+</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">Satisfied Clients</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-5">
            <p className="text-3xl font-black text-[#f36f00]">24/7</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">Support Access</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SuccessStories
