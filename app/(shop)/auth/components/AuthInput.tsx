"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
}

export function AuthInput({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  autoComplete,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-stone-700"
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`w-full rounded-xl border px-4 py-3 text-sm text-stone-950 transition-colors placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-950/10 ${
            error
              ? "border-red-300 focus:border-red-500"
              : "border-stone-200 focus:border-stone-400"
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 transition-colors hover:text-stone-600"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
