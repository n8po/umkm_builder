"use client";

import type { BuilderBlock } from "../types";
import { HeaderBlock } from "./blocks/HeaderBlock";
import { HeroBlock } from "./blocks/HeroBlock";
import { ProductBlock } from "./blocks/ProductBlock";
import { MenuGridBlock } from "./blocks/MenuGridBlock";
import { AboutBlock } from "./blocks/AboutBlock";
import { LocationBlock } from "./blocks/LocationBlock";
import { ContactBlock } from "./blocks/ContactBlock";
import { GalleryBlock } from "./blocks/GalleryBlock";
import { TestimonialBlock } from "./blocks/TestimonialBlock";
import { FooterBlock } from "./blocks/FooterBlock";

interface BlockRendererProps {
    block: BuilderBlock;
}

/**
 * Mapping type → komponen React.
 * Menerima BuilderBlock dari JSON schema dan render komponen yang sesuai.
 */
export function BlockRenderer({ block }: BlockRendererProps) {
    const props = block.props as Record<string, any>;

    switch (block.type) {
        case "header":
            return <HeaderBlock {...props} />;
        case "hero":
            return <HeroBlock {...props} />;
        case "product":
            return <ProductBlock {...props} />;
        case "menu-grid":
            return <MenuGridBlock {...props} />;
        case "about":
            return <AboutBlock {...props} />;
        case "location":
            return <LocationBlock {...props} />;
        case "contact":
            return <ContactBlock {...props} />;
        case "gallery":
            return <GalleryBlock {...props} />;
        case "testimonial":
            return <TestimonialBlock {...props} />;
        case "footer":
            return <FooterBlock {...props} />;
        default:
            return (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
                    Komponen tidak dikenal: <code>{block.type}</code>
                </div>
            );
    }
}
