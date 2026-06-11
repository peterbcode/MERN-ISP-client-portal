'use client';

import { useEffect, useRef, useState } from 'react';

export function useNavbarScroll(navbarRef: React.RefObject<HTMLElement | null>) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!navbarRef.current) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Show/hide navbar based on scroll direction
      if (scrollY > lastScrollY && scrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      // Change background when scrolled past 80px
      setIsScrolled(scrollY > 80);

      setLastScrollY(scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navbarRef, lastScrollY]);

  useEffect(() => {
    if (!navbarRef.current) return;

    const navbar = navbarRef.current;
    
    if (isScrolled) {
      navbar.style.background = 'rgba(8, 8, 7, 0.92)';
      navbar.style.backdropFilter = 'blur(12px)';
      navbar.style.transition = 'background 0.3s ease, backdrop-filter 0.3s ease';
    } else {
      navbar.style.background = 'transparent';
      navbar.style.backdropFilter = 'none';
    }

    if (isVisible) {
      navbar.style.transform = 'translateY(0)';
      navbar.style.transition = 'transform 0.3s ease, background 0.3s ease, backdrop-filter 0.3s ease';
    } else {
      navbar.style.transform = 'translateY(-100%)';
    }
  }, [isScrolled, isVisible, navbarRef]);

  return { isScrolled, isVisible };
}
