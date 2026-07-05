"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

const STAGGER_DELAY = 0.15;

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3 + i * STAGGER_DELAY,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-stone-950"
      aria-label="Hero"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900/95 to-stone-950" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Decorative Accent Line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-12 top-0 h-32 w-px origin-top bg-gradient-to-b from-stone-400/60 to-transparent hidden lg:block"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-32 text-center lg:px-8">
        {/* Eyebrow */}
        <motion.p
          custom={0}
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 rounded-full border border-stone-700/50 bg-stone-800/40 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-stone-300"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
          Premium Custom Apparel
        </motion.p>

        {/* Headline */}
        <motion.h1
          custom={1}
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-8 max-w-4xl font-display text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-8xl"
        >
          Wear Your{" "}
          <span className="italic text-stone-400">Identity</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          custom={2}
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-stone-400 sm:text-xl"
        >
          Design custom apparel that tells your story. From concept to
          creation, every piece is uniquely yours.
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={3}
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-stone-950 transition-all hover:bg-stone-200 hover:shadow-lg hover:shadow-white/10"
          >
            Shop Collection
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/customize"
            className="group inline-flex items-center gap-2 rounded-full border border-stone-600 px-8 py-4 text-sm font-semibold text-stone-300 transition-all hover:border-stone-400 hover:text-white"
          >
            Start Designing
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          custom={4}
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-20 grid max-w-lg grid-cols-3 gap-8 border-t border-stone-800 pt-10"
        >
          {[
            { value: "50K+", label: "Happy Customers" },
            { value: "200+", label: "Unique Designs" },
            { value: "4.9★", label: "Average Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl font-bold text-white sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-stone-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-stone-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
