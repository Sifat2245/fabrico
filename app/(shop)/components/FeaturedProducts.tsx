"use client";

import { useRef, ViewTransition } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, ShoppingBag, Palette } from "lucide-react";
import { featuredProducts } from "@/data/products";
import { useCart } from "@/lib/cart-context";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
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

export function FeaturedProducts() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const { addItem } = useCart();

  return (
    <section
      ref={sectionRef}
      className="bg-stone-50/50 py-24 sm:py-32"
      aria-label="Featured Products"
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
            <p className="text-xs font-medium uppercase tracking-widest text-stone-400">
              Curated
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden items-center gap-1.5 text-sm font-medium text-stone-600 transition-colors hover:text-stone-950 sm:flex"
          >
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Product Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {featuredProducts.slice(0, 8).map((product) => (
            <motion.article key={product.id} variants={cardVariants}>
              <div className="group">
                {/* Image Area */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-100">
                  <ViewTransition
                    name={`product-${product.id}`}
                    share="morph"
                  >
                    {/* Placeholder color block */}
                    <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-200 to-stone-100">
                      <span className="font-display text-6xl font-bold text-stone-300/50">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                  </ViewTransition>

                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-stone-950 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                      {product.badge}
                    </span>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 z-10 flex items-end justify-center gap-2 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() =>
                        addItem({
                          product,
                          quantity: 1,
                          selectedColor: product.colors?.[0],
                          selectedSize: product.sizes?.[0],
                        })
                      }
                      className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-stone-950 transition-transform hover:scale-105"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      Add to Cart
                    </button>
                    {product.customizable && (
                      <Link
                        href={`/customize?product=${product.id}`}
                        className="flex items-center gap-2 rounded-full bg-stone-800 px-5 py-2.5 text-xs font-semibold text-white transition-transform hover:scale-105"
                        aria-label={`Customize ${product.name}`}
                      >
                        <Palette className="h-3.5 w-3.5" />
                        Customize
                      </Link>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="mt-4 px-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-stone-950">
                        <Link href={`/product/${product.id}`}>
                          {product.name}
                        </Link>
                      </h3>
                      <p className="mt-0.5 text-xs text-stone-500 capitalize">
                        {product.category.replace("-", " ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-stone-950">
                        ${product.price.toFixed(2)}
                      </p>
                      {product.originalPrice && (
                        <p className="text-xs text-stone-400 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Color Swatches */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="mt-3 flex gap-1.5">
                      {product.colors.map((color: string) => (
                        <span
                          key={color}
                          className="h-3.5 w-3.5 rounded-full border border-stone-200"
                          style={{ backgroundColor: color }}
                          aria-label={`Color: ${color}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Mobile View All */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 transition-colors hover:text-stone-950"
          >
            View All Products
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
