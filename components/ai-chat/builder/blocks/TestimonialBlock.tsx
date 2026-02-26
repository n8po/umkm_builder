"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { customStyleToCSS, variantClasses, type StylableBlockProps } from "../block-styles";

interface Review {
    name?: string;
    text?: string;
    rating?: number;
}

interface TestimonialBlockProps extends StylableBlockProps {
    title?: string;
    reviews?: Review[];
}

export function TestimonialBlock({ title = "Kata Pelanggan", reviews = [], customStyle, variant }: TestimonialBlockProps) {
    const isDark = variant === "dark" || variant === "bold";

    return (
        <section className={cn("w-full py-16 px-6", isDark ? "bg-neutral-900" : "bg-white", variantClasses(variant))} style={customStyleToCSS(customStyle)}>
            <div className="max-w-6xl mx-auto">
                <h2 className={cn("text-2xl md:text-3xl font-bold text-center mb-10", isDark ? "text-white" : "text-neutral-900")}>{title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {reviews.map((review, i) => (
                        <div key={i} className={cn("p-6 rounded-2xl border", isDark ? "bg-neutral-800 border-neutral-700" : "bg-neutral-50 border-neutral-200")}>
                            {review.rating && (
                                <div className="flex gap-0.5 mb-3">
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <Star key={j} className={cn("w-4 h-4", j < review.rating! ? "fill-yellow-400 text-yellow-400" : isDark ? "text-neutral-600" : "text-neutral-300")} />
                                    ))}
                                </div>
                            )}
                            {review.text && <p className={cn("text-sm leading-relaxed mb-4", isDark ? "text-neutral-300" : "text-neutral-600")}>&ldquo;{review.text}&rdquo;</p>}
                            {review.name && (
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                                        isDark ? "bg-neutral-600 text-white" : "bg-neutral-900 text-white"
                                    )} style={customStyle?.accentColor ? { backgroundColor: customStyle.accentColor } : {}}>
                                        {review.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className={cn("text-sm font-semibold", isDark ? "text-white" : "text-neutral-900")}>{review.name}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
