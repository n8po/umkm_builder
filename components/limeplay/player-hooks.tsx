"use client"

import React from "react"

import { usePlaybackStates } from "@/hooks/limeplay/use-playback"
import { usePlayerStates } from "@/hooks/limeplay/use-player"

export const PlayerHooks = React.memo(() => {
  usePlayerStates()
  usePlaybackStates()

  return null
})

PlayerHooks.displayName = "PlayerHooks"
