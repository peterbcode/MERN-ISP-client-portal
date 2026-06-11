import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function revealSection(containerEl: HTMLElement) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  const ctx = gsap.context(() => {

    // Section headings: clip-path wipe up
    gsap.utils.toArray<HTMLElement>('.reveal-heading').forEach((el) => {
      gsap.from(el, {
        clipPath: 'inset(100% 0 0 0)',
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
      });
    });

    // Cards and grid items: fade up staggered
    gsap.utils.toArray<HTMLElement>('.reveal-card').forEach((group) => {
      gsap.from(group, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: group,
          start: 'top 80%',
        },
      });
    });

    // Dividers: width grows from 0
    gsap.utils.toArray<HTMLElement>('.reveal-divider').forEach((el) => {
      gsap.from(el, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
        },
      });
    });

    // Stats count-up
    gsap.utils.toArray<HTMLElement>('.stat-number').forEach((el) => {
      const target = parseFloat(el.dataset.target || '0');
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: target,
            duration: 1.5,
            ease: 'power1.out',
            onUpdate: () => {
              el.textContent = Number.isInteger(target)
                ? Math.round(obj.val).toString()
                : obj.val.toFixed(1);
            },
          });
        },
      });
    });

  }, containerEl);

  return () => ctx.revert();
}
