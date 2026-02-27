"use client";

import { cn } from "@/lib/utils";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Globe,
  ShoppingBag,
  Palette,
  LayoutDashboard,
  UtensilsCrossed,
} from "lucide-react";

interface WelcomeScreenProps {
  onSendMessage: (content: string) => void;
}

const suggestions = [
  {
    icon: <Globe className="size-5" />,
    label: "Landing page UMKM",
    iconBg: "bg-pink-100 dark:bg-pink-500/20 text-pink-500 dark:text-pink-400",
    prompt:
      "Buatkan landing page profesional untuk UMKM makanan rumahan dengan hero section, menu produk, testimoni, dan kontak. Gunakan warna hangat dan desain modern.",
  },
  {
    icon: <ShoppingBag className="size-5" />,
    label: "Toko online",
    iconBg: "bg-red-100 dark:bg-red-500/20 text-red-500 dark:text-red-400",
    prompt:
      "Buatkan website toko online sederhana dengan halaman katalog produk, detail produk, keranjang belanja, dan halaman checkout. Desain clean dan mobile-friendly.",
  },
  {
    icon: <UtensilsCrossed className="size-5" />,
    label: "Menu restoran",
    iconBg: "bg-blue-100 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400",
    prompt:
      "Buatkan website menu untuk restoran dengan daftar menu lengkap, harga, foto makanan, jam buka, lokasi, dan tombol order via WhatsApp.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function WelcomeScreen({ onSendMessage }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center w-full max-w-lg"
      >
        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-[38px] font-bold text-neutral-900 dark:text-neutral-100 text-center mb-3 leading-tight tracking-tight"
        >
          Unlock the power of AI
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-sm text-neutral-400 dark:text-neutral-500 text-center max-w-sm mb-10"
        >
          Chat with the smartest AI — Build your UMKM website in minutes
        </motion.p>

        {/* Suggestion Rows */}
        <motion.div variants={itemVariants} className="w-full space-y-2">
          {suggestions.map((s, i) => (
            <motion.button
              key={s.label}
              variants={itemVariants}
              whileHover={{ x: 4, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSendMessage(s.prompt)}
              className="group flex items-center justify-between w-full px-4 py-3.5 rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-white/5 hover:border-neutral-300 dark:hover:border-white/20 hover:shadow-sm dark:hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center gap-3.5">
                <div className={cn("flex size-10 items-center justify-center rounded-xl", s.iconBg)}>
                  {s.icon}
                </div>
                <span className="text-[15px] font-semibold text-neutral-800 dark:text-neutral-200">{s.label}</span>
              </div>
              <ArrowRight className="size-4 text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 group-hover:translate-x-0.5 transition-all duration-200" />
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
