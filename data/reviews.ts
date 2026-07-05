import type { Product } from "@/types";

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export const reviews: Review[] = [
  {
    id: "rev-1",
    productId: "prod-1",
    author: "Alex M.",
    rating: 5,
    date: "2026-06-21",
    comment:
      "Best t-shirt I've owned. The fabric is incredibly soft and the fit is perfect. Worth every penny.",
    verified: true,
  },
  {
    id: "rev-2",
    productId: "prod-1",
    author: "Sarah K.",
    rating: 4,
    date: "2026-06-15",
    comment:
      "Great quality and fast delivery. Only wish there were more color options.",
    verified: true,
  },
  {
    id: "rev-3",
    productId: "prod-2",
    author: "James T.",
    rating: 5,
    date: "2026-06-10",
    comment:
      "The polo fits like a dream. Clean design, premium feel. Already ordered another.",
    verified: true,
  },
  {
    id: "rev-4",
    productId: "prod-3",
    author: "Maria L.",
    rating: 4,
    date: "2026-05-28",
    comment:
      "Super cozy hoodie. The material is thick but not too heavy. Great for layering.",
    verified: false,
  },
  {
    id: "rev-5",
    productId: "prod-4",
    author: "Chris P.",
    rating: 5,
    date: "2026-05-20",
    comment:
      "This bomber jacket exceeded my expectations. The attention to detail is impressive.",
    verified: true,
  },
  {
    id: "rev-6",
    productId: "prod-1",
    author: "David N.",
    rating: 3,
    date: "2026-05-15",
    comment:
      "Good quality but runs slightly large. Consider ordering a size down.",
    verified: true,
  },
];

export function getProductReviews(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId);
}

export function getAverageRating(productId: string): number {
  const productReviews = getProductReviews(productId);
  if (productReviews.length === 0) return 0;
  const total = productReviews.reduce((sum, r) => sum + r.rating, 0);
  return Math.round((total / productReviews.length) * 10) / 10;
}

// Extended product data with descriptions for detail page
export const productDescriptions: Record<string, string> = {
  "prod-1":
    "Our Essential Crew Tee is the foundation of any wardrobe. Crafted from 100% organic cotton with a relaxed fit that moves with you. Pre-shrunk, double-stitched hems, and enzyme-washed for an incredibly soft hand feel.",
  "prod-2":
    "The Minimalist Polo redefines casual sophistication. Pima cotton piqué with mother-of-pearl buttons, ribbed collar, and a modern slim fit. Designed to transition seamlessly from office to weekend.",
  "prod-3":
    "The Urban Hoodie blends street-ready style with premium comfort. Heavyweight French terry, kangaroo pocket, and a three-panel hood. Ribbed cuffs and hem for a clean silhouette.",
  "prod-4":
    "Our Heritage Bomber draws inspiration from vintage flight jackets reimagined with modern materials. Water-resistant shell, quilted lining, and signature ribbed trims. Built to last.",
  "prod-5":
    "The Classic V-Neck offers understated elegance in a supremely comfortable package. Combed cotton jersey with a gently tapered fit. Perfect layered or worn on its own.",
  "prod-6":
    "Engineered for performance and style, the Sport Polo features moisture-wicking fabric, four-way stretch, and UV protection. From the course to the street.",
  "prod-7":
    "Go big with our Oversized Hoodie. Dropped shoulders, extended length, and ultra-soft brushed fleece interior. The ultimate cozy companion for any season.",
  "prod-8":
    "The Windbreaker Lite is your go-to for unpredictable weather. Packable, water-resistant, and breathable with sealed seams and adjustable hood.",
};
