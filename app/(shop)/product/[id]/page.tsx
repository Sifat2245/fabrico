import { ViewTransition } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { featuredProducts } from "@/data/products";
import {
  getProductReviews,
  getAverageRating,
  productDescriptions,
} from "@/data/reviews";
import { ReviewSection } from "./components/ReviewSection";
import { ArrowLeft } from "lucide-react";
import { ProductDetails } from "./components/ProductDetails";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = featuredProducts.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const reviews = getProductReviews(product.id);
  const averageRating = getAverageRating(product.id);
  const description = productDescriptions[product.id] ?? "";

  return (
    <ViewTransition
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      default="none"
    >
      <div className="pt-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-stone-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to shop
          </Link>

          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Product Image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-100">
              <ViewTransition
                name={`product-${product.id}`}
                share="morph"
              >
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-stone-200 to-stone-100">
                  <span className="font-display text-9xl font-bold text-stone-300/40">
                    {product.name.charAt(0)}
                  </span>
                </div>
              </ViewTransition>
            </div>

            {/* Product Info */}
            <ProductDetails
              product={product}
              description={description}
              averageRating={averageRating}
              reviewCount={reviews.length}
            />
          </div>

          {/* Reviews */}
          <ReviewSection
            reviews={reviews}
            averageRating={averageRating}
            productId={product.id}
          />
        </div>

        {/* Bottom spacer */}
        <div className="h-24" />
      </div>
    </ViewTransition>
  );
}

export function generateStaticParams() {
  return featuredProducts.map((product) => ({
    id: product.id,
  }));
}
