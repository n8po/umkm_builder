"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, Copy, Check, Sparkles, FileCode2, FileType2, FileJson, FileText } from "lucide-react";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { ChatMessage, GeneratedFile } from "./types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

// ── Detect if text is a raw builder JSON response ────────────────
function isBuilderJson(text: string): boolean {
  const trimmed = text.trim();
  // Pure JSON with "components" key
  if (trimmed.startsWith("{") && trimmed.includes('"components"')) return true;
  // JSON embedded in text
  if (/"components"\s*:\s*\[/.test(trimmed)) return true;
  return false;
}

// ── Extract component count from builder JSON ────────────────────
function extractComponentCount(text: string): number {
  try {
    const match = text.match(/"components"\s*:\s*\[/);
    if (!match) return 0;
    const start = text.indexOf("[", match.index!);
    let depth = 0;
    let count = 0;
    for (let i = start; i < text.length; i++) {
      if (text[i] === "{") {
        depth++;
        if (depth === 1) count++;
      } else if (text[i] === "}") {
        depth--;
      } else if (text[i] === "]" && depth === 0) break;
    }
    return count;
  } catch {
    return 0;
  }
}

// ── Extract component type names ────────────────────────────────
function extractComponentTypes(text: string): string[] {
  const matches = text.matchAll(/"type"\s*:\s*"([^"]+)"/g);
  return [...matches].map((m) => m[1]).slice(0, 8);
}

// ── File icon based on extension ────────────────────────────────
function FileIcon({ path }: { path: string }) {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  if (["tsx", "ts", "jsx", "js"].includes(ext)) return <FileCode2 className="size-3 shrink-0 text-blue-500" />;
  if (["css", "scss"].includes(ext)) return <FileType2 className="size-3 shrink-0 text-pink-400" />;
  if (["json"].includes(ext)) return <FileJson className="size-3 shrink-0 text-orange-400" />;
  return <FileText className="size-3 shrink-0 text-neutral-400" />;
}

// ── Build Result Card: shown instead of raw JSON ─────────────────
function BuildResultCard({ text, files }: { text: string; files?: GeneratedFile[] }) {
  const count = extractComponentCount(text);
  const types = extractComponentTypes(text);

  // Use virtual files list or derived from types
  const fileList: { path: string }[] = files?.length
    ? files
    : [
        { path: "App.tsx" },
        ...types.map((t) => {
          const name = t.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
          return { path: `components/${name}.tsx` };
        }),
        { path: "styles.css" },
      ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 rounded-xl border border-neutral-100 bg-neutral-50 overflow-hidden text-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-violet-50 to-blue-50 border-b border-neutral-100">
        <div className="flex size-5 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-blue-500">
          <Sparkles className="size-3 text-white" />
        </div>
        <span className="text-xs font-semibold text-neutral-700">
          Website dibuat — {count} komponen
        </span>
      </div>

      {/* File list */}
      <div className="px-3 py-2 space-y-1 max-h-40 overflow-y-auto">
        {fileList.map((f) => (
          <div key={f.path} className="flex items-center gap-2 py-0.5">
            <FileIcon path={f.path} />
            <span className="text-[11px] text-neutral-600 font-mono truncate">{f.path}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Main ChatMessageBubble ────────────────────────────────────────
export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message.content]);

  // Detect if AI response is a raw builder JSON → show card instead
  const hasBuilderJson = !isUser && !message.isStreaming && isBuilderJson(message.content);

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
            <div className="prose prose-sm prose-invert max-w-none break-words leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:my-2 [&_li]:my-0.5 [&_pre]:my-2 [&_pre]:p-3 [&_pre]:bg-neutral-800 [&_pre]:text-neutral-100 [&_code]:bg-neutral-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded-sm [&_code]:text-xs">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
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
      <div className="flex gap-3 max-w-[92%] group">
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
            {/* Streaming indicator */}
            {message.isStreaming && !message.content ? (
              <div className="flex items-center gap-2 py-1">
                <div className="flex gap-1">
                  <span className="size-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0ms]" />
                  <span className="size-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]" />
                  <span className="size-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:300ms]" />
                </div>
                <span className="text-xs text-neutral-400">Sedang memproses...</span>
              </div>
            ) : hasBuilderJson ? (
              // ── Show build result card instead of raw JSON ──
              <BuildResultCard
                text={message.content}
                files={message.metadata?.generatedFiles}
              />
            ) : message.content ? (
              <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none break-words leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:my-2 [&_li]:my-0.5 [&_pre]:my-2 [&_pre]:p-3 [&_pre]:bg-neutral-800 [&_pre]:text-neutral-100 [&_code]:bg-neutral-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded-sm [&_code]:text-xs">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : null}
          </div>

          {/* Copy button — only for non-JSON messages */}
          {message.content && !message.isStreaming && !hasBuilderJson && (
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
