"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BuilderBlock } from "../types";
import { BlockRenderer } from "./BlockRenderer";

interface SortableBlockProps {
    block: BuilderBlock;
    onDelete?: (id: string) => void;
}

/**
 * Wrapper dnd-kit untuk setiap block.
 * Menambahkan drag handle dan delete button.
 */
export function SortableBlock({ block, onDelete }: SortableBlockProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative",
                isDragging && "z-50 opacity-80"
            )}
        >
            {/* Hover overlay with controls */}
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 z-10">
                {/* Drag handle */}
                <button
                    className="p-1.5 rounded-lg bg-white border border-neutral-200 shadow-sm text-neutral-400 hover:text-neutral-700 cursor-grab active:cursor-grabbing"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="w-3.5 h-3.5" />
                </button>
                {/* Delete */}
                {onDelete && (
                    <button
                        onClick={() => onDelete(block.id)}
                        className="p-1.5 rounded-lg bg-white border border-neutral-200 shadow-sm text-neutral-400 hover:text-red-500"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* Block outline on hover */}
            <div className={cn(
                "rounded-xl transition-all border-2 border-transparent",
                "group-hover:border-blue-400 group-hover:border-dashed",
                isDragging && "border-blue-500 shadow-xl"
            )}>
                <BlockRenderer block={block} />
            </div>

            {/* Block type label on hover */}
            <div className="absolute -right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-medium rounded-md uppercase tracking-wider shadow-sm">
                    {block.type}
                </span>
            </div>
        </div>
    );
}
