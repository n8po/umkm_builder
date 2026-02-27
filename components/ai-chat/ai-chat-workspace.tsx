"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { ChatPanel } from "./chat-panel";
import { ChatSidebar } from "./chat-sidebar";
import { FileDirectoryPanel } from "./file-directory-panel";
import { CodeViewerPanel } from "./code-viewer-panel";
import { ComponentPalette } from "./component-palette";
import { GenerationProgress } from "./generation-progress";
import { cn } from "@/lib/utils";
import { appConfig } from "@/config/app.config";
import { authService } from "@/lib/services";
import { useSandbox } from "@/hooks/use-sandbox";

import {
  LogIn,
  UserPlus,
  X,
  Sparkles,
  Files,
  Layers,
  Monitor,
  Tablet,
  Smartphone,
  Lock,
  LockOpen,
  RefreshCw,
  RotateCcw,
  Loader2,
} from "lucide-react";

import type { ChatMessage, ChatSession, AISettings, GeneratedFile } from "./types";

// ─────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────
type Device = "desktop" | "tablet" | "mobile";
type MiddleTab = "files" | "palette";

const DEFAULT_SETTINGS: AISettings = {
  temperature: appConfig.ai.defaultTemperature,
  maxTokens: appConfig.ai.maxTokens,
  systemPrompt: "",
};

const DEVICE_WIDTHS: Record<Device, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

// ─────────────────────────────────────────────────
// Custom drag-handle resize hook
// ─────────────────────────────────────────────────
function useDragResize(initialPx: number, minPx: number, maxPx: number) {
  const [width, setWidth] = useState(initialPx);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(initialPx);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      dragging.current = true;
      startX.current = e.clientX;
      startW.current = width;

      const onMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        const delta = ev.clientX - startX.current;
        setWidth(Math.min(maxPx, Math.max(minPx, startW.current + delta)));
      };
      const onUp = () => {
        dragging.current = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      e.preventDefault();
    },
    [width, minPx, maxPx]
  );

  return { width, onMouseDown };
}

// ─────────────────────────────────────────────────
// DragHandle component
// ─────────────────────────────────────────────────
function DragHandle({ onMouseDown }: { onMouseDown: (e: React.MouseEvent) => void }) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="w-1 shrink-0 bg-neutral-800 hover:bg-violet-500/50 cursor-col-resize transition-colors group"
    >
      <div className="h-full flex items-center justify-center">
        <div className="w-0.5 h-8 rounded-full bg-neutral-700 group-hover:bg-violet-400 transition-colors" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
