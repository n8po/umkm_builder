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
import { authService } from "@/lib/services";
import type { SessionUser } from "@/lib/repositories";


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
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const session = await authService.getSession();
      setUser(session?.authenticated ? (session.user ?? null) : null);
    };
    void loadSession();
  }, []);

  const handleSignOut = async () => {
    await authService.logout();
    toast.info("Kamu telah keluar", { description: "Sampai jumpa lagi!" });
    window.location.href = "/";
  };

  const getInitials = (u: SessionUser) => {
    const name = u.email || "";
    return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-col h-full bg-[#1a1a2e] transition-all duration-300 shrink-0",
          open ? "w-[260px]" : "w-0 overflow-hidden"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 h-16 px-6 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500">
              <LogoIcon className="size-4 text-white" />
            </div>
            <span className="text-[15px] font-bold text-white tracking-tight">efferd</span>
          </Link>
        </div>

        {/* Nav */}
        <div className="px-4 space-y-0.5">
          <button
            onClick={onNewSession}
            className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-[13px] text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
          >
            <Plus className="size-4" />
            New chat
          </button>
          <button className="flex items-center justify-between w-full rounded-xl px-3 py-2.5 text-[13px] text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <Search className="size-4" />
              Search
            </div>
            <span className="text-[10px] text-white/20 bg-white/5 px-1.5 py-0.5 rounded">⌘F</span>
          </button>
          <Link href="/pricing">
            <button className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-[13px] text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors">
              <CreditCard className="size-4" />
              Manage subscription
            </button>
          </Link>
          <button className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-[13px] text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors">
            <HelpCircle className="size-4" />
            Updates & FAQ
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-[13px] text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
          >
            <Settings className="size-4" />
            Settings
          </button>
        </div>

        {/* Chat list */}
        <div className="flex-1 min-h-0 mt-4">
          <div className="flex items-center gap-2 px-6 py-2">
            <ChevronDown className="size-3 text-white/30" />
            <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider">
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
                      ? "bg-[#6c5ce7]/15 text-white"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={cn(
                      "size-2 rounded-full shrink-0",
                      session.id === activeSessionId ? "bg-[#a29bfe]" : "bg-white/20"
                    )} />
                    <span className="text-[13px] truncate">{session.title}</span>
                  </div>
                </button>
              ))}

              {sessions.length === 0 && (
                <div className="px-3 py-8 text-center">
                  <p className="text-xs text-white/20">Belum ada chat</p>
                </div>
              )}


            </div>
          </ScrollArea>
        </div>

        {/* Bottom */}
        <div className="p-4 shrink-0 space-y-3">
          {/* User card */}
          {user && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04]">
              <Avatar className="size-9 shrink-0 ring-2 ring-white/10">
                <AvatarImage src={undefined} alt={user.email || "User"} />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-500 text-white text-xs font-bold">
                  {getInitials(user)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-white truncate">
                    {user.email?.split("@")[0] || "User"}
                  </p>
                  <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full uppercase">
                    Free
                  </span>
                </div>
                <p className="text-[10px] text-white/30 truncate">{user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                title="Keluar"
                className="text-white/20 hover:text-red-400 transition-colors p-1"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          )}

          {/* Theme toggle */}
          <div className="flex items-center rounded-xl bg-white/[0.04] p-1">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/10 text-white text-[11px] font-medium">
              <Sun className="size-3" />
              Light
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-white/30 text-[11px] font-medium hover:text-white/50 transition-colors">
              <Moon className="size-3" />
              Dark
            </button>
          </div>
        </div>
      </div>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={aiSettings}
        onSave={onAiSettingsChange}
      />
    </>
  );
}
