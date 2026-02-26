"use client";

import { cn } from "@/lib/utils";
import { customStyleToCSS, type StylableBlockProps } from "../block-styles";

interface SocialLinks {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
}

interface FooterBlockProps extends StylableBlockProps {
    businessName?: string;
    text?: string;
    year?: number;
    socialLinks?: SocialLinks;
}

export function FooterBlock({ businessName = "Nama UMKM", text, year = new Date().getFullYear(), socialLinks, customStyle, variant }: FooterBlockProps) {
    const displayText = text || `© ${year} ${businessName}. Semua hak dilindungi.`;
    const isLight = variant === "light" || variant === "minimal";

    return (
        <footer
            className={cn("w-full py-10 px-6", isLight ? "bg-neutral-100 text-neutral-900" : "bg-neutral-900 text-white")}
            style={customStyleToCSS(customStyle)}
        >
            <div className="max-w-6xl mx-auto text-center">
                <p className="font-bold text-lg mb-2">{businessName}</p>
                {socialLinks && (
                    <div className="flex items-center justify-center gap-4 mb-4">
                        {socialLinks.instagram && (
                            <a href={`https://instagram.com/${socialLinks.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
                                className={cn("text-sm transition-colors", isLight ? "text-neutral-500 hover:text-neutral-900" : "text-neutral-400 hover:text-white")}>
                                Instagram
                            </a>
                        )}
                        {socialLinks.facebook && (
                            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                                className={cn("text-sm transition-colors", isLight ? "text-neutral-500 hover:text-neutral-900" : "text-neutral-400 hover:text-white")}>
                                Facebook
                            </a>
                        )}
                        {socialLinks.tiktok && (
                            <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer"
                                className={cn("text-sm transition-colors", isLight ? "text-neutral-500 hover:text-neutral-900" : "text-neutral-400 hover:text-white")}>
                                TikTok
                            </a>
                        )}
                    </div>
                )}
                <p className={cn("text-sm", isLight ? "text-neutral-500" : "text-neutral-500")}>{displayText}</p>
            </div>
        </footer>
    );
}