// Main Workspace
// ─────────────────────────────────────────────────
export function AIChatWorkspace() {
  const router = useRouter();

  // ── Chat state ─────────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [aiSettings, setAiSettings] = useState<AISettings>(DEFAULT_SETTINGS);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ── Auth gate ───────────────────────────────────
  const [authGate, setAuthGate] = useState<null | "idle" | "checking" | "open">(null);

  // ── Files & viewer ──────────────────────────────
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // ── Middle panel tab ────────────────────────────
  const [middleTab, setMiddleTab] = useState<MiddleTab>("files");

  // ── Preview state ───────────────────────────────
  const [device, setDevice] = useState<Device>("desktop");
  const [isLocked, setIsLocked] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);

  // ── Panel widths (resizable) ────────────────────
  const chatPanel = useDragResize(360, 240, 600);
  const middlePanel = useDragResize(220, 160, 400);

  // ── DnD ────────────────────────────────────────
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // ── Sandbox ─────────────────────────────────────
  const sandbox = useSandbox();

  // ── Panels visible when content or generating ──
  const hasContent = generatedFiles.length > 0 || sandbox.sandboxUrl !== null || isGenerating;

  // ── Currently viewed file (from code viewer) ──
  const viewedFile = generatedFiles.find((f) => f.path === selectedFile) ?? null;

  // ─────────────────────────────────────────────────
  // Sync session state
  // ─────────────────────────────────────────────────
  useEffect(() => {
    if (activeSession) {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSession
            ? {
                ...s,
                messages,
                updatedAt: Date.now(),
                ...(sandbox.sandboxId ? { sandboxId: sandbox.sandboxId } : {}),
                ...(sandbox.sandboxUrl ? { sandboxUrl: sandbox.sandboxUrl } : {}),
                generatedFiles: generatedFiles.length > 0 ? generatedFiles : s.generatedFiles,
              }
            : s
        )
      );
    }
  }, [messages, sandbox.sandboxId, sandbox.sandboxUrl, generatedFiles, activeSession]);


  // ─────────────────────────────────────────────────
  // Auth check
  // ─────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    setAuthGate("checking");
    authService.getSession().then((session) => {
      if (!mounted) return;
      setAuthGate(session?.authenticated ? "idle" : "open");
    });
    return () => {
      mounted = false;
    };
  }, []);

  // ─────────────────────────────────────────────────
  // Send message
  // ─────────────────────────────────────────────────
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isGenerating) return;

      abortControllerRef.current = new AbortController();
      setIsGenerating(true);

      const userMsg: ChatMessage = {
        id: nanoid(),
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);

      const assistantId = nanoid();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", timestamp: Date.now(), isStreaming: true },
      ]);

      const isEdit = generatedFiles.length > 0;
      const newFiles: GeneratedFile[] = [];

      try {
        const res = await sandbox.generateCode(
          content.trim(),
          (type, message) => {
            if (type === "error") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: `Terjadi kesalahan: ${message}`, isStreaming: false, isError: true }
                    : m
                )
              );
            }
          },
          (file) => {
            newFiles.push(file);
            setGeneratedFiles((prev) => {
              const map = new Map(prev.map((f) => [f.path, f]));
              map.set(file.path, file);
              return Array.from(map.values());
            });
            if (newFiles.length === 1) {
              setSelectedFile(file.path);
              setMiddleTab("files");
            }
          },
          isEdit
        );

        const aiOutputText = res?.text || "";

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: newFiles.length > 0 ? (aiOutputText || "__BUILD_RESULT__") : "Selesai.",
                  isStreaming: false,
                  metadata: {
                    generatedFiles: newFiles,
                    fileCount: newFiles.length,
                  },
                }
              : m
          )
        );

        setIframeKey((k) => k + 1);
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "Terjadi kesalahan.", isStreaming: false, isError: true }
              : m
          )
        );
      } finally {
        setIsGenerating(false);
        abortControllerRef.current = null;
      }
    },
    [isGenerating, generatedFiles.length, sandbox]
  );

  const handleStop = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsGenerating(false);
  }, []);

  // ── Palette insert ──────────────────────────────
  const handleInsertComponent = useCallback((prompt: string) => {
    setPendingPrompt(prompt);
  }, []);

  useEffect(() => {
    if (pendingPrompt && !isGenerating) {
      const p = pendingPrompt;
      setPendingPrompt(null);
      handleSendMessage(p);
    }
  }, [pendingPrompt, isGenerating, handleSendMessage]);

  // ── DnD handlers ──────────────────────────────
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setDraggingId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setDraggingId(null);
      const prompt = event.active.data.current?.prompt as string | undefined;
      if (prompt) handleInsertComponent(prompt);
    },
    [handleInsertComponent]
  );

  // ─────────────────────────────────────────────────
  // Auth gate dialog
  // ─────────────────────────────────────────────────
  if (authGate === "open") {
    return (
      <div className="flex h-dvh w-dvw items-center justify-center bg-neutral-950">
        <div className="relative w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
          <button
            onClick={() => setAuthGate("idle")}
            className="absolute right-4 top-4 p-1.5 rounded-lg text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <X className="size-4" />
          </button>
          <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 mb-5">
            <Sparkles className="size-6 text-white" />
          </div>
          <h2 className="text-lg font-bold text-white mb-1">Masuk untuk melanjutkan</h2>
          <p className="text-sm text-neutral-400 mb-6">
            Buat akun gratis atau masuk untuk mulai membangun website dengan AI.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push("/register")}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              <UserPlus className="size-4" />
              Buat akun gratis
            </button>
            <button
              onClick={() => router.push("/login")}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-neutral-700 text-neutral-200 hover:bg-neutral-800 transition-colors"
            >
              <LogIn className="size-4" />
              Masuk
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (authGate === "checking") {
    return (
      <div className="flex h-dvh w-dvw items-center justify-center bg-neutral-950">
        <Loader2 className="size-6 text-violet-400 animate-spin" />
      </div>
    );
  }

  // ─────────────────────────────────────────────────
  // Main layout
  // ─────────────────────────────────────────────────
  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-dvh w-dvw overflow-hidden bg-neutral-950">
        {/* Sidebar */}
        {showSidebar && (
          <div className="shrink-0 border-r border-neutral-800">
            <ChatSidebar
              open={showSidebar}
              onToggle={() => setShowSidebar((v) => !v)}
              sessions={sessions}
              activeSessionId={activeSession}
              onSelectSession={(id) => {
                setActiveSession(id);
                const session = sessions.find((s) => s.id === id);
                if (session) {
                  setMessages(session.messages || []);
                  sandbox.setSandbox(session.sandboxId || null, session.sandboxUrl || null);
                  // Restore generated files from session state
                  setGeneratedFiles(session.generatedFiles || []);
                  if (session.generatedFiles?.length) {
                    setSelectedFile(session.generatedFiles[0].path);
                  } else {
                    setSelectedFile(null);
                  }
                }
              }}
              onNewSession={() => {
                const id = nanoid();
                setSessions((prev) => [
                  ...prev,
                  {
                    id,
                    title: "Sesi Baru",
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    messages: [],
                  } as ChatSession,
                ]);
                setActiveSession(id);
                setMessages([]);
                setGeneratedFiles([]);
                setSelectedFile(null);
                sandbox.reset();
              }}
              aiSettings={aiSettings}
              onAiSettingsChange={setAiSettings}
            />
          </div>
        )}

        {/* ── Layout: full-width chat BEFORE content, 3-panel AFTER ── */}
        <div className="flex flex-1 min-w-0 overflow-hidden">

          {!hasContent ? (
            /* Full-width chat — before first generation */
            <div className="flex flex-col flex-1 h-full">
              <ChatPanel
                messages={messages}
                isGenerating={isGenerating}
                onSendMessage={handleSendMessage}
                onStopGeneration={handleStop}
                sidebarOpen={showSidebar}
                onToggleSidebar={() => setShowSidebar((v) => !v)}
              />
            </div>
          ) : (
            /* 3-panel split layout — after generation starts */
            <>
              {/* Panel 1: Chat (fixed resizable width) */}
              <div
                style={{ width: chatPanel.width }}
                className="flex flex-col shrink-0 h-full"
              >
                <ChatPanel
                  messages={messages}
                  isGenerating={isGenerating}
                  onSendMessage={handleSendMessage}
                  onStopGeneration={handleStop}
                  sidebarOpen={showSidebar}
                  onToggleSidebar={() => setShowSidebar((v) => !v)}
                />
              </div>

              <DragHandle onMouseDown={chatPanel.onMouseDown} />

              {/* Panel 2: Files / Palette tab switcher */}
              <div
                style={{ width: middlePanel.width }}
                className="flex flex-col shrink-0 h-full border-l border-neutral-800"
              >
                {/* Tab header */}
                <div className="flex items-center border-b border-neutral-800 shrink-0 bg-neutral-950">
                  <button
                    onClick={() => setMiddleTab("files")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium border-b-2 transition-colors",
                      middleTab === "files"
                        ? "border-violet-500 text-violet-300"
                        : "border-transparent text-neutral-500 hover:text-neutral-300"
                    )}
                  >
                    <Files className="size-3" />
                    Files{generatedFiles.length > 0 ? ` (${generatedFiles.length})` : ""}
                  </button>
                  <button
                    onClick={() => setMiddleTab("palette")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium border-b-2 transition-colors",
                      middleTab === "palette"
                        ? "border-violet-500 text-violet-300"
                        : "border-transparent text-neutral-500 hover:text-neutral-300"
                    )}
                  >
                    <Layers className="size-3" />
                    Komponen
                  </button>
                </div>

                {/* Tab content */}
                <div className="flex-1 min-h-0 overflow-hidden">
                  {middleTab === "files" ? (
                    <FileDirectoryPanel
                      files={generatedFiles}
                      selectedFile={selectedFile}
                      onFileSelect={(file) => setSelectedFile(file.path)}
                    />
                  ) : (
                    <ComponentPalette onInsertPrompt={handleInsertComponent} />
                  )}
                </div>
              </div>

              <DragHandle onMouseDown={middlePanel.onMouseDown} />

              {/* Panel 3: Preview / Code viewer */}
              <div className="flex flex-col flex-1 min-w-0 h-full">
                {/* Toolbar */}
                <div className="flex items-center gap-2 px-3 py-1.5 border-b border-neutral-800 shrink-0 bg-neutral-950">
                  {selectedFile && (
                    <span className="text-[10px] text-neutral-500 font-mono truncate max-w-[140px]">
                      {selectedFile.split("/").pop()}
                    </span>
                  )}
                  <div className="flex items-center gap-1 ml-auto">
                    {/* Device toggles */}
                    {(
                      [
                        { d: "desktop" as Device, icon: Monitor },
                        { d: "tablet" as Device, icon: Tablet },
                        { d: "mobile" as Device, icon: Smartphone },
                      ] as const
                    ).map(({ d, icon: Icon }) => (
                      <button
                        key={d}
                        onClick={() => setDevice(d)}
                        className={cn(
                          "p-1.5 rounded-md transition-colors",
                          device === d
                            ? "bg-neutral-700 text-white"
                            : "text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800"
                        )}
                      >
                        <Icon className="size-3.5" />
                      </button>
                    ))}

                    <div className="w-px h-4 bg-neutral-700 mx-1" />

                    {/* Lock */}
                    <button
                      onClick={() => setIsLocked((v) => !v)}
                      className={cn(
                        "p-1.5 rounded-md transition-colors",
                        isLocked
                          ? "bg-amber-500/20 text-amber-400"
                          : "text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800"
                      )}
                      title={isLocked ? "Buka kunci" : "Kunci preview"}
                    >
                      {isLocked ? <Lock className="size-3.5" /> : <LockOpen className="size-3.5" />}
                    </button>

                    {/* Refresh */}
                    <button
                      onClick={() => setIframeKey((k) => k + 1)}
                      className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
                      title="Refresh preview"
                    >
                      <RefreshCw className="size-3.5" />
                    </button>

                    {/* Reset */}
                    <button
                      onClick={() => {
                        sandbox.reset();
                        setGeneratedFiles([]);
                        setSelectedFile(null);
                        setMessages([]);
                      }}
                      className="p-1.5 rounded-md text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                      title="Reset sandbox"
                    >
                      <RotateCcw className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 min-h-0 relative overflow-hidden">
                  <GenerationProgress isGenerating={isGenerating || sandbox.isCreating} />

                  {selectedFile && viewedFile?.content ? (
                    <CodeViewerPanel
                      file={viewedFile}
                      onClose={() => setSelectedFile(null)}
                      className="h-full"
                    />
                  ) : sandbox.sandboxUrl ? (
                    <div className="h-full w-full flex items-center justify-center bg-neutral-800">
                      <div
                        className="h-full overflow-hidden transition-all duration-300 bg-white"
                        style={{ width: DEVICE_WIDTHS[device] }}
                      >
                        <iframe
                          key={iframeKey}
                          src={sandbox.sandboxUrl}
                          className="w-full h-full border-0"
                          title="Sandbox Preview"
                          style={{ pointerEvents: isLocked ? "none" : "auto" }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-600">
                      <Sparkles className="size-10 mb-4 opacity-20" />
                      <p className="text-sm">Preview akan muncul setelah kode di-generate</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* DnD drag overlay */}
      <DragOverlay>
        {draggingId && (
          <div className="px-3 py-2 rounded-lg bg-violet-600 text-white text-xs font-semibold shadow-xl opacity-90">
            + {draggingId}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
