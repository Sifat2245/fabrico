"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Paintbrush, Shield, Truck, CreditCard } from "lucide-react";

const FEATURES = [
  {
    icon: Paintbrush,
    title: "Custom Designs",
    description:
      "Design your own apparel with our intuitive 3D editor. Upload art, add text, and preview in real time.",
  },
  {
    icon: Shield,
    title: "Premium Quality",
    description:
      "Every piece is crafted from carefully sourced materials with attention to detail and finish.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "From production to your doorstep in days, not weeks. Track every step of the journey.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Pay with confidence. Multiple payment options with end-to-end encryption on every transaction.",
  },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="border-t border-stone-100 py-24 sm:py-32"
      aria-label="Why Choose Fabrico"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-stone-400">
            Why Fabrico
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
            Crafted With Purpose
          </h2>
          <p className="mt-4 text-base leading-relaxed text-stone-500">
            Every detail is considered. From the first sketch to the final
            stitch, we build for people who care about what they wear.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="group text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-600 transition-colors duration-300 group-hover:bg-stone-950 group-hover:text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-sm font-semibold text-stone-950">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
