"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { AuthInput } from "../components/AuthInput";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setIsSent(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
    >
      {!isSent ? (
        <>
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-stone-950">
              Forgot your password?
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              Enter your email and we&apos;ll send you a reset link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              id="forgot-email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
              required
              autoComplete="email"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800 disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-7 w-7 text-green-600" />
          </div>
          <h2 className="font-display text-xl font-bold text-stone-950">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            We sent a password reset link to{" "}
            <span className="font-medium text-stone-700">{email}</span>
          </p>
          <p className="mt-4 text-xs text-stone-400">
            Didn&apos;t receive it? Check your spam folder or{" "}
            <button
              type="button"
              onClick={() => setIsSent(false)}
              className="font-medium text-stone-600 underline underline-offset-2 hover:text-stone-950"
            >
              try again
            </button>
          </p>
        </motion.div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 transition-colors hover:text-stone-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </motion.div>
  );
}
