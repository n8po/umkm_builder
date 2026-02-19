"use client";

import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  Square,
  Paperclip,
  Globe,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  placeholder = "Deskripsikan website yang ingin kamu buat...",
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
    // Reset textarea height
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
    <div
      className={cn(
        "relative rounded-2xl border border-neutral-200 bg-white transition-colors",
        "focus-within:border-neutral-400 focus-within:bg-white",
        "shadow-sm"
      )}
    >
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder={placeholder}
        rows={1}
        className={cn(
          "w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm text-neutral-900",
          "placeholder:text-neutral-400 outline-none",
          "min-h-[44px] max-h-[200px]"
        )}
        disabled={false}
      />

      {/* Bottom toolbar */}
      <div className="flex items-center justify-between px-3 pb-3">
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg"
              >
                <Paperclip className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Lampirkan file</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg"
              >
                <ImageIcon className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Upload gambar</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg"
              >
                <Globe className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Import dari URL</TooltipContent>
          </Tooltip>
        </div>

        {/* Send / Stop button */}
        <Button
          onClick={handleSubmit}
          size="icon-xs"
          className={cn(
            "rounded-lg transition-all",
            isGenerating
              ? "bg-red-50 text-red-500 hover:bg-red-100"
              : value.trim()
                ? "bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm"
                : "bg-neutral-100 text-neutral-400"
          )}
          disabled={!isGenerating && !value.trim()}
        >
          {isGenerating ? (
            <Square className="size-3 fill-current" />
          ) : (
            <ArrowUp className="size-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
}
