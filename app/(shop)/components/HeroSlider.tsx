"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface Slide {
  id: number;
  headline: string;
  highlightedWord: string;
  subtitle: string;
  cta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

const SLIDES: Slide[] = [
  {
    id: 1,
    headline: "Wear Your",
    highlightedWord: "Identity",
    subtitle:
      "Design custom apparel that tells your story. From concept to creation, every piece is uniquely yours.",
    cta: { label: "Shop Collection", href: "/shop" },
    secondaryCta: { label: "Start Designing", href: "/customizer" },
  },
  {
    id: 2,
    headline: "Design Without",
    highlightedWord: "Limits",
    subtitle:
      "Upload your art, add custom text, change colors — preview everything in real-time 3D before you order.",
    cta: { label: "Open Studio", href: "/customizer" },
    secondaryCta: { label: "See Examples", href: "/shop" },
  },
  {
    id: 3,
    headline: "Premium",
    highlightedWord: "Quality",
    subtitle:
      "Every piece crafted from carefully sourced materials. No compromise on fabric, fit, or finish.",
    cta: { label: "Explore Fabrics", href: "/shop" },
    secondaryCta: { label: "Our Story", href: "/about" },
  },
];

const AUTO_PLAY_INTERVAL = 6000;

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const slide = SLIDES[current];

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#09090b]"
      aria-label="Featured promotions"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background — shared dark base with subtle animated accents */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          {/* Dot-grid texture */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "48px 48px",
            }}
          />
          {/* Indigo accent blurs */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.12 }}
            transition={{ duration: 1.2 }}
            className="absolute -right-32 top-1/4 h-[500px] w-[500px] rounded-full bg-indigo-600 blur-[140px]"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.07 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="absolute -left-32 bottom-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500 blur-[120px]"
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="max-w-3xl"
          >
            {/* Eyebrow */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-indigo-400">
              <Sparkles className="h-3 w-3" />
              Fabrico Design Studio
            </div>

            <motion.h1
              className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-zinc-100 sm:text-6xl lg:text-8xl"
            >
              {slide.headline}{" "}
              <span className="italic text-indigo-400">
                {slide.highlightedWord}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400 sm:text-xl"
            >
              {slide.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-col items-start gap-4 sm:flex-row"
            >
              <Link
                href={slide.cta.href}
                className="group inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
              >
                {slide.cta.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={slide.secondaryCta.href}
                className="group inline-flex items-center gap-2 rounded-full border border-zinc-700 px-8 py-4 text-sm font-semibold text-zinc-300 transition-all hover:border-zinc-500 hover:text-white"
              >
                {slide.secondaryCta.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-0 right-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Progress Dots */}
          <div className="flex items-center gap-3">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="group relative h-[2px] w-12 overflow-hidden rounded-full bg-zinc-800"
              >
                {i === current && (
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-indigo-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: AUTO_PLAY_INTERVAL / 1000,
                      ease: "linear",
                    }}
                    key={`progress-${current}-${Date.now()}`}
                  />
                )}
                {i !== current && (
                  <div className="absolute inset-0 rounded-full transition-colors group-hover:bg-zinc-600" />
                )}
              </button>
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
