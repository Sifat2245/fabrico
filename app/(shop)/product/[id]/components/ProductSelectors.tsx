"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface SizeSelectorProps {
  sizes: string[];
  selected: string | null;
  onSelect: (size: string) => void;
}

export function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-300">Size</p>
        <button
          type="button"
          className="text-xs font-medium text-zinc-500 underline underline-offset-2 transition-colors hover:text-zinc-200"
        >
          Size guide
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onSelect(size)}
            className={`flex h-10 min-w-[44px] items-center justify-center rounded-xl border px-4 text-sm font-medium transition-all ${
              selected === size
                ? "border-indigo-500 bg-indigo-600 text-white"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
            }`}
            aria-label={`Size ${size}`}
            aria-pressed={selected === size}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}

interface ColorSelectorProps {
  colors: string[];
  selected: string | null;
  onSelect: (color: string) => void;
}

export function ColorSelector({ colors, selected, onSelect }: ColorSelectorProps) {
  return (
    <div>
      <p className="text-sm font-medium text-zinc-300">Color</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onSelect(color)}
            className={`relative h-8 w-8 rounded-full border-2 transition-all ${
              selected === color
                ? "border-indigo-500 ring-2 ring-indigo-500/30"
                : "border-zinc-700 hover:border-zinc-500"
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Color ${color}`}
            aria-pressed={selected === color}
          />
        ))}
      </div>
    </div>
  );
}

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md";
}

export function StarRating({ rating, size = "sm" }: StarRatingProps) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${iconSize} ${
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-zinc-700 text-zinc-700"
          }`}
        />
      ))}
    </div>
  );
}

interface InteractiveStarRatingProps {
  rating: number;
  onRate: (rating: number) => void;
}

export function InteractiveStarRating({ rating, onRate }: InteractiveStarRatingProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5 transition-transform hover:scale-110"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            className={`h-6 w-6 ${
              star <= (hovered || rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-zinc-700 text-zinc-700"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
