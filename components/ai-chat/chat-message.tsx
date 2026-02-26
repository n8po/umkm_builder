"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, Copy, Check, Sparkles } from "lucide-react";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { ChatMessage } from "./types";

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message.content]);

  // ═══ User message — right, dark bubble ═══
  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex justify-end py-1.5"
      >
        <div className="max-w-[80%]">
          <div className="rounded-2xl rounded-br-md px-4 py-3 bg-neutral-900 text-white text-sm leading-relaxed shadow-sm">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // ═══ Assistant message — left, no bubble ═══
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex py-1.5"
    >
      <div className="flex gap-3 max-w-[85%] group">
        {/* AI Avatar */}
        <div className="shrink-0 mt-1">
          <div
            className={cn(
              "flex size-7 items-center justify-center rounded-full",
              message.isError
                ? "bg-red-100"
                : "bg-gradient-to-br from-violet-500 to-blue-500"
            )}
          >
            {message.isError ? (
              <AlertCircle className="size-3.5 text-red-500" />
            ) : (
              <Sparkles className="size-3.5 text-white" />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div
            className={cn(
              "text-sm leading-relaxed",
              message.isError ? "text-red-600" : "text-neutral-700"
            )}
          >
            {message.content ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : message.isStreaming ? (
              <div className="flex items-center gap-2 py-1">
                <div className="flex gap-1">
                  <span className="size-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0ms]" />
                  <span className="size-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]" />
                  <span className="size-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:300ms]" />
                </div>
                <span className="text-xs text-neutral-400">Sedang memproses...</span>
              </div>
            ) : null}
          </div>

          {/* Copy button */}
          {message.content && !message.isStreaming && (
            <div className="mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="size-3 text-emerald-500" />
                    <span className="text-[10px] text-emerald-500">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span className="text-[10px]">Salin</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
