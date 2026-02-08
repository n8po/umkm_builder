import { create } from "zustand"

import type { CaptionsStore } from "@/hooks/limeplay/use-captions"
import type { PlaybackStore } from "@/hooks/limeplay/use-playback"
import type { PlaybackRateStore } from "@/hooks/limeplay/use-playback-rate"
import type { TimelineStore } from "@/hooks/limeplay/use-timeline"
import type { VolumeStore } from "@/hooks/limeplay/use-volume"

import { createCaptionsStore } from "@/hooks/limeplay/use-captions"
import { createPlaybackStore } from "@/hooks/limeplay/use-playback"
import { createPlaybackRateStore } from "@/hooks/limeplay/use-playback-rate"
import {
  createPlayerStore,
  type PlayerStore,
} from "@/hooks/limeplay/use-player"
import { createTimelineStore } from "@/hooks/limeplay/use-timeline"
import { createVolumeStore } from "@/hooks/limeplay/use-volume"

export interface CreateMediaStoreProps {
  debug?: boolean
}

export type TypeMediaStore = CaptionsStore &
  PlaybackRateStore &
  PlaybackStore &
  PlayerStore &
  TimelineStore &
  VolumeStore

export function createMediaStore(initProps?: Partial<CreateMediaStoreProps>) {
  const mediaStore = create<TypeMediaStore>()((...etc) => ({
    ...createPlaybackStore(...etc),
    ...createPlayerStore(...etc),
    ...createVolumeStore(...etc),
    ...createTimelineStore(...etc),
    ...createCaptionsStore(...etc),
    ...createPlaybackRateStore(...etc),

    ...initProps,
  }))
  return mediaStore
}
