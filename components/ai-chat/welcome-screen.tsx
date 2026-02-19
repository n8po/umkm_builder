"use client";

import {
  Store,
  Palette,
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { LogoIcon } from "@/components/logo";
import { cn } from "@/lib/utils";

interface WelcomeScreenProps {
  onSendMessage: (content: string) => void;
}

const suggestions = [
  {
    icon: <Store className="size-4" />,
    title: "Landing page UMKM",
    description: "Buat landing page profesional untuk bisnis UMKM",
    prompt:
      "Buatkan landing page profesional untuk UMKM makanan rumahan dengan hero section, menu produk, testimoni, dan kontak. Gunakan warna hangat dan desain modern.",
  },
  {
    icon: <ShoppingBag className="size-4" />,
    title: "Toko online sederhana",
    description: "Website e-commerce dengan katalog produk",
    prompt:
      "Buatkan website toko online sederhana dengan halaman katalog produk, detail produk, keranjang belanja, dan halaman checkout. Desain clean dan mobile-friendly.",
  },
  {
    icon: <Palette className="size-4" />,
    title: "Portfolio kreatif",
    description: "Tampilkan karya dan layanan bisnis kreatif",
    prompt:
      "Buatkan website portfolio untuk bisnis jasa desain grafis. Tampilkan galeri karya, layanan yang ditawarkan, harga paket, dan form kontak. Gunakan desain minimal dan elegan.",
  },
  {
    icon: <LayoutDashboard className="size-4" />,
    title: "Dashboard admin",
    description: "Panel admin untuk manajemen bisnis",
    prompt:
      "Buatkan dashboard admin sederhana dengan sidebar navigasi, halaman overview dengan chart penjualan, tabel pesanan terbaru, dan manajemen produk.",
  },
];

export function WelcomeScreen({ onSendMessage }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12">
      {/* Logo & Title */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <div className="relative">
          <div className="relative flex size-14 items-center justify-center rounded-2xl bg-neutral-900 shadow-sm">
            <Sparkles className="size-7 text-white" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-neutral-900 font-heading">
            Apa yang ingin kamu bangun?
          </h1>
          <p className="text-sm text-neutral-500 max-w-md">
            Deskripsikan website yang kamu inginkan dan AI akan membuatkannya
            secara instan. Kamu bisa mengedit dan menyempurnakan hasilnya.
          </p>
        </div>
      </div>

      {/* Suggestion cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.title}
            onClick={() => onSendMessage(suggestion.prompt)}
            className={cn(
              "group flex flex-col gap-2 rounded-xl p-4 text-left transition-all",
              "bg-white border border-neutral-200 hover:border-neutral-300",
              "hover:bg-neutral-50 hover:shadow-sm"
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200 transition-colors">
                {suggestion.icon}
              </div>
              <span className="text-sm font-medium text-neutral-800 group-hover:text-neutral-900 transition-colors">
                {suggestion.title}
              </span>
            </div>
            <p className="text-xs text-neutral-400 group-hover:text-neutral-500 transition-colors pl-[42px]">
              {suggestion.description}
            </p>
          </button>
        ))}
      </div>

      {/* Bottom hint */}
      <div className="mt-8 flex items-center gap-2 text-xs text-neutral-400">
        <LogoIcon className="size-3.5" />
        <span>Powered by AI — UMKM Builder</span>
      </div>
    </div>
  );
}
