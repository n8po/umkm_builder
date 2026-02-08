"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

export interface NativeButtonProps extends ButtonProps {
  children: ReactNode;
  loading?: boolean;
  glow?: boolean;
}

const NativeButton = ({
  className,
  variant = "default",
  size = "lg",
  children,
  loading = false,
  glow = false,
  disabled,
  asChild,
  ...props
}: NativeButtonProps) => {
  const shouldReduceMotion = useReducedMotion();

  const glassmorphismClassName = cn(
    "cursor-pointer relative overflow-hidden",
    !glow && "shadow-md hover:shadow-lg",
    glow &&
      "shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-[box-shadow,background-color,color,opacity] duration-200",
    variant === "outline" && "text-foreground/80 hover:bg-foreground/5",
    (disabled || loading) && "opacity-50 cursor-not-allowed grayscale",
    className
  );

  // When asChild is true, render Button without motion wrapper
  if (asChild) {
    return (
      <Button
        variant={variant}
        size={size}
        className={glassmorphismClassName}
        disabled={disabled || loading}
        aria-busy={loading}
        asChild
        {...props}
      >
        {children}
      </Button>
    );
  }

  // Normal rendering with motion wrapper
  return (
    <motion.div
      whileHover={
        !disabled && !loading && !shouldReduceMotion ? { scale: 1.05 } : {}
      }
      whileTap={
        !disabled && !loading && !shouldReduceMotion ? { scale: 0.95 } : {}
      }
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="inline-block w-fit"
    >
      {glow && !disabled && !loading && (
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500" />
      )}
      <Button
        variant={variant}
        size={size}
        className={glassmorphismClassName}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </Button>
    </motion.div>
  );
};

NativeButton.displayName = "NativeButton";

export { NativeButton };
