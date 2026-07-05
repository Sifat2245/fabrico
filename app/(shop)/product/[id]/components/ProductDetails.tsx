"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Palette, Truck, Shield, RotateCcw } from "lucide-react";
import type { Product } from "@/types";
import { SizeSelector, ColorSelector, StarRating } from "./ProductSelectors";
import { useCart } from "@/lib/cart-context";

interface ProductDetailsProps {
  product: Product;
  description: string;
  averageRating: number;
  reviewCount: number;
}

export function ProductDetails({
  product,
  description,
  averageRating,
  reviewCount,
}: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors?.[0] ?? null
  );

  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      product,
      quantity: 1,
      selectedColor: selectedColor ?? undefined,
      selectedSize: selectedSize ?? undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col justify-center"
    >
      {/* Badge */}
      {product.badge && (
        <span className="mb-3 inline-flex w-fit items-center rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-stone-700">
          {product.badge}
        </span>
      )}

      {/* Title & Price */}
      <h1 className="font-display text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
        {product.name}
      </h1>

      <div className="mt-3 flex items-center gap-4">
        <p className="text-2xl font-bold text-stone-950">
          ${product.price.toFixed(2)}
        </p>
        {product.originalPrice && (
          <p className="text-lg text-stone-400 line-through">
            ${product.originalPrice.toFixed(2)}
          </p>
        )}
      </div>

      {/* Rating */}
      {reviewCount > 0 && (
        <div className="mt-3 flex items-center gap-2">
          <StarRating rating={Math.round(averageRating)} />
          <span className="text-sm text-stone-500">
            {averageRating} ({reviewCount})
          </span>
        </div>
      )}

      {/* Description */}
      <p className="mt-6 text-base leading-relaxed text-stone-600">
        {description}
      </p>

      {/* Color Selector */}
      {product.colors && product.colors.length > 0 && (
        <div className="mt-8">
          <ColorSelector
            colors={product.colors}
            selected={selectedColor}
            onSelect={setSelectedColor}
          />
        </div>
      )}

      {/* Size Selector */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="mt-6">
          <SizeSelector
            sizes={product.sizes}
            selected={selectedSize}
            onSelect={setSelectedSize}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToCart}
          className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-stone-950 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
        >
          <ShoppingBag className="h-4 w-4" />
          Order Now
        </button>
        {product.customizable && (
          <Link
            href={`/customize?product=${product.id}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-stone-200 px-6 py-4 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:text-stone-950"
          >
            <Palette className="h-4 w-4" />
            Customize
          </Link>
        )}
      </div>

      {/* Feature badges */}
      <div className="mt-8 grid grid-cols-3 gap-4 border-t border-stone-100 pt-8">
        {[
          { icon: Truck, label: "Free Shipping" },
          { icon: Shield, label: "2-Year Warranty" },
          { icon: RotateCcw, label: "30-Day Returns" },
        ].map((feature) => (
          <div key={feature.label} className="flex flex-col items-center text-center">
            <feature.icon className="h-5 w-5 text-stone-400" />
            <p className="mt-1.5 text-xs text-stone-500">{feature.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
