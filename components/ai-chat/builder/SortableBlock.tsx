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
    isLocked?: boolean;
}

/**
 * Wrapper dnd-kit untuk setiap block.
 * Supports isLocked mode: hide all controls, disable drag.
 */
export function SortableBlock({ block, onDelete, isLocked = false }: SortableBlockProps) {
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
                isDragging && !isLocked && "z-50 opacity-80"
            )}
        >
            {/* Hover controls — hidden when locked */}
            {!isLocked && (
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 z-10">
                    <button
                        className="p-1.5 rounded-lg bg-white border border-neutral-200 shadow-sm text-neutral-400 hover:text-neutral-700 cursor-grab active:cursor-grabbing"
                        {...attributes}
                        {...listeners}
                    >
                        <GripVertical className="w-3.5 h-3.5" />
                    </button>
                    {onDelete && (
                        <button
                            onClick={() => onDelete(block.id)}
                            className="p-1.5 rounded-lg bg-white border border-neutral-200 shadow-sm text-neutral-400 hover:text-red-500"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            )}

            {/* Block outline — only when unlocked */}
            <div className={cn(
                "rounded-xl transition-all border-2 border-transparent",
                !isLocked && "group-hover:border-blue-400 group-hover:border-dashed",
                isDragging && !isLocked && "border-blue-500 shadow-xl"
            )}>
                <BlockRenderer block={block} />
            </div>

            {/* Block type label — only when unlocked */}
            {!isLocked && (
                <div className="absolute -right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-medium rounded-md uppercase tracking-wider shadow-sm">
                        {block.type}
                    </span>
                </div>
            )}
        </div>
    );
}
