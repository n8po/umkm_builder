"use client";

import { cn } from "@/lib/utils";
import { customStyleToCSS, variantClasses, type StylableBlockProps } from "../block-styles";

interface HeaderBlockProps extends StylableBlockProps {
    businessName?: string;
    logo?: string;
    navItems?: string[];
}

export function HeaderBlock({ businessName = "Nama UMKM", logo, navItems = [], customStyle, variant }: HeaderBlockProps) {
    return (
        <header
            className={cn("w-full border-b border-neutral-200", variant === "dark" ? "bg-neutral-900 text-white border-neutral-700" : "bg-white", variantClasses(variant))}
            style={customStyleToCSS(customStyle)}
        >
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {logo ? (
                        <img src={logo} alt={businessName} className="h-8 w-8 rounded-lg object-cover" />
                    ) : (
                        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold",
                            variant === "dark" ? "bg-white text-neutral-900" : "bg-neutral-900 text-white"
                        )} style={customStyle?.accentColor ? { backgroundColor: customStyle.accentColor } : {}}>
                            {businessName.charAt(0)}
                        </div>
                    )}
                    <span className="text-lg font-bold">{businessName}</span>
                </div>
                {navItems.length > 0 && (
                    <nav className="hidden md:flex items-center gap-6">
                        {navItems.map((item, i) => (
                            <span key={i} className={cn("text-sm cursor-pointer transition-colors",
                                variant === "dark" ? "text-neutral-300 hover:text-white" : "text-neutral-600 hover:text-neutral-900"
                            )}>
                                {item}
                            </span>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    );
}
