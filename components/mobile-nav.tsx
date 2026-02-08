"use client";

import Link from "next/link";
import { HomeIcon } from "@/components/ui/home";
import {
  RippleButton,
  RippleButtonRipples,
} from '@/components/animate-ui/components/buttons/ripple';
import { ChevronDown, ChevronUp, XIcon } from "lucide-react";
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
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 px-4">
       <Link href="#sign-in" className="hidden md:inline-flex">
              <RippleButton
                size="sm"
                className="gap-2 rounded-md bg-neutral-800 px-4 text-white hover:bg-neutral-700"
              >
                Sign In
                <RippleButtonRipples />
              </RippleButton>
            </Link>
        <Link href="#register" className="hidden md:inline-flex">
              <RippleButton
                size="sm"
                className="gap-2 rounded-md bg-blue-600 px-4 text-white hover:bg-blue-700"
              >
                <HomeIcon size={16} aria-hidden />
                Register
                <RippleButtonRipples />
              </RippleButton>
            </Link>    
        <RippleButton
          type="button"
          aria-label="Close menu"
          size="icon"
          className="h-10 w-10 rounded-full bg-neutral-800 text-white hover:bg-neutral-700"
          onClick={onClose}
        >
          <XIcon className="h-5 w-5" />
        </RippleButton>
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
          href="#About"
          className="rounded-md px-3 py-3.5 text-base font-medium text-neutral-800 hover:bg-neutral-50"
          onClick={onClose}
        >
          About
        </Link>

        <div className="mt-6 border-t border-neutral-200 pt-4 flex flex-col gap-3">
          <RippleButton
            className="w-full gap-2 rounded-md bg-neutral-800 text-white hover:bg-neutral-700"
            asChild
          >
            <Link href="#sign-in" onClick={onClose}>
              Sign In
            </Link>
          </RippleButton>
          <RippleButton 
            className="w-full gap-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            asChild
          >
            <Link href="#register" onClick={onClose}>
              <HomeIcon size={16} aria-hidden />
              Register
            </Link>
          </RippleButton>
        </div>
      </div>
    </div>,
    document.body
  );
}
