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
 * Very lightweight syntax highlighter — no external deps.
 * Tokenizes code into <span> with color classes.
 */
function highlightCode(code: string, lang: string): string {
  if (!code) return "";

  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // For JSON
  if (lang === "json") {
    return escape(code)
      .replace(/"([^"]+)"(?=\s*:)/g, '<span class="text-blue-300">"$1"</span>')
      .replace(/:\s*"([^"]*)"/g, ': <span class="text-amber-300">"$1"</span>')
      .replace(/:\s*(\d+\.?\d*)/g, ': <span class="text-emerald-300">$1</span>')
      .replace(/:\s*(true|false|null)/g, ': <span class="text-purple-300">$1</span>');
  }

  // For JS/TS/JSX/TSX
  const keywords = [
    "import", "export", "default", "from", "const", "let", "var", "function",
    "return", "if", "else", "for", "while", "class", "extends", "interface",
    "type", "async", "await", "new", "typeof", "null", "undefined", "true", "false",
  ];

  let result = escape(code);

  // Strings (double + single + template)
  result = result
    .replace(/`([^`]*)`/g, '<span class="text-amber-300">`$1`</span>')
    .replace(/"([^"]*)"/g, '<span class="text-amber-300">"$1"</span>')
    .replace(/'([^']*)'/g, '<span class="text-amber-300">\'$1\'</span>');

  // Comments
  result = result
    .replace(/(\/\/[^\n]*)/g, '<span class="text-neutral-500 italic">$1</span>')
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-neutral-500 italic">$1</span>');

  // Keywords
  keywords.forEach((kw) => {
    result = result.replace(
      new RegExp(`\\b(${kw})\\b`, "g"),
      '<span class="text-purple-300">$1</span>'
    );
  });

  // Numbers
  result = result.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-emerald-300">$1</span>');

  // JSX tags / HTML
  result = result
    .replace(/(&lt;\/?)([\w]+)/g, '$1<span class="text-blue-300">$2</span>')
    .replace(/(\w+)=/g, '<span class="text-sky-300">$1</span>=');

  return result;
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
