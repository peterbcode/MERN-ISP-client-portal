"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

// ─── Data ────────────────────────────────────────────────────────────────────

interface GalleryImage {
  src: string;
  alt: string;
  tag: string;
  label: string;
  index: number;
}

const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: "/gallery/RBV-Dish.jpeg",
    alt: "Wireless dish installation on a Riebeek Valley property",
    tag: "Installation",
    label: "Precision wireless links for homes and farms",
    index: 1,
  },
  {
    src: "/gallery/High-speed.png",
    alt: "High-speed internet networking equipment",
    tag: "Network",
    label: "High-speed equipment installed and tuned",
    index: 2,
  },
  {
    src: "/gallery/solar-and-dish.jpeg",
    alt: "Solar-backed dish installation",
    tag: "Off-grid",
    label: "Solar-backed connectivity in the field",
    index: 3,
  },
  {
    src: "/gallery/storefront.png",
    alt: "Valley Computers storefront",
    tag: "Support",
    label: "Local support with a real storefront",
    index: 4,
  },
  {
    src: "/gallery/Rainbow.png",
    alt: "Rainbow over the Riebeek Valley service area",
    tag: "Coverage",
    label: "Coverage across the Riebeek Valley",
    index: 5,
  },
  {
    src: "/gallery/tower-view.jpeg",
    alt: "Communication tower view over the valley",
    tag: "Infrastructure",
    label: "Strategic tower placement for valley coverage",
    index: 6,
  },
  {
    src: "/gallery/installation.jpeg",
    alt: "Professional installation work in progress",
    tag: "Installation",
    label: "Expert installation by trained technicians",
    index: 7,
  },
];

// How many images to show in the primary grid (rest go to carousel)
const GRID_COUNT = 4;

// ─── Carousel ─────────────────────────────────────────────────────────────────

interface CarouselProps {
  images: GalleryImage[];
}

