"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Code2, Layers, Wand2 } from "lucide-react";
import type { GenerationStep } from "./types";

interface GenerationProgressProps {
  isGenerating: boolean;
}

const STEPS: {
  key: GenerationStep;
  label: string;
  icon: React.ElementType;
  duration: number; // approximate seconds for this step
}[] = [
  { key: "analyzing", label: "Memahami permintaan...", icon: Sparkles, duration: 8 },
  { key: "structuring", label: "Membuat struktur website...", icon: Layers, duration: 14 },
  { key: "writing", label: "Menulis kode...", icon: Code2, duration: 25 },
  { key: "done", label: "Menyelesaikan...", icon: Wand2, duration: 5 },
];

const TOTAL_DURATION = STEPS.reduce((a, s) => a + s.duration, 0); // ~52s

function useElapsed(active: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (active) {
      startRef.current = Date.now();
      setElapsed(0);

      const tick = () => {
        setElapsed(Math.floor((Date.now() - startRef.current!) / 1000));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
      setElapsed(0);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  return elapsed;
}

function fmt(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export function GenerationProgress({ isGenerating }: GenerationProgressProps) {
  const elapsed = useElapsed(isGenerating);

  // Determine current step from elapsed time
  let accumulated = 0;
  let currentStepIdx = 0;
  let stepProgress = 0;

  for (let i = 0; i < STEPS.length; i++) {
    if (elapsed < accumulated + STEPS[i].duration) {
      currentStepIdx = i;
      stepProgress = (elapsed - accumulated) / STEPS[i].duration;
      break;
    }
    accumulated += STEPS[i].duration;
    currentStepIdx = STEPS.length - 1;
    stepProgress = 1;
  }

  const overallProgress = Math.min(
    ((elapsed / TOTAL_DURATION) * 100),
    97 // never show 100% until done
  );

  return (
    <AnimatePresence>
      {isGenerating && (
        <motion.div
          key="gen-progress"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm"
        >
          {/* Shimmer card skeletons in background */}
          <div className="absolute inset-0 p-8 overflow-hidden pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="mb-4 rounded-2xl overflow-hidden bg-neutral-100"
                style={{ height: i === 0 ? 80 : i === 1 ? 200 : 120 }}
              >
                <div className="h-full w-full animate-shimmer bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 bg-[length:400%_100%]" />
              </div>
            ))}
          </div>

          {/* Main progress card */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative z-10 w-full max-w-sm mx-4 bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden"
          >
            {/* Gradient top bar — blue accent sesuai landing page */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-sky-400" />

            <div className="p-6">
              {/* Icon + title */}
              <div className="flex items-center gap-3 mb-5">
                <div className="relative flex size-10 items-center justify-center rounded-xl bg-neutral-900 shadow-md">
                  <Sparkles className="size-5 text-white" />
                  {/* Pulse ring */}
                  <span className="absolute inset-0 rounded-xl animate-ping bg-neutral-600 opacity-20" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">Sedang membuat website</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Mohon tunggu sebentar...</p>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-2 mb-5">
                {STEPS.map((step, i) => {
                  const StepIcon = step.icon;
                  const isDone = i < currentStepIdx;
                  const isCurrent = i === currentStepIdx;
                  const isPending = i > currentStepIdx;

                  return (
                    <div key={step.key} className="flex items-center gap-3">
                      <div
                        className={`flex size-6 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                          isDone
                            ? "bg-emerald-100 text-emerald-600"
                            : isCurrent
                            ? "bg-blue-50 text-blue-600"
                            : "bg-neutral-100 text-neutral-300"
                        }`}
                      >
                        {isDone ? (
                          <svg className="size-3" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <StepIcon className="size-3" />
                        )}
                      </div>
                      <span
                        className={`text-xs transition-all duration-300 ${
                          isDone
                            ? "text-neutral-400 line-through decoration-neutral-300"
                            : isCurrent
                            ? "text-neutral-800 font-medium"
                            : "text-neutral-300"
                        }`}
                      >
                        {step.label}
                      </span>
                      {isCurrent && (
                        <span className="ml-auto flex gap-0.5">
                          {[0, 1, 2].map((dot) => (
                            <span
                              key={dot}
                              className="size-1 rounded-full bg-blue-400 animate-bounce"
                              style={{ animationDelay: `${dot * 150}ms` }}
                            />
                          ))}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-400 font-mono">{fmt(elapsed)}</span>
                  <span className="text-xs font-semibold text-blue-600">
                    {Math.round(overallProgress)}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-400"
                    initial={{ width: "0%" }}
                    animate={{ width: `${overallProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
