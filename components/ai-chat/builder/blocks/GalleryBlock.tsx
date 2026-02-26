"use client";

import { cn } from "@/lib/utils";
import { customStyleToCSS, variantClasses, type StylableBlockProps } from "../block-styles";

interface GalleryImage {
    url?: string;
    caption?: string;
}

interface GalleryBlockProps extends StylableBlockProps {
    title?: string;
    images?: GalleryImage[];
}

export function GalleryBlock({ title = "Galeri", images = [], customStyle, variant }: GalleryBlockProps) {
    const isDark = variant === "dark" || variant === "bold";

    return (
        <section className={cn("w-full py-16 px-6", isDark ? "bg-neutral-900" : "bg-neutral-50", variantClasses(variant))} style={customStyleToCSS(customStyle)}>
            <div className="max-w-6xl mx-auto">
                <h2 className={cn("text-2xl md:text-3xl font-bold text-center mb-10", isDark ? "text-white" : "text-neutral-900")}>{title}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.length > 0 ? (
                        images.map((img, i) => (
                            <div key={i} className={cn("relative group rounded-xl overflow-hidden aspect-square", customStyle?.rounded === false && "rounded-none")}>
                                {img.url ? (
                                    <img src={img.url} alt={img.caption || ""} className="w-full h-full object-cover" />
                                ) : (
                                    <div className={cn("w-full h-full flex items-center justify-center", isDark ? "bg-neutral-800 text-neutral-600" : "bg-neutral-200 text-neutral-400")}>
                                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                )}
                                {img.caption && (
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white text-sm">{img.caption}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className={cn("rounded-xl aspect-square flex items-center justify-center", isDark ? "bg-neutral-800 text-neutral-600" : "bg-neutral-200 text-neutral-400")}>
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
