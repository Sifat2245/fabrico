import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left: Branding Panel */}
      <div className="hidden flex-col justify-between bg-stone-950 p-12 lg:flex lg:w-1/2">
        <Link
          href="/"
          className="font-display text-2xl font-bold tracking-tight text-white"
        >
          Fabrico
        </Link>

        <div className="max-w-md">
          <h2 className="font-display text-4xl font-bold leading-tight text-white">
            Style is a way to say who you are{" "}
            <span className="italic text-stone-400">without speaking.</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-stone-400">
            Join thousands of creators designing custom apparel that tells
            their story.
          </p>
        </div>

        <p className="text-xs text-stone-600">
          &copy; {new Date().getFullYear()} Fabrico. All rights reserved.
        </p>
      </div>

      {/* Right: Form Panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        {/* Mobile logo */}
        <div className="mb-12 lg:hidden">
          <Link
            href="/"
            className="font-display text-2xl font-bold tracking-tight text-stone-950"
          >
            Fabrico
          </Link>
        </div>

        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
