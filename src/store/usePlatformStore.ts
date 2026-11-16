import { useState, useEffect, useCallback } from 'react'
import { TRACKS } from '../tracks/registry'
import type { ClassId, TrackId } from '../tracks/types'

export type ActiveClass = ClassId

interface PlatformState {
  activeTrack: TrackId | null
  activeClass: ClassId
  stationIndex: number
  timerSeconds: number
  isTimerRunning: boolean
  soundEnabled: boolean
  isPremilitarModalOpen: boolean
  completedStations: Record<string, boolean>
}

function getClassDef(trackId: TrackId | null, classId: ClassId) {
  if (!trackId) return null
  const track = TRACKS[trackId]
  return track.classes.find((c) => c.id === classId) ?? track.classes[0]
}

function clampStation(trackId: TrackId | null, classId: ClassId, idx: number): number {
  const cls = getClassDef(trackId, classId)
  const maxIdx = cls ? Math.max(0, cls.stations.length - 1) : 0
  return Math.max(0, Math.min(maxIdx, idx))
}

function readStateFromUrl(): Pick<PlatformState, 'activeTrack' | 'activeClass' | 'stationIndex' | 'timerSeconds'> {
  if (typeof window === 'undefined') {
    return { activeTrack: null, activeClass: 'class-1', stationIndex: 0, timerSeconds: 90 * 60 }
  }
  const params = new URLSearchParams(window.location.search)
  const rawTrack = params.get('t')
  const rawClass = params.get('c')
  const rawStation = Number.parseInt(params.get('s') ?? '0', 10)

  const activeTrack: TrackId | null =
    rawTrack === 'octavo' || rawTrack === 'segundo' ? rawTrack : null
  const activeClass: ClassId =
    rawClass === 'class-1' || rawClass === 'class-2' ? rawClass : 'class-1'
  const stationIndex = activeTrack && Number.isFinite(rawStation)
    ? clampStation(activeTrack, activeClass, rawStation)
    : 0
  const durationMin = getClassDef(activeTrack, activeClass)?.durationMin ?? 90

  return {
    activeTrack,
    activeClass,
    stationIndex,
    timerSeconds: durationMin * 60
  }
}

function syncUrlWithState(next: PlatformState, pushHistory = false) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (!next.activeTrack) {
    url.searchParams.delete('t')
    url.searchParams.delete('c')
    url.searchParams.delete('s')
  } else {
    url.searchParams.set('t', next.activeTrack)
    url.searchParams.set('c', next.activeClass)
    url.searchParams.set('s', String(next.stationIndex))
  }
  const targetUrl = `${url.pathname}${url.search}${url.hash}`
  if (`${window.location.pathname}${window.location.search}${window.location.hash}` === targetUrl) {
    return
  }
  if (pushHistory) {
    window.history.pushState(null, '', targetUrl)
  } else {
    window.history.replaceState(null, '', targetUrl)
  }
}

const initialUrlState = readStateFromUrl()

const DEFAULT_STATE: PlatformState = {
  ...initialUrlState,
  isTimerRunning: false,
  soundEnabled: true,
  isPremilitarModalOpen: false,
  completedStations: {}
}

let state: PlatformState = { ...DEFAULT_STATE }
const listeners = new Set<(s: PlatformState) => void>()

function notify(syncUrl = false, pushHistory = false) {
  if (syncUrl) {
    syncUrlWithState(state, pushHistory)
  }
  listeners.forEach((listener) => listener(state))
}

export function usePlatformStore() {
  const [currentState, setCurrentState] = useState<PlatformState>(state)

  useEffect(() => {
    listeners.add(setCurrentState)
    return () => {
      listeners.delete(setCurrentState)
    }
  }, [])

  const setTrack = useCallback((trackId: TrackId | null) => {
    const durationMin = getClassDef(trackId, 'class-1')?.durationMin ?? 90
    state = {
      ...state,
      activeTrack: trackId,
      activeClass: 'class-1',
      stationIndex: 0,
      timerSeconds: durationMin * 60,
      isTimerRunning: false
    }
    notify(true, true)
  }, [])

  const setActiveClass = useCallback((cls: ClassId) => {
    const durationMin = getClassDef(state.activeTrack, cls)?.durationMin ?? 90
    state = {
      ...state,
      activeClass: cls,
      stationIndex: 0,
      timerSeconds: durationMin * 60,
      isTimerRunning: false
    }
    notify(true, false)
  }, [])

  const goToStation = useCallback((idx: number) => {
    const clamped = clampStation(state.activeTrack, state.activeClass, idx)
    state = { ...state, stationIndex: clamped }
    notify(true, false)
  }, [])

  const nextStation = useCallback(() => {
    const cls = getClassDef(state.activeTrack, state.activeClass)
    const limit = cls ? cls.stations.length - 1 : 0
    if (state.stationIndex < limit) {
      const nextIdx = state.stationIndex + 1
      const key = `${state.activeTrack ?? 'none'}-${state.activeClass}-${state.stationIndex}`
      state = {
        ...state,
        stationIndex: nextIdx,
        completedStations: { ...state.completedStations, [key]: true }
      }
      notify(true, false)
    }
  }, [])

  const prevStation = useCallback(() => {
    if (state.stationIndex > 0) {
      state = { ...state, stationIndex: state.stationIndex - 1 }
      notify(true, false)
    }
  }, [])

  const toggleTimer = useCallback(() => {
    state = { ...state, isTimerRunning: !state.isTimerRunning }
    notify(false)
  }, [])

  const resetTimer = useCallback((minutes?: number) => {
    const fallback = getClassDef(state.activeTrack, state.activeClass)?.durationMin ?? 90
    const mins = minutes ?? fallback
    state = { ...state, timerSeconds: mins * 60, isTimerRunning: false }
    notify(false)
  }, [])

  const toggleSound = useCallback(() => {
    state = { ...state, soundEnabled: !state.soundEnabled }
    notify(false)
  }, [])

  const setPremilitarModal = useCallback((open: boolean) => {
    state = { ...state, isPremilitarModalOpen: open }
    notify(false)
  }, [])

  return {
    ...currentState,
    setTrack,
    setActiveClass,
    goToStation,
    nextStation,
    prevStation,
    toggleTimer,
    resetTimer,
    toggleSound,
    setPremilitarModal
  }
}

let timerInterval: ReturnType<typeof setInterval> | null = null
let popstateBound = false

export function initGlobalTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      if (state.isTimerRunning && state.timerSeconds > 0) {
        state = { ...state, timerSeconds: state.timerSeconds - 1 }
        notify(false)
      }
    }, 1000)
  }

  if (!popstateBound && typeof window !== 'undefined') {
    popstateBound = true
    window.addEventListener('popstate', () => {
      const nextUrlState = readStateFromUrl()
      state = {
        ...state,
        ...nextUrlState,
        isTimerRunning: false
      }
      notify(false)
    })
  }
}
