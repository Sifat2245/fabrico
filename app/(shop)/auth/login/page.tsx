"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { AuthInput } from "../components/AuthInput";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login — will connect to API later
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
    >
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-stone-950">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          id="login-email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
          required
          autoComplete="email"
        />

        <AuthInput
          id="login-password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          required
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-stone-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-stone-300 accent-stone-950"
            />
            Remember me
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-950"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800 disabled:opacity-60"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-stone-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="font-semibold text-stone-950 transition-colors hover:text-stone-700"
        >
          Create one
        </Link>
      </p>
    </motion.div>
  );
}
