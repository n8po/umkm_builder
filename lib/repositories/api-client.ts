/**
 * ============================================================
 * API CLIENT — Base HTTP client for all repositories
 * ============================================================
 * Centralized fetch wrapper with error handling.
 * All repositories use this client for consistent behavior.
 */

export class ApiError extends Error {
    constructor(
        public status: number,
        public detail: string,
    ) {
        super(detail);
        this.name = "ApiError";
    }
}

interface RequestOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: unknown;
    headers?: Record<string, string>;
    signal?: AbortSignal;
    cache?: RequestCache;
}

/**
 * Fetch wrapper yang consistent untuk semua API call.
 *
 * Penjelasan awam:
 * - Ini seperti "kurir" yang mengantar semua permintaan ke server
 * - Kalau server beri jawaban buruk, kurir akan bilang error-nya apa
 *
 * Penjelasan teknis:
 * - Wraps native fetch with JSON serialization/deserialization
 * - Throws ApiError with status code and detail for non-OK responses
 * - Automatically sets Content-Type for JSON bodies
 */
export async function apiClient<T = unknown>(
    url: string,
    options: RequestOptions = {},
): Promise<T> {
    const { method = "GET", body, headers = {}, signal, cache } = options;

    const fetchOptions: RequestInit = {
        method,
        signal,
        cache,
        headers: {
            ...headers,
            ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    };

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
        let detail = `API error: ${response.status}`;
        try {
            const errData = await response.json();
            if (typeof errData.detail === "string") {
                detail = errData.detail;
            } else if (Array.isArray(errData.detail)) {
                // FastAPI validation errors: [{ msg: "Field required", loc: [...] }]
                detail = errData.detail
                    .map((e: { msg?: string }) => e.msg || JSON.stringify(e))
                    .join("; ");
            } else if (errData.message) {
                detail = errData.message;
            }
        } catch {
            // Response bukan JSON, pakai default message
        }
        throw new ApiError(response.status, detail);
    }

    // Handle empty responses (204 No Content, etc.)
    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
        return {} as T;
    }

    return response.json() as Promise<T>;
}
