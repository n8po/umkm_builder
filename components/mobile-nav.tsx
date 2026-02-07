"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ChevronDown, ChevronUp, Download, XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";

export type UseCaseItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  useCasesItems: UseCaseItem[];
  brandName?: string;
};

export function MobileNav({
  open,
  onClose,
  useCasesItems,
  brandName = "Google Antigravity",
}: MobileNavProps) {
  const [useCasesExpanded, setUseCasesExpanded] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else {
      document.body.style.overflow = "";
      setUseCasesExpanded(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-40 flex flex-col bg-white md:hidden"
      id="mobile-menu"
    >
      {/* Mobile menu header: logo left, close button right */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 px-4">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={onClose}
        >
          <Logo className="h-5 text-neutral-800" />
          <span className="text-sm font-medium text-neutral-800">
            {brandName}
          </span>
        </Link>
        <Button
          type="button"
          aria-label="Close menu"
          size="icon"
          className="h-10 w-10 rounded-full bg-neutral-800 text-white hover:bg-neutral-700"
          onClick={onClose}
        >
          <XIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-1 flex-col overflow-auto p-4">
        <Link
          href="#product"
          className="rounded-md px-3 py-3.5 text-base font-medium text-neutral-800 hover:bg-neutral-50"
          onClick={onClose}
        >
          Product
        </Link>

        {/* Use Cases - expandable */}
        <div>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-md px-3 py-3.5 text-base font-medium text-neutral-800 hover:bg-neutral-50"
            onClick={() => setUseCasesExpanded(!useCasesExpanded)}
            aria-expanded={useCasesExpanded}
          >
            Use Cases
            {useCasesExpanded ? (
              <ChevronUp className="h-5 w-5 text-neutral-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-neutral-500" />
            )}
          </button>
          {useCasesExpanded && (
            <div className="pl-4 pr-2 pb-2">
              {useCasesItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    onClick={onClose}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0 text-neutral-500" />
                      {item.label}
                    </span>
                    <span className="text-neutral-400">→</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <Link
          href="#pricing"
          className="rounded-md px-3 py-3.5 text-base font-medium text-neutral-800 hover:bg-neutral-50"
          onClick={onClose}
        >
          Pricing
        </Link>

        <Link
          href="#blog"
          className="rounded-md px-3 py-3.5 text-base font-medium text-neutral-800 hover:bg-neutral-50"
          onClick={onClose}
        >
          Blog
        </Link>

        <div className="mt-6 border-t border-neutral-200 pt-4">
          <Button
            className="w-full gap-2 rounded-md bg-neutral-800 text-white hover:bg-neutral-700"
            asChild
          >
            <Link href="#download" onClick={onClose}>
              <Download className="h-4 w-4" />
              Download for Windows
            </Link>
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
