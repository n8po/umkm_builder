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
import { Check, Loader2, Thermometer, Hash, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AISettings } from "./types";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: AISettings;
  onSave: (settings: AISettings) => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  settings,
  onSave,
}: SettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState<AISettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync local state when dialog opens
  useEffect(() => {
    if (open) {
      setLocalSettings(settings);
      setShowSuccess(false);
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
      <DialogContent className="bg-white border-neutral-200 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-neutral-900">Pengaturan AI</DialogTitle>
          <DialogDescription className="text-neutral-500">
            Konfigurasi parameter AI untuk menghasilkan kode yang lebih sesuai.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-neutral-700 flex items-center gap-2">
                <Thermometer className="size-3.5 text-neutral-400" />
                Temperature
              </Label>
              <span className="text-xs font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
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
              className="h-2 p-0 border-0 shadow-none accent-neutral-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400">
              <span>Presisi (0)</span>
              <span>Seimbang (0.7)</span>
              <span>Kreatif (2.0)</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div className="space-y-2">
            <Label className="text-neutral-700 flex items-center gap-2">
              <Hash className="size-3.5 text-neutral-400" />
              Max Tokens
            </Label>
            <Input
              type="number"
              min={100}
              max={32000}
              step={100}
              value={localSettings.maxTokens}
              onChange={(e) => handleMaxTokensChange(e.target.value)}
              className="border-neutral-200 bg-white text-neutral-900 focus-visible:border-neutral-400 focus-visible:ring-neutral-200"
            />
            <p className="text-[11px] text-neutral-400">
              Jumlah maksimum token yang dihasilkan AI. Semakin besar, semakin
              panjang respons. (100–32.000)
            </p>
          </div>

          {/* System Prompt */}
          <div className="space-y-2">
            <Label className="text-neutral-700 flex items-center gap-2">
              <FileText className="size-3.5 text-neutral-400" />
              System Prompt
            </Label>
            <Textarea
              value={localSettings.systemPrompt}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  systemPrompt: e.target.value,
                }))
              }
              placeholder="Instruksi khusus untuk AI saat menghasilkan kode..."
              rows={4}
              className="border-neutral-200 bg-white text-neutral-900 text-sm placeholder:text-neutral-400 focus-visible:border-neutral-400 focus-visible:ring-neutral-200 resize-none"
            />
            <p className="text-[11px] text-neutral-400">
              Instruksi tambahan yang diberikan ke AI sebelum memproses
              permintaan. Misalnya: &quot;Gunakan Tailwind CSS dan komponen
              yang responsif.&quot;
            </p>
          </div>
        </div>

        <DialogFooter>
          {showSuccess ? (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="size-4" />
              Pengaturan berhasil disimpan
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              >
                Batal
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-neutral-900 text-white hover:bg-neutral-800"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
