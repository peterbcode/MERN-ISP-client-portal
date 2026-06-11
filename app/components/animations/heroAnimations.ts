'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroAnimationOptions {
  heroRef: React.RefObject<HTMLElement | null>;
  headlineRef: React.RefObject<HTMLElement | null> | React.RefObject<HTMLHeadingElement | null>;
  subtitleRef: React.RefObject<HTMLElement | null> | React.RefObject<HTMLParagraphElement | null>;
  ctaContainerRef: React.RefObject<HTMLElement | null> | React.RefObject<HTMLDivElement | null>;
  brandTickerRef?: React.RefObject<HTMLElement | null>;
}

export function useHeroAnimations({
  heroRef,
  headlineRef,
  subtitleRef,
  ctaContainerRef,
  brandTickerRef,
}: HeroAnimationOptions) {
  const tiltRef = useRef({ x: 0, y: 0 });
  const targetTiltRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!heroRef.current || !headlineRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // A. Entrance animation
      const tl = gsap.timeline();

      // Background radial glow fade in
      gsap.fromTo(
        heroRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: 'power2.out' }
      );

      // Hero headline - split into words and stagger
      if (headlineRef.current) {
        const headlineWords = headlineRef.current.querySelectorAll('span');
        gsap.fromTo(
          headlineWords,
          { 
            y: 60, 
            opacity: 0 
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            delay: 0.2
          }
        );
      }

      // Subtitle fade in + slide up
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { 
            y: 30, 
            opacity: 0 
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.5
          }
        );
      }

      // CTA buttons fade in + scale
      if (ctaContainerRef.current) {
        const buttons = ctaContainerRef.current.querySelectorAll('button');
        gsap.fromTo(
          buttons,
          { 
            scale: 0.92, 
            opacity: 0 
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.7)',
            delay: 0.7
          }
        );
      }

      // Brand ticker fade in last
      if (brandTickerRef?.current) {
        gsap.fromTo(
          brandTickerRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            delay: 1.0
          }
        );
      }

      // B. Scroll parallax
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Headline moves UP at 0.3x scroll speed
          if (headlineRef.current) {
            gsap.set(headlineRef.current, {
              y: progress * -80
            });
          }

          // Subtitle + CTAs move UP at 0.15x scroll speed
          if (subtitleRef.current) {
            gsap.set(subtitleRef.current, {
              y: progress * -40
            });
          }

          if (ctaContainerRef.current) {
            gsap.set(ctaContainerRef.current, {
              y: progress * -40
            });
          }

          // Background glow scale and fade
          gsap.set(heroRef.current, {
            scale: 1 + progress * 0.3,
            opacity: 1 - progress * 0.8
          });
        }
      });

      // Pin hero for first 20vh
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: '+=20vh',
        pin: true,
        pinSpacing: false
      });

    }, heroRef);

    // C. Cursor-reactive tilt
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const rect = heroRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const x = ((e.clientX - centerX) / rect.width) * 12; // ±6deg
      const y = ((e.clientY - centerY) / rect.height) * 8; // ±4deg
      
      targetTiltRef.current = { x, y };
    };

    const handleMouseLeave = () => {
      targetTiltRef.current = { x: 0, y: 0 };
    };

    const animateTilt = () => {
      const lerp = 0.06;
      tiltRef.current.x += (targetTiltRef.current.x - tiltRef.current.x) * lerp;
      tiltRef.current.y += (targetTiltRef.current.y - tiltRef.current.y) * lerp;

      if (headlineRef.current) {
        gsap.set(headlineRef.current, {
          rotationX: tiltRef.current.y,
          rotationY: tiltRef.current.x,
          transformPerspective: 1000
        });
      }

      requestAnimationFrame(animateTilt);
    };

    heroRef.current.addEventListener('mousemove', handleMouseMove);
    heroRef.current.addEventListener('mouseleave', handleMouseLeave);
    animateTilt();

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (heroRef.current) {
        heroRef.current.removeEventListener('mousemove', handleMouseMove);
        heroRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [heroRef, headlineRef, subtitleRef, ctaContainerRef, brandTickerRef]);
}
