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
