"use client";

import { cn } from "@/lib/utils";
import { customStyleToCSS, variantClasses, type StylableBlockProps } from "../block-styles";

interface ProductItem {
    name?: string;
    price?: number | string;
    image?: string;
    description?: string;
}

interface ProductBlockProps extends StylableBlockProps {
    title?: string;
    items?: ProductItem[];
}

function formatPrice(price?: number | string): string {
    if (!price) return "";
    const num = typeof price === "string" ? parseInt(price.replace(/\D/g, ""), 10) : price;
    if (isNaN(num)) return String(price);
    return `Rp ${num.toLocaleString("id-ID")}`;
}

export function ProductBlock({ title = "Produk Kami", items = [], customStyle, variant }: ProductBlockProps) {
    const isDark = variant === "dark" || variant === "bold";
    return (
        <section className={cn("w-full py-16 px-6", isDark ? "bg-neutral-900" : "bg-white", variantClasses(variant))} style={customStyleToCSS(customStyle)}>
            <div className="max-w-6xl mx-auto">
                <h2 className={cn("text-2xl md:text-3xl font-bold text-center mb-10", isDark ? "text-white" : "text-neutral-900")}>{title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item, i) => (
                        <div key={i} className={cn("rounded-2xl overflow-hidden hover:shadow-lg transition-shadow",
                            isDark ? "bg-neutral-800 border border-neutral-700" : "border border-neutral-200"
                        )}>
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                            ) : (
                                <div className={cn("w-full h-48 flex items-center justify-center", isDark ? "bg-neutral-700 text-neutral-500" : "bg-neutral-100 text-neutral-400")}>
                                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                                </div>
                            )}
                            <div className="p-4">
                                <h3 className={cn("font-semibold", isDark ? "text-white" : "text-neutral-900")}>{item.name || "Nama Produk"}</h3>
                                {item.description && <p className={cn("text-sm mt-1", isDark ? "text-neutral-400" : "text-neutral-500")}>{item.description}</p>}
                                {item.price && <p className={cn("text-lg font-bold mt-2", isDark ? "text-white" : "text-neutral-900")} style={customStyle?.accentColor ? { color: customStyle.accentColor } : {}}>{formatPrice(item.price)}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
