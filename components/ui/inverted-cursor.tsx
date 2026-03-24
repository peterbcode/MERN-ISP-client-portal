"use client";

import React, { useEffect, useRef, useState } from "react";

interface CursorProps {
  size?: number;
}

export const Cursor: React.FC<CursorProps> = ({ size = 60 }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);

  const targetPosRef = useRef({ x: -size, y: -size });
  const currentPosRef = useRef({ x: -size, y: -size });

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    const isCoarsePointer =
      typeof window !== "undefined" &&
      window.matchMedia?.("(hover: none), (pointer: coarse)")?.matches;
    if (isCoarsePointer) return;

    document.body.classList.add("inverted-cursor-enabled");

    targetPosRef.current = { x: -size, y: -size };
    currentPosRef.current = { x: -size, y: -size };

    const handleMouseMove = (e: MouseEvent) => {
      setVisible(true);
      targetPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = () => {
      setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    // Animation loop for smooth cursor follow
    const animate = () => {
      const { x: clientX, y: clientY } = targetPosRef.current;
      const targetX = clientX - size / 2;
      const targetY = clientY - size / 2;

      const currentX = currentPosRef.current.x;
      const currentY = currentPosRef.current.y;

      const newX = currentX + (targetX - currentX) * 0.2;
      const newY = currentY + (targetY - currentY) * 0.2;

      currentPosRef.current = { x: newX, y: newY };
      cursorEl.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;

      requestRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.body.classList.remove("inverted-cursor-enabled");
      if (requestRef.current != null) cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    };
  }, [size]);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none rounded-full bg-white mix-blend-difference z-[99999] transition-opacity duration-300"
      style={{
        width: size,
        height: size,
        opacity: visible ? 1 : 0,
      }}
      aria-hidden="true"
    />
  );
};

export default Cursor;
