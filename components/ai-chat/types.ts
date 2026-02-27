/** File yang di-generate AI */
export interface GeneratedFile {
  path: string;       // e.g. "components/Header.tsx"
  content: string;    // source code
  language: string;   // "tsx" | "ts" | "css" | "html" | "json" | ...
}

/** Mode chat: build website atau tanya-jawab */
export type ChatMode = "build" | "ask";

/** Step label untuk animasi generate */
export type GenerationStep =
  | "idle"
  | "analyzing"
  | "structuring"
  | "writing"
  | "done";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  isError?: boolean;
  metadata?: {
    editedFiles?: string[];
    addedPackages?: string[];
    model?: string;
    generatedFiles?: GeneratedFile[];
  };
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  sandboxId?: string;
  sandboxUrl?: string;
  generatedFiles?: GeneratedFile[];
}

export interface SandboxInfo {
  sandboxId: string;
  url: string;
  provider: "e2b" | "vercel";
}

export type SuggestionPrompt = {
  icon: React.ReactNode;
  title: string;
  description: string;
  prompt: string;
};

export interface AISettings {
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

// ============================================================
// Builder Types — JSON Schema → dnd-kit
// ============================================================

/** Tipe komponen yang tersedia di builder */
export type BlockType =
  | "header"
  | "hero"
  | "product"
  | "menu-grid"
  | "about"
  | "location"
  | "contact"
  | "gallery"
  | "testimonial"
  | "footer";

/** Setiap block/komponen di builder canvas */
export interface BuilderBlock {
  id: string;
  type: BlockType;
  props: Record<string, unknown>;
}

/** Response JSON dari Ollama/Qwen yang sudah dinormalisasi */
export interface BuilderResponse {
  components: BuilderBlock[];
}

