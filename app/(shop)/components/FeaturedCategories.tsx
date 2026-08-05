"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/categories";

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const CATEGORY_COLORS = [
  "bg-zinc-900",
  "bg-zinc-800/80",
  "bg-zinc-900",
  "bg-zinc-800/80",
];

export function FeaturedCategories() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="py-24 sm:py-32 bg-[#09090b]"
      aria-label="Featured Categories"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-end justify-between"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-indigo-400">
              Explore
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden items-center gap-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100 sm:flex"
          >
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Category Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {categories.map((category, index) => (
            <motion.div key={category.id} variants={cardVariants}>
              <Link
                href={`/shop?category=${category.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-zinc-800"
              >
                {/* Card Background */}
                <div
                  className={`aspect-[4/5] ${CATEGORY_COLORS[index]} flex items-end p-6 transition-all duration-300 group-hover:border-zinc-600`}
                >
                  {/* Category Initial as Background Element */}
                  <span className="absolute right-4 top-4 font-display text-[120px] font-bold leading-none text-zinc-100/[0.03]">
                    {category.name.charAt(0)}
                  </span>

                  {/* Indigo accent glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-indigo-600/5 rounded-2xl" />

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="font-display text-xl font-semibold text-zinc-100">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      {category.itemCount} items
                    </p>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute right-6 bottom-6 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white opacity-0 transition-all duration-300 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile View All */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
          >
            View All Categories
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
