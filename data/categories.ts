import type { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "T-Shirts",
    slug: "t-shirts",
    image: "/images/categories/tshirts.jpg",
    itemCount: 48,
    description: "Essential everyday wear crafted from premium cotton",
  },
  {
    id: "cat-2",
    name: "Polo Shirts",
    slug: "polo-shirts",
    image: "/images/categories/polos.jpg",
    itemCount: 32,
    description: "Refined casual wear with a sophisticated edge",
  },
  {
    id: "cat-3",
    name: "Hoodies",
    slug: "hoodies",
    image: "/images/categories/hoodies.jpg",
    itemCount: 24,
    description: "Cozy comfort meets contemporary street style",
  },
  {
    id: "cat-4",
    name: "Jackets",
    slug: "jackets",
    image: "/images/categories/jackets.jpg",
    itemCount: 18,
    description: "Outerwear designed for impact and warmth",
  },
];
