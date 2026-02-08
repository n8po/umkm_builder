"use client"

import React from "react"

import { useCaptionsStates } from "@/hooks/limeplay/use-captions"
import { usePictureInPictureStates } from "@/hooks/limeplay/use-picture-in-picture"
import { usePlaybackStates } from "@/hooks/limeplay/use-playback"
import { usePlaybackRateStates } from "@/hooks/limeplay/use-playback-rate"
import { usePlayerStates } from "@/hooks/limeplay/use-player"
import { usePlaylistStates } from "@/hooks/limeplay/use-playlist"
import { useTimelineStates } from "@/hooks/limeplay/use-timeline"
import { useVolumeStates } from "@/hooks/limeplay/use-volume"

export const PlayerHooks = React.memo(() => {
  usePlayerStates()
  usePlaybackStates()
  useTimelineStates()
  useVolumeStates()
  useCaptionsStates()
  usePlaybackRateStates()
  usePlaylistStates()
  usePictureInPictureStates()

  return null
})

PlayerHooks.displayName = "PlayerHooks"
