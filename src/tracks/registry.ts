import type { TrackDef, TrackId } from './types'
import { octavoTrack } from './octavo'
import { segundoTrack } from './segundo'

export const TRACKS: Record<TrackId, TrackDef> = {
  octavo: octavoTrack,
  segundo: segundoTrack
}

export const TRACK_LIST: TrackDef[] = [octavoTrack, segundoTrack]

