/**
 * ============================================================
 * CHAT GENERATE — Next.js API Route Proxy
 * ============================================================
 *
 * Penjelasan awam:
 * - Frontend kirim prompt ke sini
 * - Route ini teruskan ke backend FastAPI
 * - FastAPI kirim ke Ollama di VPS
 * - Jawaban diteruskan balik ke frontend
 *
 * Penjelasan teknis:
 * - Proxy pattern: hides backend URL from client
 * - Reads access token from httpOnly cookie for auth
 * - Forwards to FastAPI /api/chat/generate
 * - No external AI API keys — all goes to Ollama VPS
 *
 * Flow:
 * Browser → /api/chat/generate (Next.js) → http://localhost:8000/api/chat/generate (FastAPI) → Ollama VPS
 */

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "http://127.0.0.1:8000";
const COOKIE_NAME = "umkm_access_token";

export async function POST(request: NextRequest) {
    try {
        // ① Ambil access token dari cookie
        const accessToken = request.cookies.get(COOKIE_NAME)?.value;

        if (!accessToken) {
            return NextResponse.json(
                { detail: "Unauthorized — silakan login terlebih dahulu" },
                { status: 401 },
            );
        }

        // ② Parse request body dari frontend
        const body = await request.json();

        // ③ Map field names: frontend uses `prompt`, backend uses `message`
        const backendBody = {
            message: body.prompt || body.message,
            temperature: body.temperature,
            max_tokens: body.max_tokens,
        };

        // ④ Forward ke FastAPI backend
        const backendResponse = await fetch(`${BACKEND_URL}/api/chat/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(backendBody),
        });

        // ⑤ Teruskan response (termasuk error) ke frontend
        const data = await backendResponse.json().catch(() => ({}));

        if (!backendResponse.ok) {
            // Stringify detail jika berupa array (FastAPI validation error)
            let detail = data.detail;
            if (Array.isArray(detail)) {
                detail = detail.map((e: { msg?: string }) => e.msg || JSON.stringify(e)).join("; ");
            }
            return NextResponse.json(
                { detail: detail || `Backend error: ${backendResponse.status}` },
                { status: backendResponse.status },
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal server error";

        return NextResponse.json(
            { detail: `Gagal menghubungi AI server: ${message}` },
            { status: 502 },
        );
    }
}
