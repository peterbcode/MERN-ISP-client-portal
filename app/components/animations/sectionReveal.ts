'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionRevealOptions {
  sectionRef: React.RefObject<HTMLElement | null>;
  headingRef?: React.RefObject<HTMLElement | null> | React.RefObject<HTMLHeadingElement | null>;
  cardRefs?: React.RefObject<HTMLElement | null>[] | React.RefObject<HTMLDivElement | null>[];
  statNumbers?: React.RefObject<HTMLElement | null>[] | React.RefObject<HTMLParagraphElement | null>[];
  dividerRef?: React.RefObject<HTMLElement | null>;
  staggerDelay?: number;
}

export function useSectionReveal({
  sectionRef,
  headingRef,
  cardRefs,
  statNumbers,
  dividerRef,
  staggerDelay = 0.1,
}: SectionRevealOptions) {
  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Section heading - clip-path reveal from bottom
      if (headingRef?.current) {
        gsap.fromTo(
          headingRef.current,
          {
            clipPath: 'inset(100% 0 0 0)',
            opacity: 0
          },
          {
            clipPath: 'inset(0% 0 0 0)',
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            }
          }
        );
      }

      // Card / grid items - fade in + translateY
      if (cardRefs && cardRefs.length > 0) {
        gsap.fromTo(
          cardRefs.filter(ref => ref.current),
          {
            y: 40,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: staggerDelay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            }
          }
        );
      }

      // Stats bar numbers - count up animation
      if (statNumbers && statNumbers.length > 0) {
        statNumbers.forEach((statRef) => {
          if (statRef.current) {
            const text = statRef.current.textContent || '0';
            const targetValue = parseInt(text.replace(/[^0-9]/g, '')) || 0;
            const suffix = text.replace(/[0-9]/g, '');

            const counterObj = { value: 0 };
            gsap.to(counterObj, {
              value: targetValue,
              duration: 1.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
              },
              onUpdate: function() {
                if (statRef.current) {
                  statRef.current.textContent = Math.round(counterObj.value) + suffix;
                }
              }
            });
          }
        });
      }

      // Horizontal rule / dividers - width animation
      if (dividerRef?.current) {
        gsap.fromTo(
          dividerRef.current,
          {
            width: '0%'
          },
          {
            width: '100%',
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            }
          }
        );
      }

    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, [sectionRef, headingRef, cardRefs, statNumbers, dividerRef, staggerDelay]);
}
