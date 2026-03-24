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
  const enabledRef = useRef(false);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    targetPosRef.current = { x: -size, y: -size };
    currentPosRef.current = { x: -size, y: -size };
    enabledRef.current = false;

    const enable = () => {
      if (enabledRef.current) return;
      enabledRef.current = true;
      document.body.classList.add("inverted-cursor-enabled");
    };

    const handlePointerMove = (e: PointerEvent) => {
      // Only show the custom cursor for an actual mouse. This keeps touch/stylus
      // devices from forcing a hidden cursor, while still working on touchscreen laptops.
      if (e.pointerType && e.pointerType !== "mouse") return;
      enable();
      document.body.classList.add("inverted-cursor-hide-native");
      setVisible(true);
      targetPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = () => {
      enable();
      setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
      document.body.classList.remove("inverted-cursor-hide-native");
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

    document.addEventListener("pointermove", handlePointerMove);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.body.classList.remove("inverted-cursor-enabled");
      document.body.classList.remove("inverted-cursor-hide-native");
      if (requestRef.current != null) cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    };
  }, [size]);

  return (
    <div
      ref={cursorRef}
      className="fixed left-0 top-0 pointer-events-none rounded-full bg-white mix-blend-difference z-[99999] transition-opacity duration-300"
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
