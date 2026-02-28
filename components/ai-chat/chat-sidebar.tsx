"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { LogoIcon } from "@/components/logo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  MessageSquare,
  Settings,
  Search,
  LogOut,
  CreditCard,
  HelpCircle,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { SettingsDialog } from "./settings-dialog";
import type { ChatSession, AISettings } from "./types";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { authService } from "@/lib/services";
import type { UserProfile } from "@/lib/repositories";


interface ChatSidebarProps {
  open: boolean;
  onToggle: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  aiSettings: AISettings;
  onAiSettingsChange: (settings: AISettings) => void;
}

export function ChatSidebar({
  open,
  onToggle,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  aiSettings,
  onAiSettingsChange,
}: ChatSidebarProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const loadSession = async () => {
      const session = await authService.getSession();
      if (session?.authenticated) {
        const profile = await authService.getMe();
        setUser(profile);
      } else {
        setUser(null);
      }
    };
    void loadSession();
  }, []);

  const handleSignOut = async () => {
    await authService.logout();
    toast.info("Kamu telah keluar", { description: "Sampai jumpa lagi!" });
    window.location.href = "/";
  };

  const getInitials = (u: UserProfile) => {
    const name = u.email || "";
    return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-col h-full bg-neutral-50 dark:bg-[#1a1a2e] border-r border-neutral-200 dark:border-white/5 transition-all duration-300 shrink-0",
          open ? "w-[260px]" : "w-0 overflow-hidden"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 h-16 px-6 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500">
              <LogoIcon className="size-4 text-white" />
            </div>
            <span className="text-[15px] font-bold text-neutral-900 dark:text-white tracking-tight">efferd</span>
          </Link>
        </div>

        {/* Nav */}
        <div className="px-4 space-y-0.5">
          <button
            onClick={onNewSession}
            className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-[13px] text-neutral-600 dark:text-white/50 hover:text-neutral-900 dark:hover:text-white/80 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
          >
            <Plus className="size-4" />
            New chat
          </button>
          <button className="flex items-center justify-between w-full rounded-xl px-3 py-2.5 text-[13px] text-neutral-600 dark:text-white/50 hover:text-neutral-900 dark:hover:text-white/80 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <Search className="size-4" />
              Search
            </div>
            <span className="text-[10px] text-neutral-400 dark:text-white/20 bg-neutral-200/50 dark:bg-white/5 px-1.5 py-0.5 rounded">⌘F</span>
          </button>
        </div>

        {/* Chat list */}
        <div className="flex-1 min-h-0 mt-4">
          <div className="flex items-center gap-2 px-6 py-2">
            <ChevronDown className="size-3 text-neutral-400 dark:text-white/30" />
            <span className="text-[11px] font-medium text-neutral-400 dark:text-white/30 uppercase tracking-wider">
              Chat list
            </span>
          </div>
          <ScrollArea className="h-full px-3">
            <div className="flex flex-col gap-0.5 pb-4">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className={cn(
                    "flex items-center justify-between w-full rounded-xl px-3 py-2.5 text-left transition-all",
                    session.id === activeSessionId
                      ? "bg-white dark:bg-[#6c5ce7]/15 text-neutral-900 dark:text-white shadow-sm dark:shadow-none border border-neutral-200/60 dark:border-transparent"
                      : "text-neutral-500 dark:text-white/40 hover:text-neutral-900 dark:hover:text-white/70 hover:bg-neutral-100/50 dark:hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={cn(
                      "size-2 rounded-full shrink-0",
                      session.id === activeSessionId ? "bg-neutral-900 dark:bg-[#a29bfe]" : "bg-neutral-300 dark:bg-white/20"
                    )} />
                    <span className="text-[13px] truncate font-medium">{session.title}</span>
                  </div>
                </button>
              ))}

              {sessions.length === 0 && (
                <div className="px-3 py-8 text-center">
                  <p className="text-xs text-neutral-400 dark:text-white/20">Belum ada chat</p>
                </div>
              )}


            </div>
          </ScrollArea>
        </div>

        {/* Bottom */}
        <div className="p-4 shrink-0 space-y-3">
          {/* User card */}
          {user && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-white/[0.04] border border-neutral-200/60 dark:border-white/5 shadow-sm dark:shadow-none">
              <Avatar className="size-9 shrink-0 ring-1 ring-neutral-200 dark:ring-white/10">
                <AvatarImage src={undefined} alt={user.email || "User"} />
                <AvatarFallback className="bg-neutral-100 dark:bg-gradient-to-br dark:from-violet-500 dark:to-blue-500 text-neutral-900 dark:text-white text-xs font-bold">
                  {getInitials(user)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                    {user.email?.split("@")[0] || "User"}
                  </p>
                  <span className="text-[9px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full uppercase">
                    Free
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 dark:text-white/30 truncate">{user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                title="Keluar"
                className="text-neutral-400 dark:text-white/20 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          )}

          {/* Theme toggle & Settings */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center rounded-xl bg-neutral-200/50 dark:bg-white/[0.04] p-1 border border-neutral-200/50 dark:border-transparent">
              <button
                onClick={() => setTheme("light")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-medium transition-colors border",
                  theme !== "dark"
                    ? "bg-white shadow-sm text-neutral-900 border-neutral-200/50"
                    : "border-transparent text-white/30 hover:text-white/50"
                )}
              >
                <Sun className="size-3" />
                Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-medium transition-colors border",
                  theme === "dark"
                    ? "bg-white/10 text-white border-transparent"
                    : "text-neutral-500 hover:text-neutral-900 border-transparent"
                )}
              >
                <Moon className="size-3" />
                Dark
              </button>
            </div>
            <button
              onClick={() => setSettingsOpen(true)}
              title="Settings"
              className="flex items-center justify-center shrink-0 size-9 rounded-xl bg-neutral-200/50 dark:bg-white/[0.04] border border-neutral-200/50 dark:border-transparent text-neutral-500 hover:text-neutral-900 dark:text-white/30 dark:hover:text-white/80 transition-colors"
            >
              <Settings className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={aiSettings}
        onSave={onAiSettingsChange}
        user={user}
      />
    </>
  );
}
