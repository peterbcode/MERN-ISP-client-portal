'use client';
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check for reduced motion preference or low-end device
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as any).deviceMemory || 8;
    const isLowEnd = cores <= 4 || memory <= 4;

    if (prefersReducedMotion || isLowEnd) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.04, // Lower value for a slower, lazier, and more luxurious follow/glide
      duration: 1.8, // Slightly longer scroll duration for a premium, cinematic feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Premium exponential ease-out curve
      wheelMultiplier: 0.8, // Controlled scroll distance per tick
      smoothWheel: true,
    });

    // Expose lenis globally for programmatic slow scrolls
    (window as any).lenis = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      (window as any).lenis = undefined;
    };
  }, []);
  return <>{children}</>;
}
