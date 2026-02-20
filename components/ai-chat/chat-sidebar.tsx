"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  MessageSquare,
  Settings,
  Home,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { SettingsDialog } from "./settings-dialog";
import type { ChatSession, AISettings } from "./types";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

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
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null)
    );
    return () => listener.subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.info("Kamu telah keluar", { description: "Sampai jumpa lagi!" });
    window.location.href = "/";
  };

  const getInitials = (u: User) => {
    const name = u.user_metadata?.full_name || u.email || "";
    return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-col h-full bg-neutral-50 border-r border-neutral-200 transition-all duration-300 shrink-0",
          open ? "w-[260px]" : "w-0 overflow-hidden border-r-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-neutral-200 shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <LogoIcon className="size-5 text-neutral-900" />
            <span className="text-sm font-semibold text-neutral-800 group-hover:text-neutral-900 transition-colors">
              UMKM Builder
            </span>
          </Link>
        </div>

        {/* New chat button */}
        <div className="px-3 pt-3 pb-1 shrink-0">
          <Button
            onClick={onNewSession}
            className={cn(
              "w-full justify-start gap-2 rounded-xl h-9",
              "bg-neutral-900 hover:bg-neutral-800 text-white",
              "shadow-sm transition-all"
            )}
            size="sm"
          >
            <Plus className="size-4" />
            Chat Baru
          </Button>
        </div>

        {/* Session list */}
        <div className="flex-1 min-h-0 mt-1">
          <div className="px-4 py-2">
            <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
              Riwayat Chat
            </span>
          </div>
          <ScrollArea className="h-full px-2">
            <div className="flex flex-col gap-0.5 pb-4">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className={cn(
                    "flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-left transition-all",
                    "hover:bg-neutral-100",
                    session.id === activeSessionId
                      ? "bg-neutral-200/70 text-neutral-900"
                      : "text-neutral-500"
                  )}
                >
                  <MessageSquare className="size-3.5 shrink-0" />
                  <span className="text-xs truncate">{session.title}</span>
                </button>
              ))}

              {sessions.length === 0 && (
                <div className="px-3 py-6 text-center">
                  <p className="text-xs text-neutral-400">Belum ada riwayat chat</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Bottom section */}
        <div className="border-t border-neutral-200 p-3 shrink-0 space-y-1">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg h-8 text-xs"
            >
              <Home className="size-3.5" />
              Beranda
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSettingsOpen(true)}
            className="w-full justify-start gap-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg h-8 text-xs"
          >
            <Settings className="size-3.5" />
            Pengaturan
          </Button>

          {/* User avatar & info */}
          {user && (
            <div className="mt-2 pt-2 border-t border-neutral-200">
              <div className="flex items-center gap-2.5 px-1 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors">
                <Avatar className="size-7 shrink-0">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || "User"} />
                  <AvatarFallback className="bg-neutral-900 text-white text-xs font-medium">
                    {getInitials(user)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-neutral-800 truncate">
                    {user.user_metadata?.full_name || "User"}
                  </p>
                  <p className="text-[10px] text-neutral-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  title="Keluar"
                  className="text-neutral-400 hover:text-red-500 transition-colors p-1 rounded"
                >
                  <LogOut className="size-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={aiSettings}
        onSave={onAiSettingsChange}
      />
    </>
  );
}
