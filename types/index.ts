export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  badge?: "New" | "Best Seller" | "Limited";
  customizable: boolean;
  description?: string;
  colors?: string[];
  sizes?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount: number;
  description?: string;
}
