"use client";

import { MessageCircle, Instagram, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { customStyleToCSS, variantClasses, type StylableBlockProps } from "../block-styles";

interface ContactBlockProps extends StylableBlockProps {
    title?: string;
    whatsapp?: string;
    instagram?: string;
    email?: string;
    buttonText?: string;
    form?: Array<{ label?: string; name?: string; type?: string }>;
}

export function ContactBlock({ title = "Hubungi Kami", whatsapp, instagram, email, buttonText = "Hubungi via WhatsApp", customStyle, variant }: ContactBlockProps) {
    const waLink = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : "#";
    const isDark = variant === "dark" || variant === "bold";

    return (
        <section className={cn("w-full py-16 px-6", isDark ? "bg-neutral-900" : "bg-white", variantClasses(variant))} style={customStyleToCSS(customStyle)}>
            <div className="max-w-2xl mx-auto text-center">
                <h2 className={cn("text-2xl md:text-3xl font-bold mb-4", isDark ? "text-white" : "text-neutral-900")}>{title}</h2>
                <p className={cn("mb-8", isDark ? "text-neutral-400" : "text-neutral-500")}>Jangan ragu untuk menghubungi kami</p>
                {whatsapp && (
                    <a href={waLink} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full font-semibold text-sm hover:bg-green-700 transition-colors mb-8"
                        style={customStyle?.accentColor ? { backgroundColor: customStyle.accentColor } : {}}
                    >
                        <MessageCircle className="w-4 h-4" />
                        {buttonText}
                    </a>
                )}
                <div className="flex items-center justify-center gap-4">
                    {instagram && (
                        <a href={`https://instagram.com/${instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
                            className={cn("flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors",
                                isDark ? "border-neutral-700 text-neutral-300 hover:bg-neutral-800" : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                            )}
                        >
                            <Instagram className="w-4 h-4" />{instagram}
                        </a>
                    )}
                    {email && (
                        <a href={`mailto:${email}`}
                            className={cn("flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors",
                                isDark ? "border-neutral-700 text-neutral-300 hover:bg-neutral-800" : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                            )}
                        >
                            <Mail className="w-4 h-4" />{email}
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}
