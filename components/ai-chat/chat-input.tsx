"use client";

import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import {
  ArrowUp,
  Square,
  Plus,
  AudioLines,
  Hammer,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMode } from "./types";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onStopGeneration: () => void;
  isGenerating: boolean;
  placeholder?: string;
  chatMode: ChatMode;
  onToggleMode: () => void;
}

export function ChatInput({
  onSendMessage,
  onStopGeneration,
  isGenerating,
  placeholder = "Type '/' for commands",
  chatMode,
  onToggleMode,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    if (isGenerating) {
      onStopGeneration();
      return;
    }
    if (!value.trim()) return;
    onSendMessage(value);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isGenerating, onSendMessage, onStopGeneration]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Mode toggle pill */}
      <div className="flex items-center gap-1.5 px-1">
        <button
          onClick={onToggleMode}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
            chatMode === "build"
              ? "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-500/20 hover:bg-violet-100 dark:hover:bg-violet-500/20"
              : "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20"
          )}
        >
          {chatMode === "build" ? (
            <>
              <Hammer className="size-3" />
              Build Website
            </>
          ) : (
            <>
              <MessageCircle className="size-3" />
              Tanya AI
            </>
          )}
        </button>
        <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
          {chatMode === "build"
            ? "Prompt akan membuat/edit website"
            : "Prompt akan dijawab sebagai chat biasa"}
        </span>
      </div>

      {/* Input bar */}
      <div className="flex items-end gap-2 rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-white/5 px-3 py-2 transition-all focus-within:border-neutral-300 dark:focus-within:border-white/20 focus-within:bg-white dark:focus-within:bg-white/10 focus-within:shadow-sm">
        {/* Plus button */}
        <button className="flex items-center justify-center size-8 shrink-0 rounded-full text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors mb-0.5">
          <Plus className="size-4" />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={chatMode === "build" ? "Deskripsikan website yang ingin dibuat..." : "Tanyakan sesuatu tentang kodingan..."}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-white/30 outline-none min-h-[32px] max-h-[200px] py-1.5"
        />

        {/* Right buttons */}
        <div className="flex items-center gap-1 shrink-0 mb-0.5">
          {/* Voice / Mic button */}
          <button className="flex items-center justify-center size-8 rounded-full text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors">
            <AudioLines className="size-4" />
          </button>

          {/* Send / Stop */}
          {(isGenerating || value.trim()) && (
            <button
              onClick={handleSubmit}
              className={cn(
                "flex items-center justify-center size-8 rounded-full transition-all duration-200",
                isGenerating
                  ? "bg-red-100 dark:bg-red-500/20 text-red-500 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30"
                  : "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200"
              )}
            >
              {isGenerating ? (
                <Square className="size-3 fill-current" />
              ) : (
                <ArrowUp className="size-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
