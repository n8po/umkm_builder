"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Monitor,
  Moon, 
  Sun,
  Sunset,
  Trees,
  Waves,
  Smartphone,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useMediaQuery } from "@/hooks/use-media-query"

import { cn } from "@/lib/utils"

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
  sunset: Sunset,
  ocean: Waves,
  forest: Trees,
}

export type ThemeToggleVariant =
  | "button"
  | "switch"
  | "dropdown"
  | "tabs" 
  | "grid"
  | "radial"  
  | "cards" 
export type ThemeToggleSize = "sm" | "md" | "lg"

interface ThemeToggleProps {
  variant?: ThemeToggleVariant
  size?: ThemeToggleSize
  showLabel?: boolean
  themes?: Theme[]
  className?: string
}

export function Theme({
  variant = "button",
  size = "md",
  showLabel = false,
  themes = ["light", "dark", "system"],
  className,
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  const { isMobile } = useMediaQuery() // Always call at top level

  // Mount detection for SSR hydration - using startTransition to avoid compiler warning
  useEffect(() => {
    React.startTransition(() => {
      setIsMounted(true)
    })
  }, [])

  const sizeClasses = {
    sm: "h-8 px-2 text-xs",
    md: "h-10 px-3 text-sm",
    lg: "h-12 px-4 text-base",
  }

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  }

  if (!isMounted) {
    return <div className="h-8 w-16" />
  }

  if (variant === "button") {
    function isTheme(value: unknown): value is Theme {
      return (
        typeof value === "string" && ["light", "dark", "system"].includes(value)
      )
    }

    const safeTheme: Theme =
      isTheme(theme) && themes.includes(theme) ? theme : "light"

    const nextTheme = themes[(themes.indexOf(safeTheme) + 1) % themes.length]
    const Icon = themeIcons[safeTheme]

    return (
      <motion.button
        onClick={() => setTheme(nextTheme)}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg border transition-all duration-200",
          "border-border bg-card text-foreground",
          "hover:scale-105 hover:bg-muted active:scale-95",
          sizeClasses[size],
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          key={safeTheme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Icon size={iconSizes[size]} />
        </motion.div>
        {showLabel && (
          <span className="font-medium">{themeConfigs[safeTheme].label}</span>
        )}
      </motion.button>
    )
  }

  if (variant === "switch") {
    const isLight = theme === "light"

    return (
      <motion.button
        onClick={() => setTheme(isLight ? "dark" : "light")}
        className={cn(
          "relative inline-flex items-center rounded-full border-2 transition-all duration-300",
          "border-border bg-muted",
          size === "sm"
            ? "h-6 w-11"
            : size === "md"
              ? "h-7 w-13"
              : "h-8 w-15",
          className
        )}
      >
        <motion.div
          className={cn(
            "inline-flex items-center justify-center rounded-full shadow-lg bg-primary",
            size === "sm" ? "h-4 w-4" : size === "md" ? "h-5 w-5" : "h-6 w-6"
          )}
          animate={{
            x: isLight ? 2 : size === "sm" ? 24 : size === "md" ? 26 : 30,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <motion.div
            key={theme}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isLight ? (
              <Sun
                size={size === "sm" ? 10 : size === "md" ? 12 : 14}
                className="text-primary-foreground"
              />
            ) : (
              <Moon
                size={size === "sm" ? 10 : size === "md" ? 12 : 14}
                className="text-primary-foreground"
              />
            )}
          </motion.div>
        </motion.div>
      </motion.button>
    )
  }

  if (variant === "tabs") {
    
    return (
      <div
        className={cn(
          "relative flex h-8 rounded-full bg-background p-1 ring-1 ring-border",
          className
        )}
      >
        {themes.map((themeOption) => {
          // Use Smartphone icon on mobile for system theme, Monitor on desktop
          const Icon = themeOption === "system" && isMobile 
            ? Smartphone 
            : themeIcons[themeOption]
          const isSelected = theme === themeOption

          return (
            <button
              type="button"
              key={themeOption}
              className="relative h-6 w-6 rounded-full"
              onClick={() => setTheme(themeOption)}
              aria-label={`${themeConfigs[themeOption].label} theme`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeTheme"
                  className={cn(
                    "absolute inset-0 rounded-full",
                    themeOption === "light" && "bg-white",
                    themeOption === "dark" && "bg-gray-800",
                    themeOption === "system" && "bg-blue-800"
                  )}
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <Icon
                className={cn(
                  "relative m-auto h-4 w-4",
                  isSelected && themeOption === "light" && "text-gray-700",
                  isSelected && themeOption === "dark" && "text-white",
                  isSelected && themeOption === "system" && "text-white",
                  !isSelected && "text-muted-foreground"
                )}
              />
            </button>
          )
        })}
      </div>
    )
  }

  return null
}

export type Theme = "light" | "dark" | "system"

export type ThemeConfig = {
  name: string
  label: string
  colors: {
    background: string
    foreground: string
    primary: string
    secondary: string
    accent: string
    muted: string
    border: string
    card: string
  }
}

export const themeConfigs: Record<Theme, ThemeConfig> = {
  light: {
    name: "light",
    label: "Light",
    colors: {
      background: "#ffffff",
      foreground: "#0f172a",
      primary: "#3b82f6",
      secondary: "#64748b",
      accent: "#f59e0b",
      muted: "#f8fafc",
      border: "#e2e8f0",
      card: "#ffffff",
    },
  },
  dark: {
    name: "dark",
    label: "Dark",
    colors: {
      background: "#0f172a",
      foreground: "#f8fafc",
      primary: "#60a5fa",
      secondary: "#94a3b8",
      accent: "#fbbf24",
      muted: "#1e293b",
      border: "#334155",
      card: "#1e293b",
    },
  },
  system: {
    name: "system",
    label: "System",
    colors: {
      background: "#ffffff",
      foreground: "#0f172a",
      primary: "#3b82f6",
      secondary: "#64748b",
      accent: "#f59e0b",
      muted: "#f8fafc",
      border: "#e2e8f0",
      card: "#ffffff",
    },
  },
}
