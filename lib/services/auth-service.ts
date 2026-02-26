/**
 * ============================================================
 * AUTH SERVICE
 * ============================================================
 * Layer perantara yang mengatur business logic (aturan bisnis).
 * Service memanggil Repository untuk urusan data.
 * UI (Controller) memanggil Service.
 */

import { authRepository, type AuthResponse, type SessionData, type ForgotPasswordResponse } from "../repositories";

/**
 * Penjelasan awam:
 * - UI (Halaman Login): "Halo Service, ini ada user mau login."
 * - Service (Manajer): "Oke, saya cek ke Gudang (Repository). Kalau password benar, saya juga yang urus cetak ID Card (Session)."
 * - Repository (Gudang): Hanya tahu cara ambil/simpan data ke backend.
 *
 * Penjelasan teknis:
 * - Orchestrates business flows. For example, `login()` doesn't just call the backend,
 *   it also handles the logic of saving the resulting tokens into the HTTP-only cookie session.
 * - Decouples components from multi-step repository operations.
 */
export const authService = {
    /**
     * Cek session.
     */
    async getSession(): Promise<SessionData> {
        return await authRepository.getSession();
    },

    /**
     * Proses login: panggil API login, lalu simpan token ke cookies.
     */
    async login(payload: any): Promise<AuthResponse> {
        const data = await authRepository.login(payload);

        // Business logic: Jika login berhasil, otomatis simpan sesi
        if (data?.access_token) {
            await authRepository.saveSession({
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
            });
        }
        return data;
    },

    /**
     * Proses register: panggil API register, lalu simpan token ke cookies.
     */
    async register(payload: any): Promise<AuthResponse> {
        const data = await authRepository.register(payload);

        // Business logic: Jika register berhasil, otomatis login (simpan sesi)
        if (data?.access_token) {
            await authRepository.saveSession({
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
            });
        }
        return data;
    },

    /**
     * Proses logout: hapus session cookies.
     */
    async logout(): Promise<void> {
        await authRepository.deleteSession();
    },

    /**
     * Request forgot password.
     */
    async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
        return await authRepository.forgotPassword(email);
    },

    /**
     * Reset password.
     */
    async resetPassword(payload: any): Promise<ForgotPasswordResponse> {
        return await authRepository.resetPassword(payload);
    },
};
