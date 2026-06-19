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

    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
  return <>{children}</>;
}
