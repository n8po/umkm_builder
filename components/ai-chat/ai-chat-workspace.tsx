"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { ChatPanel } from "./chat-panel";
import { BuilderCanvas } from "./builder/BuilderCanvas";
import { ChatSidebar } from "./chat-sidebar";
import { cn } from "@/lib/utils";
import { appConfig } from "@/config/app.config";
import { authService, chatService } from "@/lib/services";
import { LogIn, UserPlus, X, Sparkles } from "lucide-react";
import type { ChatMessage, ChatSession, AISettings, BuilderBlock } from "./types";

const DEFAULT_SETTINGS: AISettings = {
  temperature: appConfig.ai.defaultTemperature,
  maxTokens: appConfig.ai.maxTokens,
  systemPrompt: "",
};

/**
 * Parse JSON dari response AI. Coba extract JSON dari teks jika bukan pure JSON.
 */
function parseBuilderJson(text: string): BuilderBlock[] | null {
  try {
    // Coba parse langsung
    const data = JSON.parse(text);
    if (data?.components && Array.isArray(data.components)) {
      return normalizeBlocks(data.components);
    }
    return null;
  } catch {
    // Coba extract JSON dari dalam teks (model kadang tambahkan penjelasan)
    const jsonMatch = text.match(/\{[\s\S]*"components"\s*:\s*\[[\s\S]*\][\s\S]*\}/);
    if (jsonMatch) {
      try {
        const data = JSON.parse(jsonMatch[0]);
        if (data?.components && Array.isArray(data.components)) {
          return normalizeBlocks(data.components);
        }
      } catch {
        return null;
      }
    }
    return null;
  }
}

/**
 * Normalisasi block: pastikan setiap block punya unique ID
 */
function normalizeBlocks(blocks: any[]): BuilderBlock[] {
  return blocks.map((b, i) => ({
    id: b.id && typeof b.id === "string" && b.id.length > 4 ? b.id : `${b.type || "block"}_${nanoid(6)}`,
    type: b.type || "about",
    props: b.props || {},
  }));
}

export function AIChatWorkspace() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [builderBlocks, setBuilderBlocks] = useState<BuilderBlock[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [aiSettings, setAiSettings] = useState<AISettings>(DEFAULT_SETTINGS);
  const [showAuthGate, setShowAuthGate] = useState(false);
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
    setBuilderBlocks([]);
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

        // Cek apakah user sudah login
        const sessionData = await authService.getSession();

        if (!sessionData?.authenticated) {
          // Tampilkan auth gate dialog
          setShowAuthGate(true);
          // Hapus assistant placeholder
          setMessages((prev) => prev.filter((m) => m.id !== assistantMessage.id));
          setIsGenerating(false);
          return;
        }

        // Panggil AI via repository → proxy → FastAPI → Ollama VPS
        const data = await chatService.generateResponse(
          {
            prompt: content.trim(),
            temperature: aiSettings.temperature,
            max_tokens: aiSettings.maxTokens,
          },
          abortControllerRef.current.signal,
        );

        const aiResponse = data.response || "";

        // Update assistant message
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: aiResponse, isStreaming: false }
              : m
          )
        );

        // Parse JSON → BuilderBlocks
        const blocks = parseBuilderJson(aiResponse);
        if (blocks && blocks.length > 0) {
          setBuilderBlocks(blocks);
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") return;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? {
                ...m,
                content: `Maaf, terjadi kesalahan: ${(error as Error).message || "Silakan coba lagi."}`,
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
    [isGenerating, messages, activeSessionId, aiSettings]
  );

  // Stop generation
  const handleStopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsGenerating(false);
  }, []);

  const hasBlocks = builderBlocks.length > 0;

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
            "flex flex-col transition-all duration-300",
            hasBlocks ? "w-[420px] min-w-[380px] border-r border-neutral-200" : "flex-1"
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

        {/* Builder canvas — replaces iframe PreviewPanel */}
        {hasBlocks && (
          <div className="flex-1 min-w-0">
            <BuilderCanvas
              blocks={builderBlocks}
              onBlocksChange={setBuilderBlocks}
            />
          </div>
        )}
      </div>

      {/* Auth Gate Dialog */}
      {showAuthGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => setShowAuthGate(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="p-8 text-center">
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900 mb-2">
                Daftar untuk Mulai Build
              </h2>
              <p className="text-sm text-neutral-500 mb-8">
                Daftar gratis dan dapatkan <strong className="text-neutral-900">5 credit AI</strong> untuk membuat website UMKM kamu. Credit direset setiap 24 jam!
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push("/auth/register")}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-neutral-900 text-white rounded-xl font-semibold text-sm hover:bg-neutral-800 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Daftar Gratis
                </button>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="flex items-center justify-center gap-2 w-full py-3 border border-neutral-200 text-neutral-700 rounded-xl font-semibold text-sm hover:bg-neutral-50 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sudah Punya Akun? Login
                </button>
              </div>
            </div>

            {/* Bottom accent */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          </div>
        </div>
      )}
    </div>
  );
}


