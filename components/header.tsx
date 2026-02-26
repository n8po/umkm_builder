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
  ChartLine,
  MapPinCheck,
  MapPin,
  Sparkles,
  LogOut,
  User,
  LayoutDashboard,
  Settings,
  ArrowUpRight,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { MobileNav } from "@/components/mobile-nav";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toast } from "sonner";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { authService } from "@/lib/services";
import type { SessionUser } from "@/lib/repositories";

const useCasesItems = [
  { label: "AI Web Builder", href: "/ai-chat", icon: Sparkles },
  { label: "Business Cost Analysis", href: "/cost-analysis", icon: ChartLine },
  { label: "Business Discovery", href: "/map", icon: MapPinCheck },
];

const HEADER_HEIGHT = 80;

function UseCasesMegaMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { device } = useMediaQuery();
  const isDesktop = device === "desktop" || device === "tablet";

  const clearTimeouts = useCallback(() => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    openTimeoutRef.current = null;
    closeTimeoutRef.current = null;
  }, []);

  const handleTriggerEnter = () => {
    if (!isDesktop) return;
    clearTimeouts();
    openTimeoutRef.current = setTimeout(() => onOpenChange(true), 150);
  };

  const handleTriggerLeave = () => {
    if (!isDesktop) return;
    clearTimeouts();
    closeTimeoutRef.current = setTimeout(() => onOpenChange(false), 120);
  };

  const handlePanelEnter = () => {
    if (!isDesktop) return;
    clearTimeouts();
  };

  const handlePanelLeave = () => {
    if (!isDesktop) return;
    clearTimeouts();
    closeTimeoutRef.current = setTimeout(() => onOpenChange(false), 120);
  };

  const handleTriggerClick = () => {
    if (!isDesktop) onOpenChange(!open);
  };

  const handleTriggerFocus = () => {
    if (isDesktop) {
      clearTimeouts();
      onOpenChange(true);
    }
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => onOpenChange(false);
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [open, onOpenChange]);

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-lg font-medium text-neutral-900",
          "transition-colors hover:text-neutral-950",
          open && "text-neutral-950"
        )}
        aria-expanded={open}
        aria-haspopup="true"
        onMouseEnter={handleTriggerEnter}
        onMouseLeave={handleTriggerLeave}
        onClick={handleTriggerClick}
        onFocus={handleTriggerFocus}
      >
        <span>How it works</span>
        <ChevronDown
          className={cn(
            "ml-0.5 h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Panel */}
      <div
        className={cn(
          "dropdown-motion pointer-bridge fixed left-0 right-0 z-50",
          "bg-white border-b border-neutral-200",
        )}
        data-state={open ? "open" : "closed"}
        style={{ top: HEADER_HEIGHT }}
        onMouseEnter={handlePanelEnter}
        onMouseLeave={handlePanelLeave}
        role="dialog"
        aria-hidden={!open}
      >
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            {/* Left content */}
            <div
              className="dropdown-item-motion flex flex-col justify-center"
              data-state={open ? "open" : "closed"}
              style={{ transitionDelay: open ? "120ms" : "0ms" }}
            >
              <h3 className="text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
                Manage Business Operations &amp; Reach More Customers
              </h3>
              <p className="mt-2 text-base text-neutral-600">
                Calculate COGS &amp; BEP accurately, then display your business so customers can easily find you.
              </p>
            </div>

            {/* Right links */}
            <div className="flex flex-col justify-center gap-1">
              {useCasesItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="dropdown-item-motion flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
                    data-state={open ? "open" : "closed"}
                    style={{
                      transitionDelay: open
                        ? `${220 + index * 70}ms`
                        : "0ms",
                    }}
                    tabIndex={open ? 0 : -1}
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
          </div>
          <div className="h-16 md:h-24" />
          <div className="pointer-events-none h-16 bg-gradient-to-b from-white/0 to-white" />
        </div>
      </div>
    </div>
  );
}

// Helper: ambil inisial dari nama/email
function getInitials(user: SessionUser): string {
  const name = user.email || "";
  return name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [useCasesOpen, setUseCasesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const headerVisible = useHeaderVisibility();

  // Cek status login saat mount
  useEffect(() => {
    const loadSession = async () => {
      const session = await authService.getSession();
      setUser(session?.authenticated ? (session.user ?? null) : null);
    };

    void loadSession();
  }, []);

  const handleSignOut = async () => {
    setProfileOpen(false);
    await authService.logout();
    toast.info("Kamu telah keluar", {
      description: "Sampai jumpa lagi!",
    });
    window.location.href = "/";
  };

  // Close profile dropdown on click outside
  useEffect(() => {
    if (!profileOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [profileOpen]);

  return (
    <>
      {/* Global blur backdrop when mega menu open */}
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          useCasesOpen
            ? "opacity-100 backdrop-blur-[10px] bg-black/10 pointer-events-auto"
            : "opacity-0 backdrop-blur-0 bg-transparent pointer-events-none"
        )}
      />
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full bg-white overflow-visible",
          "transition-transform duration-300 ease-out",
          !headerVisible && "-translate-y-full",
        )}
      >
        <nav className="flex h-20 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between">
            <Link
              href="/"
              className="flex items-center rounded-md px-2 py-2"
              aria-label="Home"
            >
              <Logo className="h-8 text-neutral-800" />
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              <UseCasesMegaMenu
                open={useCasesOpen}
                onOpenChange={setUseCasesOpen}
              />

              <Link
                href="/pricing"
                className="rounded-md px-3 py-2 text-lg font-medium text-neutral-900 hover:text-neutral-950"
              >
                Pricing
              </Link>

              <Link
                href="/about"
                className="rounded-md px-3 py-2 text-lg font-medium text-neutral-900 hover:text-neutral-950"
              >
                About Us
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/map"
                className="hidden items-center gap-1.5 text-lg font-medium text-neutral-900 hover:text-neutral-950 md:inline-flex"
              >
                <MapPin className="h-4 w-4" />
                Find Retailer
              </Link>

              {user ? (
                <div ref={profileRef} className="relative hidden md:block">
                  {/* Trigger Button */}
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                  >
                    <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-neutral-200 hover:ring-neutral-400 transition-all">
                      <AvatarImage src={undefined} alt={user.email || "User"} />
                      <AvatarFallback className="bg-neutral-900 text-white text-sm font-medium">
                        {getInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                  </button>

                  {/* Dropdown Panel */}
                  <div
                    className={cn(
                      "dropdown-motion absolute right-0 top-full mt-2 w-64 rounded-xl border border-neutral-200 bg-white shadow-lg",
                    )}
                    data-state={profileOpen ? "open" : "closed"}
                  >
                    {/* Header: Avatar + Name + Email */}
                    <div className="dropdown-item-motion flex items-center gap-3 px-4 py-3" data-state={profileOpen ? "open" : "closed"} style={{ transitionDelay: profileOpen ? "80ms" : "0ms" }}>
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={undefined} alt={user.email || "User"} />
                        <AvatarFallback className="bg-neutral-900 text-white text-sm font-medium">
                          {getInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <p className="text-sm font-semibold text-neutral-900 truncate">
                          {user.email?.split("@")[0] || "User"}
                        </p>
                        <p className="text-xs text-neutral-500 truncate">
                          @{user.email?.split("@")[0] || "user"}
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-neutral-100" />

                    {/* Menu Items */}
                    <div className="py-1.5">
                      {[
                        { href: "/ai-chat", icon: Sparkles, label: "AI Web Builder" },
                        { href: "/cost-analysis", icon: ChartLine, label: "Cost Analysis" },
                        { href: "/profile", icon: Settings, label: "Settings" },
                      ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setProfileOpen(false)}
                            className="dropdown-item-motion flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                            data-state={profileOpen ? "open" : "closed"}
                            style={{ transitionDelay: profileOpen ? `${150 + i * 50}ms` : "0ms" }}
                          >
                            <Icon className="h-4 w-4 text-neutral-500" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>

                    <div className="h-px bg-neutral-100" />

                    {/* Logout */}
                    <div className="py-1.5">
                      <button
                        onClick={handleSignOut}
                        className="dropdown-item-motion flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        data-state={profileOpen ? "open" : "closed"}
                        style={{ transitionDelay: profileOpen ? "320ms" : "0ms" }}
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </button>
                    </div>

                    <div className="h-px bg-neutral-100" />

                    {/* Bottom Footer: Tier + Upgrade */}
                    <div className="dropdown-item-motion flex items-center justify-between gap-2 px-4 py-3 bg-neutral-50 rounded-b-xl" data-state={profileOpen ? "open" : "closed"} style={{ transitionDelay: profileOpen ? "380ms" : "0ms" }}>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar className="h-7 w-7 shrink-0">
                          <AvatarImage src={undefined} alt={user.email || "User"} />
                          <AvatarFallback className="bg-neutral-900 text-white text-xs font-medium">
                            {getInitials(user)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <p className="text-xs font-medium text-neutral-800 truncate">
                            {user.email?.split("@")[0] || "User"}
                          </p>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">
                            Free
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/pricing"
                        onClick={() => setProfileOpen(false)}
                        className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                      >
                        Upgrade
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/register" className="hidden md:inline-flex">
                  <RippleButton
                    size="lg"
                    className="gap-4 rounded-md bg-blue-600 px-4 text-lg text-white hover:bg-blue-700"
                  >
                    Sign Up
                    <RippleButtonRipples />
                  </RippleButton>
                </Link>
              )}

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
