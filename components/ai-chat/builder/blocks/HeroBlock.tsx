"use client";

import { cn } from "@/lib/utils";
import { customStyleToCSS, variantClasses, type StylableBlockProps } from "../block-styles";

interface HeroBlockProps extends StylableBlockProps {
    title?: string;
    subtitle?: string;
    description?: string;
    bgImage?: string;
    ctaText?: string;
    ctaLink?: string;
    call_to_action?: string;
    button_text?: string;
}

export function HeroBlock({
    title = "Selamat Datang",
    subtitle,
    description,
    bgImage,
    ctaText,
    call_to_action,
    button_text,
    customStyle,
    variant = "default",
}: HeroBlockProps) {
    const displaySubtitle = subtitle || description || call_to_action || "";
    const displayCta = ctaText || button_text || "";

    const variantBg: Record<string, string> = {
        default: "bg-gradient-to-br from-neutral-900 to-neutral-800 text-white",
        dark: "bg-neutral-950 text-white",
        light: "bg-neutral-50 text-neutral-900",
        gradient: "bg-gradient-to-br from-blue-600 to-purple-700 text-white",
        minimal: "bg-white text-neutral-900 border-b border-neutral-200",
        bold: "bg-gradient-to-r from-orange-500 to-pink-600 text-white",
    };

    return (
        <section
            className={cn("relative w-full py-20 px-6 overflow-hidden", variantBg[variant] || variantBg.default)}
            style={{
                ...(bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" } : {}),
                ...customStyleToCSS(customStyle),
            }}
        >
            {bgImage && <div className="absolute inset-0 bg-black/50" />}
            <div className="relative max-w-4xl mx-auto text-center">
                <h1 className={cn("text-4xl md:text-5xl font-extrabold tracking-tight mb-4", customStyle?.fontSize && `text-${customStyle.fontSize}`)}>
                    {title}
                </h1>
                {displaySubtitle && (
                    <p className={cn("text-lg md:text-xl max-w-2xl mx-auto mb-8", variant === "light" || variant === "minimal" ? "text-neutral-600" : "text-neutral-300")}>
                        {displaySubtitle}
                    </p>
                )}
                {displayCta && (
                    <button
                        className={cn(
                            "inline-flex items-center px-6 py-3 rounded-full font-semibold text-sm transition-colors",
                            variant === "light" || variant === "minimal"
                                ? "bg-neutral-900 text-white hover:bg-neutral-800"
                                : "bg-white text-neutral-900 hover:bg-neutral-100"
                        )}
                        style={customStyle?.accentColor ? { backgroundColor: customStyle.accentColor, color: "#fff" } : {}}
                    >
                        {displayCta}
                    </button>
                )}
            </div>
        </section>
    );
}
