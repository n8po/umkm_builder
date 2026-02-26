"use client";

import { cn } from "@/lib/utils";
import { customStyleToCSS, variantClasses, type StylableBlockProps } from "../block-styles";

interface AboutBlockProps extends StylableBlockProps {
    title?: string;
    description?: string;
    content?: string;
    image?: string;
    highlights?: string[];
}

export function AboutBlock({ title = "Tentang Kami", description, content, image, highlights = [], customStyle, variant }: AboutBlockProps) {
    const displayText = description || content || "";
    const isDark = variant === "dark" || variant === "bold";

    return (
        <section className={cn("w-full py-16 px-6", isDark ? "bg-neutral-900" : "bg-white", variantClasses(variant))} style={customStyleToCSS(customStyle)}>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className={cn("text-2xl md:text-3xl font-bold mb-4", isDark ? "text-white" : "text-neutral-900")}>{title}</h2>
                    {displayText && <p className={cn("leading-relaxed mb-6", isDark ? "text-neutral-300" : "text-neutral-600")}>{displayText}</p>}
                    {highlights.length > 0 && (
                        <ul className="space-y-2">
                            {highlights.map((h, i) => (
                                <li key={i} className={cn("flex items-center gap-2 text-sm", isDark ? "text-neutral-300" : "text-neutral-700")}>
                                    <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs shrink-0" style={customStyle?.accentColor ? { backgroundColor: customStyle.accentColor + "20", color: customStyle.accentColor } : {}}>✓</span>
                                    {h}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div>
                    {image ? (
                        <img src={image} alt={title} className="w-full rounded-2xl object-cover aspect-[4/3]" />
                    ) : (
                        <div className={cn("w-full aspect-[4/3] rounded-2xl flex items-center justify-center", isDark ? "bg-neutral-800 text-neutral-600" : "bg-neutral-100 text-neutral-400")}>
                            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
