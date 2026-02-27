"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Loader2, Thermometer, Hash, FileText, User, CreditCard, Activity, Sparkles, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { AISettings } from "./types";
import type { SessionUser } from "@/lib/repositories";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: AISettings;
  onSave: (settings: AISettings) => void;
  user: SessionUser | null;
}

export function SettingsDialog({
  open,
  onOpenChange,
  settings,
  onSave,
  user,
}: SettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState<AISettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("profil");

  // Sync local state when dialog opens
  useEffect(() => {
    if (open) {
      setLocalSettings(settings);
      setShowSuccess(false);
      setActiveTab("profil");
    }
  }, [open, settings]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Simulate saving to database
      await new Promise((resolve) => setTimeout(resolve, 600));
      onSave(localSettings);
      setShowSuccess(true);

      // Auto-close after showing success
      setTimeout(() => {
        setShowSuccess(false);
        onOpenChange(false);
      }, 1500);
    } catch {
      // Handle error silently
    } finally {
      setIsSaving(false);
    }
  };

  const handleTemperatureChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0 && num <= 2) {
      setLocalSettings((prev) => ({ ...prev, temperature: num }));
    }
  };

  const handleMaxTokensChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 100 && num <= 32000) {
      setLocalSettings((prev) => ({ ...prev, maxTokens: num }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-neutral-900 border text-neutral-900 dark:text-neutral-100 border-neutral-200 dark:border-white/10 shadow-xl dark:shadow-2xl sm:max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Pengaturan AI</DialogTitle>
        <DialogDescription className="sr-only">Kustomisasi profil, prompt sistem, dan penagihan AI Chat.</DialogDescription>
        
        <div className="flex h-[500px]">
          {/* Left Sidebar Tabs */}
          <div className="w-[200px] border-r border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-neutral-950/50 p-4 shrink-0">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 px-2">Settings</h2>
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
              <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-1 items-start w-full">
                <TabsTrigger 
                  value="profil" 
                  className="w-full justify-start gap-2.5 px-3 py-2 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-neutral-200 dark:data-[state=active]:border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                >
                  <User className="size-4" />
                  Profil
                </TabsTrigger>
                <TabsTrigger 
                  value="prompt" 
                  className="w-full justify-start gap-2.5 px-3 py-2 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-neutral-200 dark:data-[state=active]:border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                >
                  <Sparkles className="size-4" />
                  Prompt Sistem
                </TabsTrigger>
                <TabsTrigger 
                  value="billing" 
                  className="w-full justify-start gap-2.5 px-3 py-2 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-neutral-200 dark:data-[state=active]:border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                >
                  <CreditCard className="size-4" />
                  Penagihan
                </TabsTrigger>
                <TabsTrigger 
                  value="usage" 
                  className="w-full justify-start gap-2.5 px-3 py-2 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-neutral-200 dark:data-[state=active]:border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                >
                  <Activity className="size-4" />
                  Penggunaan
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col bg-white dark:bg-neutral-900">
            <div className="flex-1 overflow-y-auto p-6">
              
              {/* TAB 1: PROFIL */}
              {activeTab === "profil" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight">Data Diri</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Informasi utama mengenai akun Anda.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Email Address</Label>
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-white/5">
                        <div className="flex size-10 items-center justify-center rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold">
                          {user?.email?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">{user?.email || "Tidak ada sesi aktif"}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">Personal Account</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Status Langganan</Label>
                      <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5">
                        <div className="flex items-center gap-3">
                          <Building2 className="size-5 text-neutral-400 dark:text-neutral-500" />
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">Free Tier</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Akses standar ke pembuat UMKM AI.</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PROMPT SISTEM */}
              {activeTab === "prompt" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight">Prompt Sistem & Konfigurasi</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Sesuaikan karakter dan respon AI agar pas dengan kebutuhan.</p>
                  </div>

                  <div className="space-y-5">
                    {/* System Prompt */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-neutral-900 dark:text-white">Instruksi Kustom</Label>
                      <Textarea
                        value={localSettings.systemPrompt}
                        onChange={(e) =>
                          setLocalSettings((prev) => ({
                            ...prev,
                            systemPrompt: e.target.value,
                          }))
                        }
                        placeholder="Contoh: 'Gunakan Tailwind CSS yang modern dan responsif...'"
                        rows={5}
                        className="border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 text-neutral-900 dark:text-white text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus-visible:border-neutral-900 dark:focus-visible:border-white focus-visible:ring-neutral-900 dark:focus-visible:ring-white resize-none shadow-sm dark:shadow-none"
                      />
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Context ini akan disematkan secara tersembunyi di awal percakapan sebagai `System Prompt`.
                      </p>
                    </div>

                    {/* Temperature */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-neutral-900 dark:text-white">Kreativitas (Temperature)</Label>
                        <span className="text-xs font-mono text-neutral-900 dark:text-neutral-300 bg-neutral-100 dark:bg-white/10 px-2 py-1 rounded">
                          {localSettings.temperature.toFixed(1)}
                        </span>
                      </div>
                      <Input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={localSettings.temperature}
                        onChange={(e) => handleTemperatureChange(e.target.value)}
                        className="h-1.5 p-0 border-0 shadow-none accent-neutral-900 dark:accent-white focus:outline-none cursor-pointer bg-neutral-200 dark:bg-neutral-800"
                      />
                      <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                        <span>Lugas (0.0)</span>
                        <span>Seimbang (0.7)</span>
                        <span>Kreatif (2.0)</span>
                      </div>
                    </div>

                    {/* Max Tokens */}
                    <div className="space-y-3 pt-2">
                      <Label className="text-sm font-medium text-neutral-900 dark:text-white">Batas Token Genarasi</Label>
                      <Input
                        type="number"
                        min={100}
                        max={32000}
                        step={100}
                        value={localSettings.maxTokens}
                        onChange={(e) => handleMaxTokensChange(e.target.value)}
                        className="border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 text-neutral-900 dark:text-white focus-visible:border-neutral-900 dark:focus-visible:border-white focus-visible:ring-neutral-900 dark:focus-visible:ring-white max-w-[200px]"
                      />
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Batasan maksimum token respon per pesan.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PENAGIHAN */}
              {activeTab === "billing" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight">Penagihan</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Kelola metode pembayaran dan tagihan langganan Anda.</p>
                  </div>

                  <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-white/5 p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[250px]">
                    <div className="size-12 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 flex items-center justify-center shadow-sm dark:shadow-none">
                      <CreditCard className="size-5 text-neutral-400 dark:text-neutral-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-neutral-900 dark:text-white">Tidak ada kartu kredit tersimpan</h4>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm">
                        Anda saat ini berada di paket gratis. Tambahkan metode pembayaran untuk beralih ke paket Pro.
                      </p>
                    </div>
                    <Button variant="outline" className="mt-2 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-neutral-700 shadow-sm" disabled>
                      Tambah Metode Pembayaran
                    </Button>
                  </div>
                </div>
              )}

              {/* TAB 4: PENGGUNAAN */}
              {activeTab === "usage" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight">Statistik Penggunaan</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Pantau penggunaan kredit AI dan resource Anda bulan ini.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm dark:shadow-none space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="size-4 text-emerald-500" />
                          <h4 className="text-sm font-medium text-neutral-900 dark:text-white">Kredit AI Tersisa</h4>
                        </div>
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">∞ / ∞</span>
                      </div>
                      
                      <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-neutral-900 dark:bg-white h-2 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                      
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        (Demo Mode) Batasan token dinonaktifkan untuk pengujian.
                      </p>
                    </div>

                    <div className="p-5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm dark:shadow-none space-y-4 opacity-50">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-neutral-900 dark:text-white">Penyimpanan Sandbox</h4>
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">0 MB / 500 MB</span>
                      </div>
                      <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-neutral-400 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Sticky Footer */}
            <div className="p-4 border-t border-neutral-100 dark:border-white/5 bg-white dark:bg-neutral-900 flex items-center justify-end gap-3 mt-auto shrink-0">
              {showSuccess ? (
                <div className="flex items-center gap-2 text-sm text-emerald-600 mr-auto px-2 font-medium">
                  <Check className="size-4" />
                  Pengaturan disimpan
                </div>
              ) : null}
              
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                Tutup
              </Button>
              {activeTab === "prompt" && (
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-sm"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin mr-2" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Prompt & Konfig"
                  )}
                </Button>
              )}
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
