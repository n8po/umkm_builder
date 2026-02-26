/**
 * ============================================================
 * CHAT SERVICE
 * ============================================================
 * Layer business logic untuk fitur AI Chat.
 */

import { chatRepository, type ChatGenerateRequest, type ChatGenerateResponse } from "../repositories";

/**
 * Penjelasan awam:
 * - Service yang mengatur lalu lintas kirim pesan ke AI.
 *
 * Penjelasan teknis:
 * - Saat ini bersifat pass-through ke chatRepository, namun siap jika ke depan 
 *   ada logic tambahan seperti validasi prompt, manipulasi state, atau caching 
 *   sebelum memanggil repository.
 */
export const chatService = {
    /**
     * Generate respon dari AI.
     */
    async generateResponse(
        request: ChatGenerateRequest,
        signal?: AbortSignal
    ): Promise<ChatGenerateResponse> {
        // Di sini bisa ditambahkan pre-processing prompt jika dibutuhkan nanti
        return await chatRepository.generate(request, signal);
    },
};
