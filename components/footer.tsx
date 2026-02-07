"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";

const footerLinks = [
  { label: "Product", href: "#product" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Privacy", href: "#privacy" },
  { label: "Terms", href: "#terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-center">
          <Link href="/" className="shrink-0" aria-label="Home">
            <Logo className="h-5 text-neutral-900" />
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {footerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 border-t border-neutral-200 pt-8 text-center md:text-left">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Your Product. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
