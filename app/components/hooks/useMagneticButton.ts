'use client';

import { useRef, useEffect, useCallback } from 'react';

interface UseMagneticButtonOptions {
  strength?: number;
  maxDistance?: number;
}

export function useMagneticButton(options: UseMagneticButtonOptions = {}) {
  const { strength = 0.4, maxDistance = 60 } = options;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);

  const handleMouseMove = useCallback((e: Event) => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;
    if (!boundsRef.current) {
      boundsRef.current = button.getBoundingClientRect();
    }

    const bounds = boundsRef.current;
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;

    const mouseEvent = e as MouseEvent;
    const deltaX = mouseEvent.clientX - centerX;
    const deltaY = mouseEvent.clientY - centerY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < maxDistance) {
      const power = (maxDistance - distance) / maxDistance;
      const x = deltaX * power * strength;
      const y = deltaY * power * strength;

      button.style.transform = `translate(${x}px, ${y}px)`;
    }
  }, [strength, maxDistance]);

  const handleMouseLeave = useCallback(() => {
    if (!buttonRef.current) return;
    buttonRef.current.style.transform = 'translate(0px, 0px)';
    boundsRef.current = null;
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!buttonRef.current) return;
    boundsRef.current = buttonRef.current.getBoundingClientRect();
  }, []);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [handleMouseMove, handleMouseLeave, handleMouseEnter]);

  return buttonRef;
}
