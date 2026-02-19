"use client";

import { cn } from "@/lib/utils";
import { Bot, User, AlertCircle, Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
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

  if (isUser) {
    return (
      <div className="flex justify-end py-2">
        <div className="flex items-start gap-3 max-w-[85%]">
          <div
            className={cn(
              "rounded-2xl rounded-br-md px-4 py-2.5",
              "bg-neutral-900 text-white text-sm leading-relaxed",
              "shadow-sm"
            )}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-200 mt-0.5">
            <User className="size-3.5 text-neutral-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex py-2">
      <div className="flex items-start gap-3 max-w-[85%] group">
        <div
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full mt-0.5",
            message.isError
              ? "bg-red-100"
              : "bg-neutral-100"
          )}
        >
          {message.isError ? (
            <AlertCircle className="size-3.5 text-red-500" />
          ) : (
            <Bot className="size-3.5 text-neutral-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div
            className={cn(
              "rounded-2xl rounded-bl-md px-4 py-2.5 text-sm leading-relaxed",
              message.isError
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-neutral-50 text-neutral-800 border border-neutral-200"
            )}
          >
            {message.content ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : message.isStreaming ? (
              <div className="flex gap-1 py-1">
                <span className="size-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0ms]" />
                <span className="size-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:150ms]" />
                <span className="size-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:300ms]" />
              </div>
            ) : null}
          </div>

          {/* Copy button */}
          {message.content && !message.isStreaming && (
            <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleCopy}
                className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                {copied ? (
                  <Check className="size-3 text-green-600" />
                ) : (
                  <Copy className="size-3" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
