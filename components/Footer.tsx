"use client";

import Link from "next/link";
import { Globe, Mail, ExternalLink, ArrowRight } from "lucide-react";

const FOOTER_LINKS = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/careers", label: "Careers" },
    { href: "/press", label: "Press" },
    { href: "/sustainability", label: "Sustainability" },
  ],
  shop: [
    { href: "/shop?category=t-shirts", label: "T-Shirts" },
    { href: "/shop?category=polo-shirts", label: "Polo Shirts" },
    { href: "/shop?category=hoodies", label: "Hoodies" },
    { href: "/shop?category=jackets", label: "Jackets" },
  ],
  support: [
    { href: "/help", label: "Help Center" },
    { href: "/shipping", label: "Shipping & Returns" },
    { href: "/sizing", label: "Size Guide" },
    { href: "/contact", label: "Contact Us" },
  ],
} as const;

const SOCIAL_LINKS = [
  { href: "https://instagram.com", label: "Instagram", icon: Globe },
  { href: "https://twitter.com", label: "Twitter", icon: ExternalLink },
  { href: "mailto:hello@fabrico.com", label: "Email", icon: Mail },
] as const;

export function Footer() {
  return (
    <footer
      className="bg-stone-950 text-stone-300"
      aria-label="Site footer"
    >
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="font-display text-2xl font-bold tracking-tight text-white transition-opacity hover:opacity-80"
            >
              Fabrico
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-400">
              Premium clothing crafted for those who believe style is personal.
              Design it. Wear it. Own it.
            </p>

            {/* Newsletter */}
            <div className="mt-8">
              <p className="text-sm font-medium text-stone-200">
                Stay in the loop
              </p>
              <form
                className="mt-3 flex gap-2"
                onSubmit={(e) => e.preventDefault()}
              >
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  className="flex-1 rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-sm text-white placeholder:text-stone-500 transition-colors focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="flex items-center justify-center rounded-xl bg-white px-4 py-3 text-stone-950 transition-colors hover:bg-stone-200"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="mt-4 flex flex-col gap-3" role="list">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Shop
            </h3>
            <ul className="mt-4 flex flex-col gap-3" role="list">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Support
            </h3>
            <ul className="mt-4 flex flex-col gap-3" role="list">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row lg:px-8">
          <p className="text-xs text-stone-500">
            &copy; {new Date().getFullYear()} Fabrico. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="rounded-full p-2 text-stone-500 transition-colors hover:bg-stone-800 hover:text-white"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
