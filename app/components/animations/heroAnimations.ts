import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function runHeroAnimations(containerRef: HTMLElement) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = gsap.context(() => {

    // --- ENTRANCE TIMELINE ---
    const tl = gsap.timeline();

    // 1. Glow fades in
    tl.from('.hero-glow', { opacity: 0, duration: 1.2, ease: 'power2.out' });

    // 2. Headline words slide up one by one
    const words = gsap.utils.toArray<HTMLElement>('.hero-headline .word');
    tl.from(words, {
      y: 60,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.8');

    // 3. Subtitle fades up
    tl.from('.hero-subtitle', {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
    }, '-=0.5');

    // 4. CTA buttons scale in
    tl.from('.hero-cta', {
      scale: 0.92,
      opacity: 0,
      stagger: 0.15,
      duration: 0.6,
      ease: 'back.out(1.4)',
    }, '-=0.4');

    // 5. Ticker fades in
    tl.from('.hero-ticker', { opacity: 0, duration: 0.5 }, '-=0.2');

    // --- SCROLL PARALLAX ---
    // Headline moves up faster
    gsap.to('.hero-headline', {
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: '40vh top',
        scrub: true,
      },
    });

    // Subtitle + CTAs move up slower
    gsap.to('.hero-subtitle, .hero-cta', {
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: '40vh top',
        scrub: true,
      },
    });

    // Glow scales up and fades as hero leaves
    gsap.to('.hero-glow', {
      scale: 1.3,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Hero section pins briefly for a "slow leave" feel
    ScrollTrigger.create({
      trigger: '.hero-section',
      start: 'top top',
      end: '+=20vh',
      pin: true,
      pinSpacing: false,
    });

  }, containerRef);

  return () => ctx.revert();
}

export function initHeroTilt(heroEl: HTMLElement, headlineEl: HTMLElement) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  let rafId: number;

  const LERP = 0.06;

  const onMove = (e: MouseEvent) => {
    const rect = heroEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    targetX = ((e.clientY - cy) / rect.height) * 6;   // ±6deg
    targetY = ((e.clientX - cx) / rect.width) * -4;   // ±4deg
  };

  const onLeave = () => { targetX = 0; targetY = 0; };

  const tick = () => {
    currentX += (targetX - currentX) * LERP;
    currentY += (targetY - currentY) * LERP;
    headlineEl.style.transform = `perspective(800px) rotateX(${currentX}deg) rotateY(${currentY}deg)`;
    rafId = requestAnimationFrame(tick);
  };

  heroEl.addEventListener('mousemove', onMove);
  heroEl.addEventListener('mouseleave', onLeave);
  rafId = requestAnimationFrame(tick);

  return () => {
    heroEl.removeEventListener('mousemove', onMove);
    heroEl.removeEventListener('mouseleave', onLeave);
    cancelAnimationFrame(rafId);
  };
}
