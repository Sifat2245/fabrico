import type { Metadata } from "next";
import { playfairDisplay, dmSans } from "@/lib/fonts";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";
import { CartSidebar } from "@/components/CartSidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fabrico — Wear Your Identity",
  description:
    "Premium clothing e-commerce platform. Browse, customize, and order apparel designed to express your unique style.",
  keywords: ["clothing", "custom apparel", "fashion", "e-commerce", "premium"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
