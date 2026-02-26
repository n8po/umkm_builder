"use client";

import { cn } from "@/lib/utils";
import { customStyleToCSS, variantClasses, type StylableBlockProps } from "../block-styles";

interface MenuItem {
    name?: string;
    price?: number | string;
    image?: string;
    description?: string;
    category?: string;
}

interface MenuGridBlockProps extends StylableBlockProps {
    title?: string;
    items?: MenuItem[];
}

function formatPrice(price?: number | string): string {
    if (!price) return "";
    const num = typeof price === "string" ? parseInt(price.replace(/\D/g, ""), 10) : price;
    if (isNaN(num)) return String(price);
    return `Rp ${num.toLocaleString("id-ID")}`;
}

export function MenuGridBlock({ title = "Menu Kami", items = [], customStyle, variant }: MenuGridBlockProps) {
    const isDark = variant === "dark" || variant === "bold";
    return (
        <section className={cn("w-full py-16 px-6", isDark ? "bg-neutral-900" : "bg-neutral-50", variantClasses(variant))} style={customStyleToCSS(customStyle)}>
            <div className="max-w-6xl mx-auto">
                <h2 className={cn("text-2xl md:text-3xl font-bold text-center mb-10", isDark ? "text-white" : "text-neutral-900")}>{title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item, i) => (
                        <div key={i} className={cn("flex items-center gap-4 p-4 rounded-xl hover:shadow-md transition-shadow",
                            isDark ? "bg-neutral-800 border border-neutral-700" : "bg-white border border-neutral-200"
                        )}>
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                            ) : (
                                <div className={cn("w-16 h-16 rounded-lg shrink-0 flex items-center justify-center text-2xl", isDark ? "bg-neutral-700" : "bg-neutral-100")}>🍽️</div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className={cn("font-semibold truncate", isDark ? "text-white" : "text-neutral-900")}>{item.name || "Nama Menu"}</h3>
                                    <span className={cn("font-bold shrink-0", isDark ? "text-white" : "text-neutral-900")} style={customStyle?.accentColor ? { color: customStyle.accentColor } : {}}>{formatPrice(item.price)}</span>
                                </div>
                                {item.description && <p className={cn("text-sm mt-0.5 truncate", isDark ? "text-neutral-400" : "text-neutral-500")}>{item.description}</p>}
                                {item.category && (
                                    <span className={cn("inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider",
                                        isDark ? "bg-neutral-700 text-neutral-400" : "bg-neutral-100 text-neutral-500"
                                    )}>{item.category}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
