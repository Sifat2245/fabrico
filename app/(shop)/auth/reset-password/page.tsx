"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { AuthInput } from "../components/AuthInput";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
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
    setIsReset(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
    >
      {!isReset ? (
        <>
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-stone-950">
              Set new password
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              Choose a strong password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              id="reset-password"
              label="New Password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={setPassword}
              error={errors.password}
              required
              autoComplete="new-password"
            />

            <AuthInput
              id="reset-confirm"
              label="Confirm New Password"
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
                  Reset Password
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
            Password updated
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            Your password has been reset successfully
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
          >
            Sign In
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
