"use client";

import { useRef, useEffect, useState } from "react";
import { ChatMessageBubble } from "./chat-message";
import { ChatInput } from "./chat-input";
import { WelcomeScreen } from "./welcome-screen";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import type { ChatMessage, ChatMode } from "./types";

interface ChatPanelProps {
  messages: ChatMessage[];
  isGenerating: boolean;
  onSendMessage: (content: string) => void;
  onStopGeneration: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  chatMode: ChatMode;
  onToggleMode: () => void;
}

export function ChatPanel({
  messages,
  isGenerating,
  onSendMessage,
  onStopGeneration,
  sidebarOpen,
  onToggleSidebar,
  chatMode,
  onToggleMode,
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

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
    <div className="flex flex-col h-full bg-white dark:bg-neutral-950">
      {/* Top bar */}
      <div className="flex items-center justify-between h-12 px-4 shrink-0">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleSidebar}
          className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="size-4" />
          ) : (
            <PanelLeftOpen className="size-4" />
          )}
        </Button>

        {isGenerating && (
          <div className="flex items-center gap-2 px-3 py-1 bg-violet-50 dark:bg-violet-500/10 rounded-full border border-violet-100 dark:border-violet-500/20">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 dark:bg-violet-500 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-violet-500 dark:bg-violet-400" />
            </span>
            <span className="text-[11px] font-medium text-violet-600 dark:text-violet-400">Generating...</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {hasMessages ? (
          <ScrollArea ref={scrollRef} className="h-full">
            <div className="flex flex-col gap-1 py-6 px-4 max-w-2xl mx-auto">
              {messages.map((message) => (
                <ChatMessageBubble key={message.id} message={message} />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <WelcomeScreen onSendMessage={onSendMessage} />
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 pb-4 pt-2">
        <div className="max-w-2xl mx-auto">
          <ChatInput
            onSendMessage={onSendMessage}
            onStopGeneration={onStopGeneration}
            isGenerating={isGenerating}
            chatMode={chatMode}
            onToggleMode={onToggleMode}
          />
        </div>
      </div>
    </div>
  );
}
