"use client";

import { useState, useCallback, useRef } from "react";

export interface SandboxState {
  sandboxId: string | null;
  sandboxUrl: string | null;
  isCreating: boolean;
  error: string | null;
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

export function useSandbox() {
  const [state, setState] = useState<SandboxState>({
    sandboxId: null,
    sandboxUrl: null,
    isCreating: false,
    error: null,
  });

  const sandboxIdRef = useRef<string | null>(null);

  /** Create sandbox if not already active */
  const createSandbox = useCallback(async (): Promise<{
    sandboxId: string;
    url: string;
  } | null> => {
    // If already active, return current
    if (sandboxIdRef.current && state.sandboxUrl) {
      return { sandboxId: sandboxIdRef.current, url: state.sandboxUrl };
    }

    setState((prev) => ({ ...prev, isCreating: true, error: null }));

    try {
      const res = await fetch("/api/create-ai-sandbox", { method: "POST" });
      if (!res.ok) throw new Error(`Sandbox creation failed: ${res.statusText}`);

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Sandbox creation failed");

      sandboxIdRef.current = data.sandboxId;
      setState({
        sandboxId: data.sandboxId,
        sandboxUrl: data.url,
        isCreating: false,
        error: null,
      });

      return { sandboxId: data.sandboxId, url: data.url };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setState((prev) => ({ ...prev, isCreating: false, error: msg }));
      return null;
    }
  }, [state.sandboxUrl]);

  /**
   * Generate code via SSE stream and apply to sandbox.
   * Returns all generated files.
   */
  const generateCode = useCallback(
    async (
      prompt: string,
      onProgress: (type: string, message: string) => void,
      onFile: (file: GeneratedFile) => void,
      isEdit = false
    ): Promise<{ files: GeneratedFile[]; text: string } | null> => {
      // Ensure sandbox exists
      const sandbox = await createSandbox();
      if (!sandbox) return null;

      onProgress("status", "Menghubungkan ke AI...");

      // Accumulate full streamed response
      let fullResponse = "";
      const files: GeneratedFile[] = [];

      try {
        const res = await fetch("/api/generate-ai-code-stream", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            isEdit,
            sandboxId: sandbox.sandboxId
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || errData.error || `Error AI: ${res.statusText}`);
        }

        const data = await res.json();
        fullResponse = data.response || data.edited_code || "";


        onProgress("status", "Menerapkan kode ke sandbox...");

        // Apply code to sandbox
        const applyRes = await fetch("/api/apply-ai-code-stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            response: fullResponse,
            isEdit,
            sandboxId: sandbox.sandboxId,
          }),
        });

        if (applyRes.body) {
          const applyReader = applyRes.body.getReader();
          const applyDecoder = new TextDecoder();

          while (true) {
            const { done, value } = await applyReader.read();
            if (done) break;

            const chunk = applyDecoder.decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              try {
                const data = JSON.parse(line.slice(6));

                if (data.type === "file-complete") {
                  const path = data.fileName as string;
                  const lang = path.split(".").pop() ?? "js";
                  const content = (data.content as string) || "";
                  // Track file with content from SSE event
                  const existing = files.find((f) => f.path === path);
                  if (existing) {
                    existing.content = content;
                  } else {
                    files.push({ path, content, language: lang });
                  }
                  onProgress("file", path);
                } else if (data.type === "step") {
                  onProgress("status", data.message);
                } else if (data.type === "complete") {
                  onProgress("complete", `${data.results?.filesCreated?.length ?? files.length} file dibuat`);
                } else if (data.type === "sandbox-recreated") {
                  setSandbox(data.sandboxId, data.sandboxUrl);
                  onProgress("info", "Menghubungkan ulang ke Sandbox baru...");
                }
              } catch {
                // ignore
              }
            }
          }
        }

        // Parse files from fullResponse to get content
        const codeBlockRegex = /```[\w]*\s*([\w\\/\-\.]+\.\w+)\n([\s\S]*?)```/g;
        let m: RegExpExecArray | null;
        while ((m = codeBlockRegex.exec(fullResponse)) !== null) {
          const path = m[1].trim();
          const content = m[2].trim();
          // Update file content if path matches
          const existing = files.find((f) => f.path.includes(path) || path.includes(f.path.split("/").pop() || ""));
          if (existing) {
            existing.content = content;
          } else if (path.includes(".")) {
            const lang = path.split(".").pop() ?? "js";
            files.push({ path, content, language: lang });
          }
        }

        // Also parse <file path="...">...</file> format
        const xmlFileRegex = /<file path="([^"]+)">([\s\S]*?)<\/file>/g;
        while ((m = xmlFileRegex.exec(fullResponse)) !== null) {
          const path = m[1];
          const content = m[2].trim();
          const lang = path.split(".").pop() ?? "js";
          const existing = files.find((f) => f.path === path);
          if (existing) {
            existing.content = content;
          } else {
            files.push({ path, content, language: lang });
          }
        }

        // Also try JSON format: parse components array from response
        try {
          const jsonMatch = fullResponse.match(/```json\n([\s\S]*?)\n```/) || [null, fullResponse];
          const jsonStr = jsonMatch[1]?.trim();
          if (jsonStr && (jsonStr.startsWith('{') || jsonStr.startsWith('['))) {
            const jsonData = JSON.parse(jsonStr);
            if (jsonData.components && Array.isArray(jsonData.components)) {
              // JSON layout mode — content was generated as component templates
              // Files should already have been populated by apply-ai-code-stream
              // We'll fetch them from sandbox below if still empty
            }
          }
        } catch {
          // Not JSON, that's fine
        }

        // Fallback: fetch file content from sandbox for files still empty
        const emptyFiles = files.filter((f) => !f.content);
        if (emptyFiles.length > 0 && sandbox) {
          try {
            const fetchRes = await fetch(`/api/get-sandbox-files`);
            if (fetchRes.ok) {
              const fetchData = await fetchRes.json();
              if (fetchData.success && fetchData.files) {
                for (const file of emptyFiles) {
                  // Try matching with and without src/ prefix
                  const content =
                    fetchData.files[file.path] ||
                    fetchData.files[`src/${file.path}`] ||
                    fetchData.files[file.path.replace(/^src\//, "")];
                  if (content) {
                    file.content = content;
                  }
                }
              }
            }
          } catch {
            // ignore fetch errors
          }
        }

        // NOW call onFile for all files that have content
        for (const file of files) {
          onFile(file);
        }

      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        onProgress("error", msg);
      }

      return { files, text: fullResponse };
    },
    [createSandbox]
  );

  const reset = useCallback(() => {
    sandboxIdRef.current = null;
    setState({ sandboxId: null, sandboxUrl: null, isCreating: false, error: null });
  }, []);

  const setSandbox = useCallback((id: string | null, url: string | null) => {
    sandboxIdRef.current = id;
    setState(prev => ({ ...prev, sandboxId: id, sandboxUrl: url }));
  }, []);

  return {
    ...state,
    sandboxIdRef,
    createSandbox,
    generateCode,
    reset,
    setSandbox,
  };
}
