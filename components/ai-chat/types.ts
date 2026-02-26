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
  };
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
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

