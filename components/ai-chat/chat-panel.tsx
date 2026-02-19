"use client";

import { useRef, useEffect, useState } from "react";
import { ChatMessageBubble } from "./chat-message";
import { ChatInput } from "./chat-input";
import { WelcomeScreen } from "./welcome-screen";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import type { ChatMessage } from "./types";

interface ChatPanelProps {
  messages: ChatMessage[];
  isGenerating: boolean;
  onSendMessage: (content: string) => void;
  onStopGeneration: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function ChatPanel({
  messages,
  isGenerating,
  onSendMessage,
  onStopGeneration,
  sidebarOpen,
  onToggleSidebar,
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      const viewport = scrollRef.current.querySelector(
        "[data-slot='scroll-area-viewport']"
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, autoScroll]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top bar */}
      <div className="flex items-center h-14 px-4 border-b border-neutral-200 shrink-0">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleSidebar}
          className="text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="size-4" />
          ) : (
            <PanelLeftOpen className="size-4" />
          )}
        </Button>
      </div>

      {/* Messages area */}
      <div className="flex-1 min-h-0">
        {hasMessages ? (
          <ScrollArea ref={scrollRef} className="h-full">
            <div className="flex flex-col gap-1 py-6 px-4">
              {messages.map((message) => (
                <ChatMessageBubble key={message.id} message={message} />
              ))}

              {/* Generating indicator */}
              {isGenerating &&
                messages[messages.length - 1]?.role === "assistant" &&
                messages[messages.length - 1]?.content === "" && (
                  <div className="flex items-center gap-2 px-4 py-3">
                    <div className="flex gap-1">
                      <span className="size-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0ms]" />
                      <span className="size-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:150ms]" />
                      <span className="size-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                    <span className="text-xs text-neutral-500">
                      AI sedang berpikir...
                    </span>
                  </div>
                )}
            </div>
          </ScrollArea>
        ) : (
          <WelcomeScreen onSendMessage={onSendMessage} />
        )}
      </div>

      {/* Input area */}
      <div className="shrink-0 p-4">
        <ChatInput
          onSendMessage={onSendMessage}
          onStopGeneration={onStopGeneration}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}
