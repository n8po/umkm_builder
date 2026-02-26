/**
 * ============================================================
 * REPOSITORIES — Barrel Export
 * ============================================================
 * Single import point for all repositories.
 * Usage: import { authRepository, chatRepository } from "@/lib/repositories"
 */

export * from "./api-client";
export * from "./auth-repository";
export * from "./chat-repository";

export { apiClient, ApiError } from "./api-client";
