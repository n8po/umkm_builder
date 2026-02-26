"use client";

import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import {
  ArrowUp,
  Square,
  Plus,
  AudioLines,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onStopGeneration: () => void;
  isGenerating: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSendMessage,
  onStopGeneration,
  isGenerating,
  placeholder = "Type '/' for commands",
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
    <div className="flex items-end gap-2 rounded-2xl border border-neutral-200 bg-neutral-50/50 px-3 py-2 transition-all focus-within:border-neutral-300 focus-within:bg-white focus-within:shadow-sm">
      {/* Plus button */}
      <button className="flex items-center justify-center size-8 shrink-0 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors mb-0.5">
        <Plus className="size-4" />
      </button>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder={placeholder}
        rows={1}
        className="flex-1 resize-none bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 outline-none min-h-[32px] max-h-[200px] py-1.5"
      />

      {/* Right buttons */}
      <div className="flex items-center gap-1 shrink-0 mb-0.5">
        {/* Voice / Mic button */}
        <button className="flex items-center justify-center size-8 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors">
          <AudioLines className="size-4" />
        </button>

        {/* Send / Stop */}
        {(isGenerating || value.trim()) && (
          <button
            onClick={handleSubmit}
            className={cn(
              "flex items-center justify-center size-8 rounded-full transition-all duration-200",
              isGenerating
                ? "bg-red-100 text-red-500 hover:bg-red-200"
                : "bg-neutral-900 text-white hover:bg-neutral-800"
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
  );
}
