/**
 * ============================================================
 * AUTH REPOSITORY
 * ============================================================
 * Mengelola semua operasi autentikasi: session, login, logout.
 * Menggunakan apiClient sebagai transport layer.
 */

import { apiClient } from "./api-client";

import { getBackendBaseUrl } from "../backend-url";

// ── Types ──────────────────────────────────────────────────

export interface SessionUser {
    id?: string | null;
    email?: string | null;
}

export interface SessionData {
    authenticated: boolean;
    user?: SessionUser;
}

interface SaveSessionPayload {
    accessToken: string;
    refreshToken?: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token?: string;
    token_type: string;
    user_id: string;
    email: string;
    detail?: string;
}

export interface ForgotPasswordResponse {
    ok: boolean;
    message: string;
    detail?: string;
}

// ── Repository ─────────────────────────────────────────────

/**
 * Penjelasan awam:
 * - getSession() = cek apakah kamu sudah login
 * - saveSession() = simpan tiket login setelah berhasil masuk
 * - deleteSession() = buang tiket login (logout)
 *
 * Penjelasan teknis:
 * - All methods call /api/auth/session (Next.js route handler)
 * - Session data stored in httpOnly cookies (not accessible from JS)
 * - Refresh token auto-rotated by the route handler when access token expires
 */
export const authRepository = {
    /**
     * Cek status login user saat ini.
     * Return { authenticated: true, user: {...} } jika sudah login.
     */
    async getSession(): Promise<SessionData> {
        try {
            return await apiClient<SessionData>("/api/auth/session", {
                cache: "no-store",
            });
        } catch {
            return { authenticated: false };
        }
    },

    /**
     * Simpan access + refresh token ke httpOnly cookies.
     * Dipanggil setelah login/register berhasil.
     */
    async saveSession(payload: SaveSessionPayload): Promise<void> {
        await apiClient("/api/auth/session", {
            method: "POST",
            body: payload,
        });
    },

    /**
     * Hapus session cookies (logout).
     */
    async deleteSession(): Promise<void> {
        await apiClient("/api/auth/session", {
            method: "DELETE",
        });
    },

    /**
     * Register akun baru via backend.
     */
    async register(payload: any): Promise<AuthResponse> {
        const baseUrl = getBackendBaseUrl();
        return await apiClient<AuthResponse>(`${baseUrl}/api/auth/register`, {
            method: "POST",
            body: payload,
        });
    },

    /**
     * Login via backend.
     */
    async login(payload: any): Promise<AuthResponse> {
        const baseUrl = getBackendBaseUrl();
        return await apiClient<AuthResponse>(`${baseUrl}/api/auth/login`, {
            method: "POST",
            body: payload,
        });
    },

    /**
     * Request forgot password link.
     */
    async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
        const baseUrl = getBackendBaseUrl();
        return await apiClient<ForgotPasswordResponse>(`${baseUrl}/api/auth/forgot-password`, {
            method: "POST",
            body: { email },
        });
    },

    /**
     * Reset password via backend.
     */
    async resetPassword(payload: any): Promise<ForgotPasswordResponse> {
        const baseUrl = getBackendBaseUrl();
        return await apiClient<ForgotPasswordResponse>(`${baseUrl}/api/auth/reset-password`, {
            method: "POST",
            body: payload,
        });
    },
};
