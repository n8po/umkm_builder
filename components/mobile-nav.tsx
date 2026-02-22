"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import {
  RippleButton,
  RippleButtonRipples,
} from '@/components/animate-ui/components/buttons/ripple';
import { ChevronRight, XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
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
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else {
      document.body.style.overflow = "";
      setExpandedSection(null);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const navItems = [
    { label: "How it works", id: "use-cases", expandable: true },
        { label: "Pricing", href: "/pricing", expandable: false },
    { label: "About us", href: "/about", expandable: false },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-40 flex flex-col bg-white md:hidden"
      id="mobile-menu"
    >
      {/* Header with close button */}
      <div className="flex h-16 shrink-0 items-center justify-end px-4">
        <RippleButton
          type="button"
          aria-label="Close menu"
          size="icon"
          variant="ghost"
          className="mobile-nav-tap h-10 w-10 rounded-full text-neutral-600"
          onClick={onClose}
        >
          <XIcon className="h-6 w-6" />
          <RippleButtonRipples />
        </RippleButton>
      </div>

      {/* Navigation items */}
      <div className="flex flex-1 flex-col overflow-auto">
        <nav className="flex flex-col">
          {navItems.map((item, index) => (
            <div key={item.label}>
              {/* Divider line */}
              <div className="mobile-nav-divider h-px bg-neutral-200 mx-4" />
              
              {item.expandable ? (
                // Expandable accordion item
                <div>
                  <button
                    type="button"
                    className="mobile-nav-tap flex w-full items-center justify-between px-4 py-4 text-lg font-medium text-neutral-900"
                    onClick={() => toggleSection(item.id!)}
                    aria-expanded={expandedSection === item.id}
                    aria-controls={`panel-${item.id}`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight 
                      className={cn(
                        "mobile-nav-chevron h-5 w-5 text-neutral-400",
                        expandedSection === item.id && "mobile-nav-chevron-open"
                      )}
                    />
                  </button>
                  
                  {/* Accordion panel */}
                  <div
                    id={`panel-${item.id}`}
                    className={cn(
                      "mobile-nav-panel overflow-hidden",
                      expandedSection === item.id 
                        ? "mobile-nav-panel-open" 
                        : "mobile-nav-panel-closed"
                    )}
                    aria-hidden={expandedSection !== item.id}
                  >
                    {/* Border top fade in */}
                    <div 
                      className={cn(
                        "mobile-nav-panel-border h-px bg-neutral-100 mx-4",
                        expandedSection === item.id && "mobile-nav-panel-border-visible"
                      )}
                    />
                    
                    <div className="mobile-nav-panel-content px-4 pb-2 pt-1">
                      {useCasesItems.map((subItem) => {
                        const Icon = subItem.icon;
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="mobile-nav-tap flex items-center gap-3 rounded-lg px-3 py-3 text-base text-neutral-700"
                            onClick={onClose}
                            tabIndex={expandedSection === item.id ? 0 : -1}
                          >
                            <Icon className="h-5 w-5 text-neutral-400" />
                            <span>{subItem.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                // Regular nav link (no chevron)
                <Link
                  href={item.href!}
                  className="mobile-nav-tap flex items-center px-4 py-4 text-lg font-medium text-neutral-900"
                  onClick={onClose}
                >
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          ))}
          {/* Final divider */}
          <div className="mobile-nav-divider h-px bg-neutral-200 mx-4" />
        </nav>

        {/* Bottom section - Find retailer & CTA */}
        <div className="mt-auto p-4 flex flex-col gap-4">
          <Link 
            href="#find-retailer" 
            onClick={onClose}
            className="mobile-nav-tap flex items-center justify-center gap-2 py-2 text-base font-medium text-neutral-900"
          >
            <MapPin className="h-5 w-5" />
            Find retailer
          </Link>
          
          <RippleButton 
            size="lg"
            className="gap-4 rounded-md bg-blue-600 px-4 text-lg text-white hover:bg-blue-700"
            asChild
          >
            <Link href="/register" onClick={onClose}>
              Sign in
              <RippleButtonRipples />
            </Link>
          </RippleButton>
        </div>
      </div>
    </div>,
    document.body
  );
}
