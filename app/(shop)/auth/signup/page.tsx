"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { AuthInput } from "../components/AuthInput";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
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
          Create your account
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Join Fabrico and start designing your wardrobe
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          id="signup-name"
          label="Full Name"
          placeholder="John Doe"
          value={name}
          onChange={setName}
          error={errors.name}
          required
          autoComplete="name"
        />

        <AuthInput
          id="signup-email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
          error={errors.email}
          required
          autoComplete="email"
        />

        <AuthInput
          id="signup-password"
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={setPassword}
          error={errors.password}
          required
          autoComplete="new-password"
        />

        <AuthInput
          id="signup-confirm"
          label="Confirm Password"
          type="password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
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
              Create Account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-stone-500">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-stone-950 transition-colors hover:text-stone-700"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
