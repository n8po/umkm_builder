"use client";

import { MapPin, Clock, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { customStyleToCSS, variantClasses, type StylableBlockProps } from "../block-styles";

interface LocationBlockProps extends StylableBlockProps {
    address?: string;
    hours?: string;
    open_hours?: string;
    phone?: string;
    mapUrl?: string;
}

export function LocationBlock({ address = "Alamat belum diisi", hours, open_hours, phone, mapUrl, customStyle, variant }: LocationBlockProps) {
    const displayHours = hours || open_hours || "";
    const isDark = variant === "dark" || variant === "bold";

    return (
        <section className={cn("w-full py-16 px-6", isDark ? "bg-neutral-900" : "bg-neutral-50", variantClasses(variant))} style={customStyleToCSS(customStyle)}>
            <div className="max-w-6xl mx-auto">
                <h2 className={cn("text-2xl md:text-3xl font-bold text-center mb-10", isDark ? "text-white" : "text-neutral-900")}>Lokasi Kami</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className={cn("rounded-2xl overflow-hidden border min-h-[300px] flex items-center justify-center",
                        isDark ? "bg-neutral-800 border-neutral-700" : "bg-neutral-100 border-neutral-200"
                    )}>
                        {mapUrl ? (
                            <iframe src={mapUrl} className="w-full h-full min-h-[300px]" loading="lazy" title="Map" />
                        ) : (
                            <div className={cn("text-center", isDark ? "text-neutral-500" : "text-neutral-400")}>
                                <MapPin className="w-12 h-12 mx-auto mb-2" />
                                <p className="text-sm">Peta akan muncul di sini</p>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col justify-center gap-6">
                        <div className="flex items-start gap-3">
                            <MapPin className={cn("w-5 h-5 mt-0.5 shrink-0", isDark ? "text-neutral-400" : "text-neutral-500")} />
                            <div>
                                <p className={cn("font-semibold text-sm", isDark ? "text-neutral-300" : "text-neutral-900")}>Alamat</p>
                                <p className={cn(isDark ? "text-neutral-400" : "text-neutral-600")}>{address}</p>
                            </div>
                        </div>
                        {displayHours && (
                            <div className="flex items-start gap-3">
                                <Clock className={cn("w-5 h-5 mt-0.5 shrink-0", isDark ? "text-neutral-400" : "text-neutral-500")} />
                                <div>
                                    <p className={cn("font-semibold text-sm", isDark ? "text-neutral-300" : "text-neutral-900")}>Jam Buka</p>
                                    <p className={cn(isDark ? "text-neutral-400" : "text-neutral-600")}>{displayHours}</p>
                                </div>
                            </div>
                        )}
                        {phone && (
                            <div className="flex items-start gap-3">
                                <Phone className={cn("w-5 h-5 mt-0.5 shrink-0", isDark ? "text-neutral-400" : "text-neutral-500")} />
                                <div>
                                    <p className={cn("font-semibold text-sm", isDark ? "text-neutral-300" : "text-neutral-900")}>Telepon</p>
                                    <p className={cn(isDark ? "text-neutral-400" : "text-neutral-600")}>{phone}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
