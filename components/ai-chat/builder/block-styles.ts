/**
 * ============================================================
 * BLOCK STYLES — Shared types & utilities untuk custom styling
 * ============================================================
 * Setiap block component bisa menerima `customStyle` dari JSON
 * yang dihasilkan AI. Ini memungkinkan AI mengontrol tampilan
 * (warna, font size, spacing) sambil tetap renderable via dnd-kit.
 */

import type { CSSProperties } from "react";

/** Custom style yang bisa diatur AI via JSON */
export interface CustomStyle {
    bgColor?: string;
    textColor?: string;
    accentColor?: string;
    fontSize?: string;
    fontFamily?: string;
    padding?: string;
    rounded?: boolean;
    shadow?: boolean;
    borderColor?: string;
    opacity?: number;
    gradient?: string;
}

/** Variant desain yang sudah predefined */
export type BlockVariant = "default" | "dark" | "light" | "gradient" | "minimal" | "bold";

/** Props tambahan yang semua block terima */
export interface StylableBlockProps {
    customStyle?: CustomStyle;
    variant?: BlockVariant;
}

/**
 * Convert CustomStyle → React CSSProperties
 */
export function customStyleToCSS(style?: CustomStyle): CSSProperties {
    if (!style) return {};

    const css: CSSProperties = {};

    if (style.bgColor) css.backgroundColor = style.bgColor;
    if (style.textColor) css.color = style.textColor;
    if (style.fontSize) css.fontSize = style.fontSize;
    if (style.fontFamily) css.fontFamily = style.fontFamily;
    if (style.padding) css.padding = style.padding;
    if (style.borderColor) css.borderColor = style.borderColor;
    if (style.opacity !== undefined) css.opacity = style.opacity;
    if (style.gradient) css.background = style.gradient;

    return css;
}

/**
 * Variant → Tailwind classes
 */
export function variantClasses(variant?: BlockVariant): string {
    switch (variant) {
        case "dark":
            return "bg-neutral-900 text-white";
        case "light":
            return "bg-white text-neutral-900";
        case "gradient":
            return "bg-gradient-to-br from-blue-600 to-purple-700 text-white";
        case "minimal":
            return "bg-transparent text-neutral-700";
        case "bold":
            return "bg-neutral-950 text-white";
        default:
            return "";
    }
}
