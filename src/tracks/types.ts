import type React from 'react'

export type TrackId = 'octavo' | 'segundo'
export type ClassId = 'class-1' | 'class-2'

export interface StationDef {
  id: string
  title: string
  minutes: string
  Component: React.ComponentType
}

export interface ClassDef {
  id: ClassId
  label: string
  durationMin: number
  stations: StationDef[]
}

export interface TrackDef {
  id: TrackId
  label: string
  tagline: string
  decisionQuestion: string
  heroMediaKey: string
  classes: [ClassDef, ClassDef]
}

