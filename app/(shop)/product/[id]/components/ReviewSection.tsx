"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { StarRating, InteractiveStarRating } from "./ProductSelectors";
import type { Review } from "@/data/reviews";
import { Loader2 } from "lucide-react";

interface ReviewSectionProps {
  reviews: Review[];
  averageRating: number;
  productId: string;
}

export function ReviewSection({
  reviews,
  averageRating,
  productId,
}: ReviewSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || rating === 0) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
    setShowForm(false);
    setName("");
    setRating(0);
    setComment("");
  };

  return (
    <section ref={sectionRef} className="mt-16 border-t border-stone-100 pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-stone-950">
              Customer Reviews
            </h2>
            <div className="mt-2 flex items-center gap-3">
              <StarRating rating={Math.round(averageRating)} size="md" />
              <span className="text-sm text-stone-500">
                {averageRating} out of 5 ({reviews.length} review
                {reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          </div>
          {!showForm && !submitted && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 hover:text-stone-950"
            >
              Write a Review
            </button>
          )}
        </div>

        {/* Review Form */}
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-stone-200 p-6"
          >
            <h3 className="text-sm font-semibold text-stone-950">
              Share your experience
            </h3>

            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="review-name" className="block text-sm font-medium text-stone-700">
                  Name
                </label>
                <input
                  id="review-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-950 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-950/10"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-stone-700">Rating</p>
                <div className="mt-1.5">
                  <InteractiveStarRating rating={rating} onRate={setRating} />
                </div>
              </div>

              <div>
                <label htmlFor="review-comment" className="block text-sm font-medium text-stone-700">
                  Review
                </label>
                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your experience..."
                  required
                  rows={4}
                  className="mt-1.5 w-full resize-none rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-950 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-950/10"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Submit Review"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:border-stone-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.form>
        )}

        {submitted && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            Thank you for your review! It will appear shortly.
          </motion.p>
        )}

        {/* Review List */}
        <div className="mt-8 space-y-6">
          {reviews.length === 0 ? (
            <p className="text-sm text-stone-500">
              No reviews yet. Be the first to share your experience.
            </p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-stone-100 pb-6 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-stone-600">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-950">
                        {review.author}
                        {review.verified && (
                          <span className="ml-2 text-xs text-green-600">
                            Verified Purchase
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-stone-400">
                        {new Date(review.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </section>
  );
}
