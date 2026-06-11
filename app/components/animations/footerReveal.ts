'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FooterRevealOptions {
  footerRef: React.RefObject<HTMLElement | null>;
  logoTextRef: React.RefObject<HTMLElement | null>;
  columnRefs: React.RefObject<HTMLElement | null>[];
  bottomBarRef: React.RefObject<HTMLElement | null>;
}

export function useFooterReveal({
  footerRef,
  logoTextRef,
  columnRefs,
  bottomBarRef,
}: FooterRevealOptions) {
  useEffect(() => {
    if (!footerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Footer logo text: letter-by-letter stagger fade in
      if (logoTextRef?.current) {
        const text = logoTextRef.current.textContent || '';
        const letters = text.split('');
        
        // Create spans for each letter
        logoTextRef.current.innerHTML = letters
          .map((letter) => `<span style="display: inline-block; opacity: 0;">${letter === ' ' ? '&nbsp;' : letter}</span>`)
          .join('');

        const letterSpans = logoTextRef.current.querySelectorAll('span');
        
        gsap.to(letterSpans, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 80%',
          }
        });
      }

      // Footer columns: slide up + fade in, staggered 0.12s per column
      const validColumnRefs = columnRefs.filter(ref => ref.current);
      if (validColumnRefs.length > 0) {
        gsap.fromTo(
          validColumnRefs.map(ref => ref.current),
          {
            y: 40,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 80%',
            }
          }
        );
      }

      // Bottom bar: fade in last with a 0.2s delay
      if (bottomBarRef?.current) {
        gsap.fromTo(
          bottomBarRef.current,
          {
            opacity: 0,
            y: 20
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 80%',
            }
          }
        );
      }

    }, footerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === footerRef.current) {
          trigger.kill();
        }
      });
    };
  }, [footerRef, logoTextRef, columnRefs, bottomBarRef]);
}
