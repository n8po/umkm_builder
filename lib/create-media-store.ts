import { create } from "zustand"

import type { PlaybackStore } from "@/hooks/limeplay/use-playback"
import type { PlayerStore } from "@/hooks/limeplay/use-player"

import { createPlaybackStore } from "@/hooks/limeplay/use-playback"
import { createPlayerStore } from "@/hooks/limeplay/use-player"

export interface CreateMediaStoreProps {
  debug?: boolean
}

export type TypeMediaStore = PlaybackStore & PlayerStore & {}

export function createMediaStore(initProps?: Partial<CreateMediaStoreProps>) {
  const mediaStore = create<TypeMediaStore>()((...etc) => ({
    ...createPlaybackStore(...etc),
    ...createPlayerStore(...etc),
    ...initProps,
  }))
  return mediaStore
}
