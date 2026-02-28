"use client";

import { useState, useCallback } from "react";
import { Copy, Check, X, FileCode2, FileType2, FileJson, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GeneratedFile } from "./types";

interface CodeViewerPanelProps {
  file: GeneratedFile | null;
  onClose?: () => void;
  className?: string;
}

function getFileIcon(path: string) {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  if (["tsx", "ts", "jsx", "js"].includes(ext)) return FileCode2;
  if (["css", "scss"].includes(ext)) return FileType2;
  if (["json"].includes(ext)) return FileJson;
  return FileText;
}

function getIconColor(path: string) {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  if (["tsx", "jsx"].includes(ext)) return "text-blue-500";
  if (["ts", "js"].includes(ext)) return "text-yellow-500";
  if (["css", "scss"].includes(ext)) return "text-pink-400";
  if (["json"].includes(ext)) return "text-orange-400";
  return "text-neutral-400";
}

/**
 * Lightweight syntax highlighter — tokenizer approach.
 * Scans code once to collect tokens, then builds HTML in a single pass.
 * This prevents regex replacements from corrupting each other's HTML.
 */
function highlightCode(code: string, lang: string): string {
  if (!code) return "";

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Collect tokens: { start, end, cls }
  type Token = { start: number; end: number; cls: string };
  const tokens: Token[] = [];

  const addMatches = (regex: RegExp, cls: string, group = 0) => {
    let m: RegExpExecArray | null;
    while ((m = regex.exec(code)) !== null) {
      const s = group > 0 && m[group] !== undefined
        ? m.index + m[0].indexOf(m[group])
        : m.index;
      const len = group > 0 && m[group] !== undefined ? m[group].length : m[0].length;
      tokens.push({ start: s, end: s + len, cls });
    }
  };

  const JS_KEYWORDS = new Set([
    "import", "export", "default", "from", "const", "let", "var", "function",
    "return", "if", "else", "for", "while", "class", "extends", "interface",
    "type", "async", "await", "new", "typeof", "null", "undefined", "true", "false",
  ]);

  if (lang === "json") {
    // JSON: keys, string values, numbers, booleans/null
    addMatches(/"([^"]+)"(?=\s*:)/g, "text-blue-300");
    addMatches(/:\s*"([^"]*)"/g, "text-amber-300");
    addMatches(/:\s*(\d+\.?\d*)/g, "text-emerald-300", 1);
    addMatches(/:\s*(true|false|null)\b/g, "text-purple-300", 1);
  } else {
    // JS/TS/JSX/TSX

    // 1. Comments (highest priority — should not be re-tokenised)
    addMatches(/\/\/[^\n]*/g, "text-neutral-500 italic");
    addMatches(/\/\*[\s\S]*?\*\//g, "text-neutral-500 italic");

    // 2. Strings (template, double, single)
    addMatches(/`[^`]*`/g, "text-amber-300");
    addMatches(/"[^"]*"/g, "text-amber-300");
    addMatches(/'[^']*'/g, "text-amber-300");

    // 3. Keywords (word-boundary matching)
    addMatches(new RegExp(`\\b(${[...JS_KEYWORDS].join("|")})\\b`, "g"), "text-purple-300");

    // 4. Numbers
    addMatches(/\b\d+\.?\d*\b/g, "text-emerald-300");

    // 5. JSX/HTML tags
    addMatches(/<\/?([A-Za-z][A-Za-z0-9.]*)/g, "text-blue-300", 1);

    // 6. JSX attributes (word=)
    addMatches(/\b([a-zA-Z_][\w-]*)(?==)/g, "text-sky-300", 1);
  }

  // Sort by start pos; remove overlapping tokens (earlier/longer wins)
  tokens.sort((a, b) => a.start - b.start || b.end - a.end);
  const filtered: Token[] = [];
  let cursor = 0;
  for (const t of tokens) {
    if (t.start >= cursor) {
      filtered.push(t);
      cursor = t.end;
    }
  }

  // Build HTML in one pass
  const parts: string[] = [];
  let pos = 0;
  for (const t of filtered) {
    if (t.start > pos) parts.push(esc(code.slice(pos, t.start)));
    parts.push(`<span class="${t.cls}">${esc(code.slice(t.start, t.end))}</span>`);
    pos = t.end;
  }
  if (pos < code.length) parts.push(esc(code.slice(pos)));

  return parts.join("");
}

export function CodeViewerPanel({ file, onClose, className }: CodeViewerPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!file) return;
    navigator.clipboard.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [file]);

  if (!file) {
    return (
      <div className={cn("flex flex-col h-full items-center justify-center text-neutral-400", className)}>
        <FileCode2 className="size-8 mb-3 opacity-30" />
        <p className="text-xs text-center px-4">Klik file di direktori untuk melihat kodenya</p>
      </div>
    );
  }

  const Icon = getFileIcon(file.path);
  const iconColor = getIconColor(file.path);
  const filename = file.path.split("/").pop() ?? file.path;
  const highlighted = highlightCode(file.content, file.language);
  const lineCount = (file.content.match(/\n/g) || []).length + 1;

  return (
    <div className={cn("flex flex-col h-full bg-neutral-950 text-sm", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-neutral-800 shrink-0">
        <Icon className={cn("size-3.5 shrink-0", iconColor)} />
        <span className="text-xs text-neutral-200 font-mono truncate flex-1">{file.path}</span>
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors text-[10px]"
          >
            {copied ? (
              <><Check className="size-3 text-emerald-400" /><span className="text-emerald-400">Tersalin</span></>
            ) : (
              <><Copy className="size-3" /><span>Salin</span></>
            )}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      </div>

      {/* Code body with line numbers */}
      <div className="flex-1 overflow-auto">
        <div className="flex min-h-full">
          {/* Line numbers */}
          <div className="select-none shrink-0 px-3 py-4 text-right text-neutral-600 text-[11px] font-mono leading-5 border-r border-neutral-800">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          {/* Code */}
          <pre
            className="flex-1 px-4 py-4 text-[11px] font-mono leading-5 text-neutral-200 overflow-x-auto whitespace-pre"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 px-3 py-1.5 border-t border-neutral-800 shrink-0">
        <span className="text-[10px] text-neutral-500">{lineCount} baris</span>
        <span className="text-[10px] text-neutral-500">{file.language.toUpperCase()}</span>
        <span className="text-[10px] text-neutral-500 ml-auto">{filename}</span>
      </div>
    </div>
  );
}
