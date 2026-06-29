'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

type NavigatorWithMemory = Navigator & {
  deviceMemory?: number;
};

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as NavigatorWithMemory).deviceMemory || 8;
    const isLowEnd = cores <= 4 || memory <= 4;

    if (prefersReducedMotion || isLowEnd) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      lerp: 0.05,
      wheelMultiplier: 0.85,
      smoothWheel: true,
      smoothTouch: false,
    });

    window.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const handleAnchorClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"], a[href*="/#"]');
      if (!link) return;

      const url = new URL(link.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;

      const target = document.querySelector<HTMLElement>(url.hash);
      if (!target) return;

      event.preventDefault();
      window.history.pushState(null, '', url.hash);
      lenis.scrollTo(target, {
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    };

    let frameId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    document.addEventListener('click', handleAnchorClick);
    frameId = requestAnimationFrame(raf);
    ScrollTrigger.refresh();

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      cancelAnimationFrame(frameId);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      window.lenis = undefined;
    };
  }, []);

  useEffect(() => {
    const refreshId = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => window.clearTimeout(refreshId);
  }, [pathname]);

  return <>{children}</>;
}
