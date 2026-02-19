"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import { ChatPanel } from "./chat-panel";
import { PreviewPanel } from "./preview-panel";
import { ChatSidebar } from "./chat-sidebar";
import { cn } from "@/lib/utils";
import { appConfig } from "@/config/app.config";
import type { ChatMessage, ChatSession, SandboxInfo, AISettings } from "./types";

const DEFAULT_SETTINGS: AISettings = {
  temperature: appConfig.ai.defaultTemperature,
  maxTokens: appConfig.ai.maxTokens,
  systemPrompt: "",
};

export function AIChatWorkspace() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sandboxInfo, setSandboxInfo] = useState<SandboxInfo | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [aiSettings, setAiSettings] = useState<AISettings>(DEFAULT_SETTINGS);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Create a new session
  const handleNewSession = useCallback(() => {
    const session: ChatSession = {
      id: nanoid(),
      title: "New Chat",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };
    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(session.id);
    setMessages([]);
    setSandboxInfo(null);
  }, []);

  // Initialize with a session
  useEffect(() => {
    if (sessions.length === 0) {
      handleNewSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Send message handler
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isGenerating) return;

      const userMessage: ChatMessage = {
        id: nanoid(),
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsGenerating(true);

      // Update session title from first message
      if (messages.length === 0 && activeSessionId) {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSessionId
              ? {
                  ...s,
                  title:
                    content.trim().slice(0, 50) +
                    (content.trim().length > 50 ? "..." : ""),
                  updatedAt: Date.now(),
                }
              : s
          )
        );
      }

      // Create assistant placeholder
      const assistantMessage: ChatMessage = {
        id: nanoid(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        isStreaming: true,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      try {
        abortControllerRef.current = new AbortController();

        const response = await fetch("/api/generate-ai-code-stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content.trim(),
            model: appConfig.ai.defaultModel,
            sandboxId: sandboxInfo?.sandboxId,
            temperature: aiSettings.temperature,
            maxTokens: aiSettings.maxTokens,
            systemPrompt: aiSettings.systemPrompt,
            conversationHistory: messages.slice(-appConfig.ui.maxRecentMessagesContext).map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            fullContent += chunk;

            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessage.id
                  ? { ...m, content: fullContent }
                  : m
              )
            );
          }
        }

        // Mark streaming as done
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, isStreaming: false }
              : m
          )
        );
      } catch (error) {
        if ((error as Error).name === "AbortError") return;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? {
                  ...m,
                  content:
                    "Maaf, terjadi kesalahan saat memproses permintaan. Silakan coba lagi.",
                  isStreaming: false,
                  isError: true,
                }
              : m
          )
        );
      } finally {
        setIsGenerating(false);
        abortControllerRef.current = null;
      }
    },
    [isGenerating, messages, activeSessionId, sandboxInfo, aiSettings]
  );

  // Stop generation
  const handleStopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsGenerating(false);
  }, []);

  return (
    <div className="flex h-dvh w-dvw overflow-hidden bg-white">
      {/* Sidebar */}
      <ChatSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id: string) => {
          setActiveSessionId(id);
          const session = sessions.find((s) => s.id === id);
          if (session) setMessages(session.messages);
        }}
        onNewSession={handleNewSession}
        aiSettings={aiSettings}
        onAiSettingsChange={setAiSettings}
      />

      {/* Main content */}
      <div className="flex flex-1 min-w-0">
        {/* Chat panel */}
        <div
          className={cn(
            "flex flex-col border-r border-neutral-200 transition-all duration-300",
            sandboxInfo ? "w-[420px] min-w-[380px]" : "flex-1 max-w-3xl mx-auto"
          )}
        >
          <ChatPanel
            messages={messages}
            isGenerating={isGenerating}
            onSendMessage={handleSendMessage}
            onStopGeneration={handleStopGeneration}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>

        {/* Preview panel */}
        {sandboxInfo && (
          <div className="flex-1 min-w-0">
            <PreviewPanel
              sandboxInfo={sandboxInfo}
              onClose={() => setSandboxInfo(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
