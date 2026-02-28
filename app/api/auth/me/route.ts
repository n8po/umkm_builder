/**
 * ============================================================
 * GET /api/auth/me
 * ============================================================
 * Endpoint khusus untuk mengambil data profil user.
 *
 * Penjelasan teknis:
 *   - Membaca JWT dari httpOnly cookie `umkm_access_token`
 *   - Decode payload JWT untuk extract user data (sub, email)
 *   - TIDAK melakukan refresh token — jika expired, return 401
 *   - Data yang di-return: { id, email }
 *
 * Kenapa terpisah dari /api/auth/session?
 *   - Session hanya cek "sudah login?" (ringan, sering dipanggil)
 *   - Me memberikan data pribadi (hanya dipanggil saat perlu tampilkan)
 *   - Prinsip least privilege: jangan kirim data yg tidak diminta
 */

import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "umkm_access_token";

/**
 * Decode bagian payload (bagian kedua) dari JWT token.
 * JWT format: header.payload.signature
 * Kita hanya perlu payload untuk baca data user.
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
    try {
        const parts = token.split(".");
        if (parts.length < 2) return null;

        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
        const json = Buffer.from(padded, "base64").toString("utf8");
        return JSON.parse(json) as Record<string, unknown>;
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    // 1. Ambil JWT dari httpOnly cookie
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
        return NextResponse.json(
            { error: "Tidak terautentikasi" },
            { status: 401 }
        );
    }

    // 2. Decode payload JWT
    const payload = decodeJwtPayload(token);
    if (!payload) {
        return NextResponse.json(
            { error: "Token tidak valid" },
            { status: 401 }
        );
    }

    // 3. Cek apakah token sudah expired
    const exp = typeof payload.exp === "number" ? payload.exp : null;
    if (exp && Date.now() >= exp * 1000) {
        return NextResponse.json(
            { error: "Token expired" },
            { status: 401 }
        );
    }

    // 4. Return data user dari payload JWT
    return NextResponse.json(
        {
            id: (payload.sub as string) ?? null,
            email: (payload.email as string) ?? null,
        },
        { status: 200 }
    );
}
