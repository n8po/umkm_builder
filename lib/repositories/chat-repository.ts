/**
 * ============================================================
 * CHAT REPOSITORY
 * ============================================================
 * Mengelola semua operasi AI chat: generate website, dll.
 * Request dikirim ke Next.js API route proxy → FastAPI backend → Ollama VPS.
 */

import { apiClient } from "./api-client";

// ── Types ──────────────────────────────────────────────────

export interface ChatGenerateRequest {
    prompt: string;
    temperature?: number;
    max_tokens?: number;
}

export interface ChatGenerateResponse {
    response: string;
    model?: string;
    total_duration?: number;
}

// ── Repository ─────────────────────────────────────────────

/**
 * Penjelasan awam:
 * - generate() = kirim pertanyaan ke AI, terima jawaban
 * - AI-nya ada di VPS (Ollama + Qwen), bukan pakai OpenAI/cloud
 *
 * Penjelasan teknis:
 * - Calls Next.js route proxy at /api/chat/generate
 * - Proxy forwards to FastAPI backend → Ollama (VPS)
 * - No external AI API keys used
 * - Supports AbortSignal for cancellation
 */
export const chatRepository = {
    /**
     * Generate website/response dari AI.
     * @param request - prompt dan settings
     * @param signal - AbortSignal untuk cancel request
     */
    async generate(
        request: ChatGenerateRequest,
        signal?: AbortSignal,
    ): Promise<ChatGenerateResponse> {
        return apiClient<ChatGenerateResponse>("/api/chat/generate", {
            method: "POST",
            body: request,
            signal,
        });
    },
};
