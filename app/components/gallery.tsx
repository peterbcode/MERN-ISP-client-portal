"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import AnimatedSection from "./ui/animated-section";
import PremiumButton from "./ui/premium-button";

interface GalleryImage {
  src: string;
  alt: string;
  tag: string;
  label: string;
}

const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: "/gallery/RBV-Dish.jpeg",
    alt: "Wireless dish installation on a Riebeek Valley property",
    tag: "Installation",
    label: "Precision wireless links for homes and farms",
  },
  {
    src: "/gallery/High-speed.png",
    alt: "High-speed internet networking equipment",
    tag: "Network",
    label: "High-speed equipment installed and tuned",
  },
  {
    src: "/gallery/solar-and-dish.jpeg",
    alt: "Solar-backed dish installation",
    tag: "Off-grid",
    label: "Solar-backed connectivity in the field",
  },
  {
    src: "/gallery/storefront.png",
    alt: "Valley Computers storefront",
    tag: "Support",
    label: "Local support with a real storefront",
  },
  {
    src: "/gallery/Rainbow.png",
    alt: "Rainbow over the Riebeek Valley service area",
    tag: "Coverage",
    label: "Coverage across the Riebeek Valley",
  },
  {
    src: "/gallery/tower-view.jpeg",
    alt: "Communication tower view over the valley",
    tag: "Infrastructure",
    label: "Strategic tower placement for valley coverage",
  },
  {
    src: "/gallery/installation.jpeg",
    alt: "Professional installation work in progress",
    tag: "Installation",
    label: "Expert installation by trained technicians",
  },
];

const FEATURED_COUNT = 4;

function GalleryCard({
  image,
  onClick,
  gridClass = "",
  aspectClass = "aspect-[4/3]",
  isActive = false,
}: {
  image: GalleryImage;
  onClick: () => void;
  gridClass?: string;
  aspectClass?: string;
  isActive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="gallery"
      aria-label={`View ${image.label}`}
      className={`gallery-card group relative block min-h-0 w-full overflow-hidden rounded-2xl border border-white/8 bg-[#16181c] text-left shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:border-[#ff7e26]/40 hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7e26]/60 ${isActive ? 'is-active ring-2 ring-[#ff7e26] ring-offset-2 ring-offset-black' : ''} ${gridClass}`}
    >
      <div className={`relative h-full w-full ${aspectClass}`}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-80 transition duration-300 group-hover:opacity-100" />
        <span className="absolute left-4 top-4 rounded-md border border-white/10 bg-black/55 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#ff7e26] backdrop-blur-sm">
          {image.tag}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <p className="text-sm font-semibold leading-snug text-white sm:text-base">
            {image.label}
          </p>
        </div>
      </div>
    </button>
  );
}

