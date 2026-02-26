"use client";

import { useState, useCallback } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BuilderBlock } from "../types";
import { SortableBlock } from "./SortableBlock";

interface BuilderCanvasProps {
    blocks: BuilderBlock[];
    onBlocksChange: (blocks: BuilderBlock[]) => void;
}

type ViewMode = "desktop" | "tablet" | "mobile";

/**
 * Canvas utama builder.
 * Render semua block dari JSON schema dengan dnd-kit drag-and-drop.
 */
export function BuilderCanvas({ blocks, onBlocksChange }: BuilderCanvasProps) {
    const [viewMode, setViewMode] = useState<ViewMode>("desktop");

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            if (over && active.id !== over.id) {
                const oldIndex = blocks.findIndex((b) => b.id === active.id);
                const newIndex = blocks.findIndex((b) => b.id === over.id);
                onBlocksChange(arrayMove(blocks, oldIndex, newIndex));
            }
        },
        [blocks, onBlocksChange]
    );

    const handleDeleteBlock = useCallback(
        (id: string) => {
            onBlocksChange(blocks.filter((b) => b.id !== id));
        },
        [blocks, onBlocksChange]
    );

    const viewModeWidths: Record<ViewMode, string> = {
        desktop: "w-full",
        tablet: "w-[768px]",
        mobile: "w-[375px]",
    };

    return (
        <div className="flex flex-col h-full bg-neutral-50">
            {/* Toolbar */}
            <div className="flex items-center justify-between h-12 px-4 border-b border-neutral-200 bg-white shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Preview</span>
                    <span className="text-xs text-neutral-400">·</span>
                    <span className="text-xs text-neutral-400">{blocks.length} komponen</span>
                </div>
                {/* Device toggles */}
                <div className="flex items-center bg-neutral-100 rounded-lg p-0.5 gap-0.5">
                    {([
                        { mode: "desktop" as const, icon: Monitor, label: "Desktop" },
                        { mode: "tablet" as const, icon: Tablet, label: "Tablet" },
                        { mode: "mobile" as const, icon: Smartphone, label: "Mobile" },
                    ]).map(({ mode, icon: Icon }) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={cn(
                                "flex items-center justify-center size-7 rounded-md transition-all",
                                viewMode === mode
                                    ? "bg-white text-neutral-900 shadow-sm"
                                    : "text-neutral-400 hover:text-neutral-700"
                            )}
                        >
                            <Icon className="size-3.5" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Canvas area */}
            <div className="flex-1 overflow-auto p-4">
                <div
                    className={cn(
                        "mx-auto bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden transition-all duration-300 min-h-full",
                        viewModeWidths[viewMode]
                    )}
                >
                    {blocks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-96 text-neutral-400">
                            <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <p className="text-sm font-medium">Belum ada komponen</p>
                            <p className="text-xs mt-1">Kirim prompt di chat untuk generate website</p>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={blocks.map((b) => b.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="pl-10">
                                    {blocks.map((block) => (
                                        <SortableBlock
                                            key={block.id}
                                            block={block}
                                            onDelete={handleDeleteBlock}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </div>
            </div>
        </div>
    );
}