function DraggableCarousel({ images }: CarouselProps) {
  const count = images.length;
  const [angle, setAngle] = useState(0); // current rotation in degrees
  const dragStart = useRef<{ x: number; angle: number } | null>(null);
  const isDragging = useRef(false);
  const rafId = useRef<number | null>(null);
  const targetAngle = useRef(0);
  const currentAngle = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const RADIUS = 320; // px — how "deep" the carousel sits
  const STEP = 360 / count;

  // Lerp animation loop
  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      const diff = targetAngle.current - currentAngle.current;
      currentAngle.current += diff * 0.09;
      setAngle(currentAngle.current);
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, angle: targetAngle.current };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    // 0.35 deg per px — feels natural
    targetAngle.current = dragStart.current.angle - dx * 0.35;
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    // Snap to nearest card
    const nearest = Math.round(targetAngle.current / STEP) * STEP;
    targetAngle.current = nearest;
  }, [STEP]);

  const rotateBy = (dir: number) => {
    targetAngle.current += dir * STEP;
  };

  return (
    <div className="gallery-carousel-wrapper">
      {/* Fade vignette overlay */}
      <div className="carousel-vignette" />

      {/* 3D stage */}
      <div
        ref={containerRef}
        className="carousel-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
      >
        <div
          className="carousel-rotor"
          style={{ transform: `rotateY(${-angle}deg)` }}
        >
          {images.map((img, i) => {
            const cardAngle = i * STEP;
            // Calculate how "front-facing" this card is relative to current view
            const diff =
              ((cardAngle + angle) % 360 + 360) % 360;
            const normalised = diff > 180 ? 360 - diff : diff;
            const opacity = Math.max(0.5, 1 - normalised / 110);
            const zIndex = Math.round((1 - normalised / 180) * 10);

            return (
              <div
                key={img.src}
                className="carousel-card"
                style={{
                  transform: `rotateY(${cardAngle}deg) translateZ(${RADIUS}px)`,
                  opacity,
                  zIndex,
                }}
              >
                <div className="carousel-card-inner">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="280px"
                    className="carousel-card-img"
                    draggable={false}
                  />
                  <div className="carousel-card-overlay">
                    <span className="carousel-card-tag">{img.tag}</span>
                    <p className="carousel-card-label">{img.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Arrow controls */}
      <button
        onClick={() => rotateBy(-1)}
        className="carousel-arrow carousel-arrow-left"
        aria-label="Previous"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        onClick={() => rotateBy(1)}
        className="carousel-arrow carousel-arrow-right"
        aria-label="Next"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <p className="carousel-hint">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: "inline", marginRight: 5, verticalAlign: "middle" }}>
          <path d="M5 1v5L3 5m8 0-2 1V1M7 10v3M5 12h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Drag to explore · {images.length} more views
      </p>
    </div>
  );
}

// ─── Main Grid ────────────────────────────────────────────────────────────────

export default function GallerySection() {
  const gridImages = GALLERY_IMAGES.slice(0, GRID_COUNT);
  const carouselImages = GALLERY_IMAGES.slice(GRID_COUNT);

  return (
    <>
      {/* ── inline styles ────────────────────────────────────────────────── */}
      <style>{`
        /* ── Section wrapper ── */
        .gallery-section {
          position: relative;
          padding: 6rem 0 5rem;
          overflow: hidden;
        }

        .gallery-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #ff7e26;
          margin-bottom: 1rem;
        }
        .gallery-eyebrow::before {
          content: "";
          display: inline-block;
          width: 18px;
          height: 1.5px;
          background: #ff7e26;
        }

        .gallery-heading {
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 700;
          color: #f5f5f0;
          line-height: 1.15;
          margin: 0 0 0.5rem;
          letter-spacing: -0.02em;
        }

        .gallery-sub {
          font-size: 0.92rem;
          color: #7a7a72;
          max-width: 480px;
          line-height: 1.6;
          margin-bottom: 3rem;
        }

        /* ── Primary grid ── */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: auto;
          gap: 12px;
          margin-bottom: 3.5rem;
        }

        /* Card 1 — large landscape, spans 7 cols */
        .gallery-grid-item:nth-child(1) {
          grid-column: 1 / 8;
          grid-row: 1 / 2;
          aspect-ratio: 16/10;
        }
        /* Card 2 — tall portrait, spans 5 cols and 2 rows */
        .gallery-grid-item:nth-child(2) {
          grid-column: 8 / 13;
          grid-row: 1 / 3;
          aspect-ratio: 4/5;
        }
        /* Card 3 — medium, spans 4 cols */
        .gallery-grid-item:nth-child(3) {
          grid-column: 1 / 5;
          grid-row: 2 / 3;
          aspect-ratio: 4/3;
        }
        /* Card 4 — medium, spans 4 cols */
        .gallery-grid-item:nth-child(4) {
          grid-column: 5 / 8;
          grid-row: 2 / 3;
          aspect-ratio: 4/3;
        }

        .gallery-grid-item {
          position: relative;
          overflow: hidden;
          border-radius: 6px;
          background: #111110;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .gallery-grid-item:hover .gallery-img {
          transform: scale(1.04);
        }
        .gallery-grid-item:hover .gallery-card-overlay {
          opacity: 1;
        }

        .gallery-img {
          object-fit: cover;
          object-position: center top;
          transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          width: 100%;
          height: 100%;
        }

        .gallery-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(4, 4, 3, 0.88) 0%,
            rgba(4, 4, 3, 0.3) 45%,
            transparent 100%
          );
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.2rem 1.1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .gallery-card-num {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #ff7e26;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }

        .gallery-card-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #f0ede8;
          line-height: 1.35;
          margin: 0;
        }

        .gallery-card-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          background: rgba(255,126,38,0.9);
          color: #fff;
          padding: 3px 8px;
          border-radius: 3px;
          backdrop-filter: blur(4px);
        }

        /* ── Carousel section ── */
        .gallery-carousel-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .gallery-carousel-header h3 {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #7a7a72;
          margin: 0;
        }
        .gallery-carousel-header::after {
          content: "";
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }

        /* ── Carousel 3D wrapper ── */
        .gallery-carousel-wrapper {
          position: relative;
          width: 100%;
          height: 340px;
          perspective: 1000px;
          overflow: hidden;
          margin-bottom: 0;
        }

        .carousel-vignette {
          position: absolute;
          inset: 0;
          z-index: 20;
          pointer-events: none;
          background: linear-gradient(
            to right,
            #080807 0%,
            transparent 22%,
            transparent 78%,
            #080807 100%
          );
        }

        .carousel-stage {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
          touch-action: none;
        }

        .carousel-rotor {
          position: relative;
          width: 240px;
          height: 280px;
          transform-style: preserve-3d;
          transition: none;
        }

        .carousel-card {
          position: absolute;
          width: 240px;
          height: 280px;
          top: 0;
          left: 0;
          backface-visibility: hidden;
          transition: opacity 0.2s ease;
        }

        .carousel-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background: #111110;
        }

        .carousel-card-img {
          object-fit: cover;
          object-position: center;
          transition: none;
        }

        .carousel-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(4,4,3,0.85) 0%,
            transparent 55%
          );
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1rem;
          gap: 0.2rem;
        }

        .carousel-card-tag {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #ff7e26;
        }

        .carousel-card-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: #e8e4de;
          line-height: 1.3;
          margin: 0;
        }

        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 30;
          background: rgba(15,14,13,0.7);
          border: 1px solid rgba(255,126,38,0.25);
          color: #ff7e26;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          backdrop-filter: blur(8px);
        }
        .carousel-arrow:hover {
          background: rgba(255,126,38,0.15);
          border-color: rgba(255,126,38,0.6);
        }
        .carousel-arrow-left  { left: 12px; }
        .carousel-arrow-right { right: 12px; }

        .carousel-hint {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 30;
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #4a4a44;
          white-space: nowrap;
          pointer-events: none;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: 1fr 1fr;
          }
          .gallery-grid-item:nth-child(1) {
            grid-column: 1 / 3;
            grid-row: 1;
            aspect-ratio: 16/9;
          }
          .gallery-grid-item:nth-child(2) {
            grid-column: 1 / 2;
            grid-row: 2;
            aspect-ratio: 1/1;
          }
          .gallery-grid-item:nth-child(3) {
            grid-column: 2 / 3;
            grid-row: 2;
            aspect-ratio: 1/1;
          }
          .gallery-grid-item:nth-child(4) {
            grid-column: 1 / 3;
            grid-row: 3;
            aspect-ratio: 16/9;
          }

          .gallery-card-overlay { opacity: 1; }

          .gallery-carousel-wrapper { height: 280px; }
          .carousel-rotor,
          .carousel-card { width: 180px; height: 210px; }
        }
      `}</style>

      {/* ── Section ─────────────────────────────────────────────────────── */}
      <section className="gallery-section">
        <div className="container mx-auto px-6 max-w-screen-xl">

          {/* Header */}
          <span className="gallery-eyebrow">Field Portfolio</span>
          <h2 className="gallery-heading">Real installations, local coverage,<br />practical network work.</h2>
          <p className="gallery-sub">
            A closer look at the equipment, terrain, and support footprint behind Valley Computers connectivity.
          </p>

          {/* Primary editorial grid */}
          <div className="gallery-grid">
            {gridImages.map((img) => (
              <div key={img.src} className="gallery-grid-item">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="gallery-img"
                  draggable={false}
                />
                <div className="gallery-card-overlay">
                  <span className="gallery-card-num">
                    {String(img.index).padStart(2, "0")} · {img.tag}
                  </span>
                  <p className="gallery-card-label">{img.label}</p>
                </div>
                <span className="gallery-card-tag">{img.tag}</span>
              </div>
            ))}
          </div>

          {/* Carousel overflow */}
          {carouselImages.length > 0 && (
            <>
              <div className="gallery-carousel-header">
                <h3>More from the field</h3>
              </div>
              <DraggableCarousel images={carouselImages} />
            </>
          )}

        </div>
      </section>
    </>
  );
}
