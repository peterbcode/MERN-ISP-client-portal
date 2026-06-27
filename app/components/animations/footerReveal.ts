'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FooterRevealOptions {
  footerRef: React.RefObject<HTMLElement | null>;
  logoTextRef: React.RefObject<HTMLElement | null>;
  columnRefs: Array<HTMLElement | null>;
  bottomBarRef: React.RefObject<HTMLElement | null>;
}

export function useFooterReveal({
  footerRef,
  logoTextRef,
  columnRefs,
  bottomBarRef,
}: FooterRevealOptions) {
  useEffect(() => {
    const footerElement = footerRef.current;
    if (!footerElement) return;

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
            trigger: footerElement,
            start: 'top 80%',
          }
        });
      }

      // Footer columns: slide up + fade in, staggered 0.12s per column
      const validColumnRefs = columnRefs.filter((element): element is HTMLElement => Boolean(element));
      if (validColumnRefs.length > 0) {
        gsap.fromTo(
          validColumnRefs,
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
              trigger: footerElement,
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
              trigger: footerElement,
              start: 'top 80%',
            }
          }
        );
      }

    }, footerElement);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === footerElement) {
          trigger.kill();
        }
      });
    };
  }, [footerRef, logoTextRef, columnRefs, bottomBarRef]);
}
