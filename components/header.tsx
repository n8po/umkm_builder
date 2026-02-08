"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import {
  RippleButton,
  RippleButtonRipples,
} from '@/components/animate-ui/components/buttons/ripple';
import { cn } from "@/lib/utils";
import { useHeaderVisibility } from "@/hooks/use-header-visibility";
import {
  MenuIcon,
  XIcon,
  ChevronDown,
  ChevronUp,
  ChartLine,
  MapPinCheck,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { MobileNav } from "@/components/mobile-nav";

const useCasesItems = [
  { label: "Business Cost Analysis",
    href: "#use-cases/cost-analysis", 
    icon: ChartLine },
  { label: "Business Discovery",
    href: "/map", 
    icon: MapPinCheck },
];

const HEADER_HEIGHT = 56; // h-14

function UseCasesMegaMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleTriggerEnter = () => {
    clearCloseTimeout();
    onOpenChange(true);
  };

  const handleTriggerLeave = () => {
    closeTimeoutRef.current = setTimeout(() => onOpenChange(false), 120);
  };

  const handlePanelEnter = () => {
    clearCloseTimeout();
    onOpenChange(true);
  };

  const handlePanelLeave = () => {
    onOpenChange(false);
  };

  useEffect(() => {
    return () => clearCloseTimeout();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => onOpenChange(false);
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [open, onOpenChange]);

  return (
    <div className="relative">
      <button
        type="button"
        className={cn(
          "flex items-center gap-0.5 rounded-md px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-[#e8eaed] hover:text-neutral-900",
          open && "bg-[#e8eaed] text-neutral-900"
        )}
        aria-expanded={open}
        aria-haspopup="true"
        onMouseEnter={handleTriggerEnter}
        onMouseLeave={handleTriggerLeave}
      >
        <span>Use Cases</span>
        {open ? (
          <ChevronUp className="ml-0.5 h-4 w-4" aria-hidden />
        ) : (
          <ChevronDown className="ml-0.5 h-4 w-4" aria-hidden />
        )}
      </button>
      {open && (
        <div
          className="fixed left-0 right-0 z-50 bg-white shadow-lg border-b border-neutral-200"
          style={{ top: HEADER_HEIGHT }}
          onMouseEnter={handlePanelEnter}
          onMouseLeave={handlePanelLeave}
          role="dialog"
          aria-label="Use cases menu"
        >
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
              <div className="flex flex-col justify-center">
                <h3 className="text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
                  Manage Business Operations & Reach More Customers

                </h3>
                <p className="mt-2 text-base text-neutral-600">
                  Calculate COGS & BEP accurately, then display your business so customers can easily find you.
                </p>
              </div>
              {/* Right: use case links */}
              <div className="flex flex-col justify-center gap-1">
                {useCasesItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden />
                        {item.label}
                      </span>
                      <span className="text-neutral-400" aria-hidden>
                        →
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [useCasesOpen, setUseCasesOpen] = useState(false);
  const headerVisible = useHeaderVisibility();
  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full border-b border-neutral-200/90 bg-white overflow-visible",
          "transition-transform duration-300 ease-out",
          !headerVisible && "-translate-y-full"
        )}
      >
        <nav className="flex h-14 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center rounded-md px-2 py-2 transition-colors hover:bg-[#e8eaed]"
            aria-label="Home"
          >
            <Logo className="h-5 text-neutral-800" />
          </Link>

          <div className="hidden items-center gap-0.5 md:flex">
            <Link
              href="#product"
              className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-[#e8eaed] hover:text-neutral-900"
            >
              AI Website Builder
            </Link>
            <UseCasesMegaMenu
              open={useCasesOpen}
              onOpenChange={setUseCasesOpen}
            />
            <Link
              href="#pricing"
              className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-[#e8eaed] hover:text-neutral-900"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-[#e8eaed] hover:text-neutral-900"
            >
              About 
            </Link>
          </div>

          <div className="flex items-center gap-2">
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
                Get Loka Free
                <RippleButtonRipples />
              </RippleButton>
            </Link>
            <RippleButton
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
              variant="outline"
              size="icon"
              className="rounded-md border-neutral-300 bg-white md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <XIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
              <RippleButtonRipples />
            </RippleButton>
          </div>
          </div>
        </nav>
      </header>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        useCasesItems={useCasesItems}
      />
    </>
  );
}
