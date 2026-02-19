"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ExternalLink,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Code2,
  X,
  Maximize2,
  Download,
} from "lucide-react";
import type { SandboxInfo } from "./types";

interface PreviewPanelProps {
  sandboxInfo: SandboxInfo;
  onClose: () => void;
}

type ViewMode = "desktop" | "tablet" | "mobile";

export function PreviewPanel({ sandboxInfo, onClose }: PreviewPanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [showCode, setShowCode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIframeKey((prev) => prev + 1);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const viewModeWidths: Record<ViewMode, string> = {
    desktop: "w-full",
    tablet: "w-[768px]",
    mobile: "w-[375px]",
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Preview toolbar */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-neutral-200 shrink-0">
        <div className="flex items-center gap-1">
          {/* Device toggles */}
          <div className="flex items-center bg-neutral-100 rounded-lg p-0.5 gap-0.5">
            {(
              [
                { mode: "desktop" as const, icon: Monitor, label: "Desktop" },
                { mode: "tablet" as const, icon: Tablet, label: "Tablet" },
                { mode: "mobile" as const, icon: Smartphone, label: "Mobile" },
              ] as const
            ).map(({ mode, icon: Icon, label }) => (
              <Tooltip key={mode}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      "flex items-center justify-center size-7 rounded-md transition-all",
                      viewMode === mode
                        ? "bg-white text-neutral-900 shadow-sm"
                        : "text-neutral-400 hover:text-neutral-700"
                    )}
                  >
                    <Icon className="size-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* URL bar */}
          <div className="flex items-center gap-2 ml-3">
            <div className="flex items-center h-7 px-3 rounded-lg bg-neutral-50 border border-neutral-200 min-w-[200px]">
              <span className="text-[11px] text-neutral-500 truncate">
                {sandboxInfo.url}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleRefresh}
                className="text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
              >
                <RefreshCw
                  className={cn("size-3.5", isRefreshing && "animate-spin")}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setShowCode(!showCode)}
                className={cn(
                  "hover:bg-neutral-100",
                  showCode
                    ? "text-blue-600"
                    : "text-neutral-400 hover:text-neutral-900"
                )}
              >
                <Code2 className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Tampilkan kode</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={sandboxInfo.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
                >
                  <ExternalLink className="size-3.5" />
                </Button>
              </a>
            </TooltipTrigger>
            <TooltipContent>Buka di tab baru</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
              >
                <X className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Tutup preview</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 flex items-start justify-center overflow-auto bg-neutral-50 p-4">
        <div
          className={cn(
            "h-full rounded-xl overflow-hidden border border-neutral-200 bg-white transition-all duration-300 shadow-lg",
            viewModeWidths[viewMode],
            viewMode !== "desktop" && "mx-auto"
          )}
        >
          <iframe
            key={iframeKey}
            src={sandboxInfo.url}
            className="w-full h-full border-0"
            title="Website Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    </div>
  );
}
