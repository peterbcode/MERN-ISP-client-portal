"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X } from "lucide-react";

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
  onImageClick: (image: GalleryImage) => void;
}

function DraggableCarousel({ images, onImageClick }: CarouselProps) {
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
                <div 
                  className="carousel-card-inner"
                  onClick={() => onImageClick(img)}
                  style={{ cursor: 'pointer' }}
                >
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
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const openImage = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeImage = () => {
    setSelectedImage(null);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeImage();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      {/* ── inline styles ────────────────────────────────────────────────── */}
      <style>{`
        /* ── Section wrapper ── */
        .gallery-section {
          position: relative;
          padding: 8rem 0 6rem;
          overflow: hidden;
          background: linear-gradient(180deg, #0a0a0b 0%, #111110 100%);
        }

        .gallery-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #ff7e26;
          margin-bottom: 1.5rem;
        }
        .gallery-eyebrow::before {
          content: "";
          display: inline-block;
          width: 24px;
          height: 2px;
          background: linear-gradient(90deg, #ff7e26, transparent);
        }

        .gallery-heading {
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
          margin: 0 0 1rem;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #ffffff 0%, #e8e4de 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .gallery-sub {
          font-size: 1rem;
          color: #9a9a94;
          max-width: 520px;
          line-height: 1.7;
          margin-bottom: 4rem;
          font-weight: 400;
        }

        /* ── Primary grid ── */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: auto;
          gap: 16px;
          margin-bottom: 4rem;
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
          border-radius: 12px;
          background: #111110;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .gallery-grid-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
        }

        .gallery-grid-item:hover .gallery-img {
          transform: scale(1.08);
        }
        .gallery-grid-item:hover .gallery-card-overlay {
          opacity: 1;
        }

        .gallery-img {
          object-fit: cover;
          object-position: center top;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          width: 100%;
          height: 100%;
        }

        .gallery-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.95) 0%,
            rgba(0, 0, 0, 0.4) 50%,
            transparent 100%
          );
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.5rem 1.25rem;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .gallery-card-num {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          color: #ff7e26;
          text-transform: uppercase;
          margin-bottom: 0.4rem;
        }

        .gallery-card-label {
          font-size: 0.95rem;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.4;
          margin: 0;
        }

        .gallery-card-tag {
          position: absolute;
          top: 16px;
          left: 16px;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          background: linear-gradient(135deg, rgba(255,126,38,0.95), rgba(255,126,38,0.85));
          color: #fff;
          padding: 6px 12px;
          border-radius: 6px;
          backdrop-filter: blur(8px);
          box-shadow: 0 2px 8px rgba(255,126,38,0.3);
        }

        /* ── Carousel section ── */
        .gallery-carousel-header {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }
        .gallery-carousel-header h3 {
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #ff7e26;
          margin: 0;
        }
        .gallery-carousel-header::after {
          content: "";
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(255,126,38,0.3), transparent);
        }

        /* ── Carousel 3D wrapper ── */
        .gallery-carousel-wrapper {
          position: relative;
          width: 100%;
          height: 380px;
          perspective: 1200px;
          overflow: hidden;
          margin-bottom: 0;
          background: linear-gradient(180deg, rgba(17,17,16,0.5) 0%, rgba(10,10,11,0.8) 100%);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .carousel-vignette {
          position: absolute;
          inset: 0;
          z-index: 20;
          pointer-events: none;
          background: linear-gradient(
            to right,
            rgba(10,10,11,0.9) 0%,
            transparent 20%,
            transparent 80%,
            rgba(10,10,11,0.9) 100%
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
          width: 260px;
          height: 300px;
          transform-style: preserve-3d;
          transition: none;
        }

        .carousel-card {
          position: absolute;
          width: 260px;
          height: 300px;
          top: 0;
          left: 0;
          backface-visibility: hidden;
          transition: opacity 0.3s ease;
        }

        .carousel-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
          background: #111110;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
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
            rgba(0,0,0,0.9) 0%,
            transparent 60%
          );
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.25rem;
          gap: 0.3rem;
        }

        .carousel-card-tag {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #ff7e26;
        }

        .carousel-card-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.4;
          margin: 0;
        }

        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 30;
          background: rgba(15,14,13,0.8);
          border: 1px solid rgba(255,126,38,0.3);
          color: #ff7e26;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }
        .carousel-arrow:hover {
          background: rgba(255,126,38,0.2);
          border-color: rgba(255,126,38,0.7);
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 6px 24px rgba(255,126,38,0.3);
        }
        .carousel-arrow-left  { left: 16px; }
        .carousel-arrow-right { right: 16px; }

        .carousel-hint {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 30;
          font-size: 0.7rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #7a7a72;
          white-space: nowrap;
          pointer-events: none;
          background: rgba(0,0,0,0.6);
          padding: 8px 16px;
          border-radius: 20px;
          backdrop-filter: blur(8px);
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .gallery-section {
            padding: 5rem 0 4rem;
          }

          .gallery-grid {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
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

          .gallery-carousel-wrapper { height: 300px; }
          .carousel-rotor,
          .carousel-card { width: 200px; height: 240px; }
          .carousel-arrow { width: 40px; height: 40px; }
          .carousel-arrow-left { left: 12px; }
          .carousel-arrow-right { right: 12px; }
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
              <div 
                key={img.src} 
                className="gallery-grid-item"
                onClick={() => openImage(img)}
                style={{ cursor: 'pointer' }}
              >
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
              <DraggableCarousel images={carouselImages} onImageClick={openImage} />
            </>
          )}

        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="lightbox-overlay"
          onClick={closeImage}
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="lightbox-close"
              onClick={closeImage}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <div className="lightbox-image-wrapper">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                sizes="100vw"
                className="lightbox-image"
                priority
              />
            </div>
            <div className="lightbox-info">
              <span className="lightbox-tag">{selectedImage.tag}</span>
              <h3 className="lightbox-title">{selectedImage.label}</h3>
              <p className="lightbox-alt">{selectedImage.alt}</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* ── Lightbox Styles ── */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        .lightbox-close {
          position: absolute;
          top: -48px;
          right: 0;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(8px);
        }

        .lightbox-close:hover {
          background: rgba(255, 126, 38, 0.3);
          border-color: rgba(255, 126, 38, 0.5);
          transform: scale(1.1);
        }

        .lightbox-image-wrapper {
          position: relative;
          width: 100%;
          max-width: 1200px;
          max-height: 70vh;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .lightbox-image {
          object-fit: contain;
          object-position: center;
        }

        .lightbox-info {
          margin-top: 1.5rem;
          text-align: center;
          max-width: 600px;
        }

        .lightbox-tag {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #ff7e26;
          background: rgba(255, 126, 38, 0.15);
          padding: 6px 12px;
          border-radius: 4px;
          margin-bottom: 0.75rem;
        }

        .lightbox-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.5rem 0;
          line-height: 1.3;
        }

        .lightbox-alt {
          font-size: 0.9rem;
          color: #9a9a94;
          margin: 0;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .lightbox-overlay {
            padding: 1rem;
          }
          .lightbox-close {
            top: -40px;
            width: 36px;
            height: 36px;
          }
          .lightbox-image-wrapper {
            max-height: 60vh;
          }
          .lightbox-title {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
}
