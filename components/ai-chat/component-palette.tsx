"use client";

import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import {
  Layout,
  Navigation,
  Star,
  Zap,
  DollarSign,
  MessageSquare,
  Phone,
  Image,
  GripVertical,
  Info,
} from "lucide-react";

export interface PaletteComponent {
  id: string;
  label: string;
  description: string;
  prompt: string;
  icon: React.ElementType;
  color: string;
}

export const PALETTE_COMPONENTS: PaletteComponent[] = [
  {
    id: "navbar",
    label: "Navbar",
    description: "Header navigasi dengan logo & menu",
    prompt: "Tambahkan Navbar/Header dengan logo, menu navigasi, dan tombol CTA",
    icon: Navigation,
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    id: "hero",
    label: "Hero Section",
    description: "Hero section dengan headline & CTA",
    prompt: "Tambahkan Hero Section dengan judul besar, deskripsi, dan tombol CTA utama",
    icon: Layout,
    color: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
  {
    id: "features",
    label: "Features",
    description: "Grid fitur / keunggulan produk",
    prompt: "Tambahkan section Features dengan grid 3 kolom berisi ikon, judul, dan deskripsi fitur",
    icon: Zap,
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  {
    id: "pricing",
    label: "Pricing",
    description: "Tabel harga / paket layanan",
    prompt: "Tambahkan section Pricing dengan 3 paket harga (Basic, Pro, Enterprise) beserta fitur masing-masing",
    icon: DollarSign,
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    id: "testimonial",
    label: "Testimonial",
    description: "Review / ulasan pelanggan",
    prompt: "Tambahkan section Testimonial dengan kartu ulasan pelanggan, foto, nama, dan bintang rating",
    icon: Star,
    color: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  },
  {
    id: "cta",
    label: "CTA Banner",
    description: "Banner ajakan aksi di tengah halaman",
    prompt: "Tambahkan CTA Banner dengan background warna, judul ajakan, deskripsi singkat, dan tombol",
    icon: MessageSquare,
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  {
    id: "gallery",
    label: "Gallery",
    description: "Grid foto / portfolio karya",
    prompt: "Tambahkan Gallery dengan grid foto produk atau portfolio dengan efek hover",
    icon: Image,
    color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
  {
    id: "contact",
    label: "Contact",
    description: "Formulir kontak & informasi",
    prompt: "Tambahkan section Contact dengan form (nama, email, pesan), info kontak, dan peta/lokasi",
    icon: Phone,
    color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
  {
    id: "footer",
    label: "Footer",
    description: "Footer dengan link & sosial media",
    prompt: "Tambahkan Footer dengan logo, deskripsi singkat, navigasi link, sosial media, dan copyright",
    icon: Info,
    color: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
  },
];

// ── Individual draggable item ─────────────────────────────────────
function DraggableItem({
  component,
  onInsert,
}: {
  component: PaletteComponent;
  onInsert: (prompt: string) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: component.id,
    data: { prompt: component.prompt, label: component.label },
  });

  const Icon = component.icon;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "group relative flex items-start gap-2.5 p-2.5 rounded-lg border cursor-grab active:cursor-grabbing",
        "bg-neutral-900 border-neutral-800 hover:border-neutral-600 transition-colors",
        isDragging && "opacity-50 shadow-lg"
      )}
      {...listeners}
      {...attributes}
    >
      {/* Drag handle hint */}
      <GripVertical className="size-3 text-neutral-600 group-hover:text-neutral-400 mt-0.5 shrink-0 transition-colors" />

      {/* Icon badge */}
      <div className={cn("flex size-7 items-center justify-center rounded-md border shrink-0", component.color)}>
        <Icon className="size-3.5" />
      </div>

      {/* Label & description */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-neutral-200 leading-tight">{component.label}</p>
        <p className="text-[10px] text-neutral-500 leading-tight mt-0.5 truncate">{component.description}</p>
      </div>

      {/* Quick-insert button (click instead of drag) */}
      <button
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] px-1.5 py-0.5 rounded bg-neutral-700 text-neutral-300 hover:bg-neutral-600 shrink-0"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onInsert(component.prompt);
        }}
      >
        + Tambah
      </button>
    </div>
  );
}

// ── Main palette panel ────────────────────────────────────────────
interface ComponentPaletteProps {
  onInsertPrompt: (prompt: string) => void;
  className?: string;
}

export function ComponentPalette({ onInsertPrompt, className }: ComponentPaletteProps) {
  return (
    <div className={cn("flex flex-col h-full bg-neutral-950", className)}>
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-neutral-800 shrink-0">
        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
          Komponen Siap Pakai
        </p>
        <p className="text-[10px] text-neutral-600 mt-0.5">
          Klik untuk tambah ke chat, atau drag ke preview
        </p>
      </div>

      {/* Component list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {PALETTE_COMPONENTS.map((comp) => (
          <DraggableItem key={comp.id} component={comp} onInsert={onInsertPrompt} />
        ))}
      </div>
    </div>
  );
}
