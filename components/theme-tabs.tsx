import { Theme } from "@/components/theme"

export function ThemeTabs() {
  return (
    <Theme
      variant="tabs"
      size="sm"
      themes={["light", "dark", "system"]}
    />
  )
}