export default function GallerySection() {
  const featuredImages = GALLERY_IMAGES.slice(0, FEATURED_COUNT);
  const moreImages = GALLERY_IMAGES.slice(FEATURED_COUNT);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [rotationIndex, setRotationIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const selectedImage =
    selectedIndex !== null ? GALLERY_IMAGES[selectedIndex] : null;

  const openImage = useCallback((index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = "hidden";
  }, []);

  const closeImage = useCallback(() => {
    setSelectedIndex(null);
    document.body.style.overflow = "";
  }, []);

  const showPrevious = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null) return null;
      return current === 0 ? GALLERY_IMAGES.length - 1 : current - 1;
    });
  }, []);

  const showNext = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null) return null;
      return current === GALLERY_IMAGES.length - 1 ? 0 : current + 1;
    });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const gallerySection = document.getElementById('gallery');
    if (!gallerySection) return;
    
    const rect = gallerySection.getBoundingClientRect();
    const isInGallery = e.clientY >= rect.top && e.clientY <= rect.bottom;
    
    if (isInGallery && !isScrolling) {
      e.preventDefault();
      setIsScrolling(true);
      setRotationIndex((prev) => {
        const direction = e.deltaY > 0 ? 1 : -1;
        const newIndex = prev + direction;
        return newIndex < 0 ? featuredImages.length - 1 : newIndex >= featuredImages.length ? 0 : newIndex;
      });
      
      setTimeout(() => {
        setIsScrolling(false);
      }, 500);
    }
  }, [featuredImages.length, isScrolling]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeImage();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, closeImage, showPrevious, showNext]);

  return (
    <>
      <section
        id="gallery"
        className="relative scroll-mt-28 py-20 text-white"
        onWheel={handleWheel}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up" className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="relative inline-block text-3xl font-black sm:text-5xl">
              <span className="absolute -top-3 left-1/2 h-[2px] w-8 -translate-x-1/2 bg-[#ff7e26]" />
              Our Work in the Field
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              Installations, infrastructure, and local support across the Riebeek
              Valley — the work behind reliable connectivity.
            </p>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={150}>
            <div className="grid grid-cols-1 gap-4 md:aspect-[12/7] md:min-h-[360px] md:grid-cols-12 md:grid-rows-6 md:gap-4">
              <GalleryCard
                image={featuredImages[rotationIndex % featuredImages.length]}
                onClick={() => openImage(rotationIndex % featuredImages.length)}
                gridClass="md:col-span-7 md:row-span-3 md:h-full"
                aspectClass="aspect-[16/10] md:aspect-auto md:h-full"
                isActive={true}
              />
              <GalleryCard
                image={featuredImages[(rotationIndex + 1) % featuredImages.length]}
                onClick={() => openImage((rotationIndex + 1) % featuredImages.length)}
                gridClass="md:col-span-5 md:col-start-9 md:row-span-6 md:h-full"
                aspectClass="aspect-[4/5] md:aspect-auto md:h-full"
              />
              <GalleryCard
                image={featuredImages[(rotationIndex + 2) % featuredImages.length]}
                onClick={() => openImage((rotationIndex + 2) % featuredImages.length)}
                gridClass="md:col-span-4 md:row-span-3 md:row-start-4 md:h-full"
                aspectClass="aspect-[4/3] md:aspect-auto md:h-full"
              />
              <GalleryCard
                image={featuredImages[(rotationIndex + 3) % featuredImages.length]}
                onClick={() => openImage((rotationIndex + 3) % featuredImages.length)}
                gridClass="md:col-span-3 md:col-start-5 md:row-span-3 md:row-start-4 md:h-full"
                aspectClass="aspect-[4/3] md:aspect-auto md:h-full"
              />
            </div>
          </AnimatedSection>

          {moreImages.length > 0 && (
            <AnimatedSection direction="up" delay={250} className="mt-10">
              <div className="mb-5 flex items-center gap-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff7e26]">
                  Additional Projects
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-[#ff7e26]/30 to-transparent" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {moreImages.map((image, index) => (
                  <GalleryCard
                    key={image.src}
                    image={image}
                    onClick={() => openImage(FEATURED_COUNT + index)}
                    aspectClass="aspect-[4/3]"
                  />
                ))}
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {selectedImage && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 p-4 sm:p-8"
          onClick={closeImage}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeImage}
              aria-label="Close preview"
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:border-[#ff7e26]/50 hover:bg-[#ff7e26]/20"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111110] shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                sizes="(max-width: 1280px) 90vw, 1200px"
                className="object-contain"
                priority
              />
            </div>

            <div className="mt-5 text-center">
              <span className="inline-block rounded-md bg-[#ff7e26]/15 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#ff7e26]">
                {selectedImage.tag}
              </span>
              <h3 className="mt-3 text-lg font-bold text-white sm:text-xl">
                {selectedImage.label}
              </h3>
              <p className="mt-2 text-sm text-zinc-400">{selectedImage.alt}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                {selectedIndex + 1} of {GALLERY_IMAGES.length}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4">
              <PremiumButton
                variant="secondary"
                size="sm"
                onClick={showPrevious}
                className="rounded-full"
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </PremiumButton>
              <PremiumButton
                variant="secondary"
                size="sm"
                onClick={showNext}
                className="rounded-full"
                aria-label="Next image"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </PremiumButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}