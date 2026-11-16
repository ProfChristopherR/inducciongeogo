import React, { useEffect, useState } from 'react'
import {
  Box,
  Camera,
  Crosshair,
  Flame,
  Mountain,
  Pause,
  Play,
  RotateCcw,
  Sprout
} from 'lucide-react'

type MissionKey = 'sar' | 'ndvi' | 'topo'
type FeedType = 'rgb' | 'thermal' | 'ndvi' | 'photogrammetry'

interface MissionProfile {
  id: MissionKey
  label: string
  feed: FeedType
  drone: string
  sensor: string
  altitudeM: number
  speedMs: number
  pattern: string
  gimbalDefault: number
  rtkStatus: string
  waypoints: { x: number; y: number }[]
}

const MISSIONS: Record<MissionKey, MissionProfile> = {
  sar: {
    id: 'sar',
    label: 'Rescate SAR Nocturno',
    feed: 'thermal',
    drone: 'DJI Mavic 3 Enterprise Thermal (3T)',
    sensor: 'Cámara Térmica LWIR 640×512 + Zoom 56×',
    altitudeM: 50,
    speedMs: 6.5,
    pattern: 'Barrido paralelo de búsqueda nocturna',
    gimbalDefault: 45,
    rtkStatus: 'GNSS 26 SAT (GPS+GAL)',
    waypoints: [
      { x: 18, y: 78 },
      { x: 18, y: 24 },
      { x: 40, y: 24 },
      { x: 40, y: 78 },
      { x: 62, y: 78 },
      { x: 62, y: 24 },
      { x: 82, y: 24 }
    ]
  },
  ndvi: {
    id: 'ndvi',
    label: 'Mapeo Agrícola NDVI',
    feed: 'ndvi',
    drone: 'DJI Mavic 3 Multispectral (3M)',
    sensor: '4 Bandas (G, R, RE, NIR) + Sensor Solar',
    altitudeM: 80,
    speedMs: 9.0,
    pattern: 'Grilla simple constante (traslape 80%/70%)',
    gimbalDefault: 90,
    rtkStatus: 'RTK FIX (±1.5 cm)',
    waypoints: [
      { x: 16, y: 22 },
      { x: 84, y: 22 },
      { x: 84, y: 42 },
      { x: 16, y: 42 },
      { x: 16, y: 62 },
      { x: 84, y: 62 },
      { x: 84, y: 80 }
    ]
  },
  topo: {
    id: 'topo',
    label: 'Topografía RTK & MDE',
    feed: 'photogrammetry',
    drone: 'DJI Phantom 4 Pro / RTK',
    sensor: 'CMOS 1" 20 MP Obturador Mecánico + RTK',
    altitudeM: 65,
    speedMs: 7.5,
    pattern: 'Doble grilla cruzada con GCP en terreno',
    gimbalDefault: 75,
    rtkStatus: 'RTK FIX (±1.0 cm)',
    waypoints: [
      { x: 20, y: 20 },
      { x: 20, y: 80 },
      { x: 45, y: 80 },
      { x: 45, y: 20 },
      { x: 75, y: 20 },
      { x: 75, y: 80 },
      { x: 20, y: 50 },
      { x: 80, y: 50 }
    ]
  }
}

function interpolateWaypoints(pts: { x: number; y: number }[], progress01: number) {
  if (pts.length < 2) return pts[0] ?? { x: 50, y: 50 }
  const totalSegs = pts.length - 1
  const scaled = Math.max(0, Math.min(totalSegs - 0.0001, progress01 * totalSegs))
  const segIdx = Math.floor(scaled)
  const localT = scaled - segIdx
  const a = pts[segIdx]
  const b = pts[segIdx + 1]
  return {
    x: a.x + (b.x - a.x) * localT,
    y: a.y + (b.y - a.y) * localT
  }
}

export const TelemetryHud: React.FC = () => {
  const [missionKey, setMissionKey] = useState<MissionKey>('sar')
  const [activeFeed, setActiveFeed] = useState<FeedType>('thermal')
  const [gimbalPitch, setGimbalPitch] = useState<number>(45)
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [missionPct, setMissionPct] = useState<number>(28)

  const mission = MISSIONS[missionKey]

  const handleSelectMission = (key: MissionKey) => {
    const next = MISSIONS[key]
    setMissionKey(key)
    setActiveFeed(next.feed)
    setGimbalPitch(next.gimbalDefault)
    setMissionPct(0)
    setIsPlaying(true)
  }

  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setMissionPct((prev) => (prev >= 100 ? 0 : prev + 1))
    }, 140)
    return () => clearInterval(timer)
  }, [isPlaying])

  const dronePos = interpolateWaypoints(mission.waypoints, missionPct / 100)
  const batteryPct = Math.max(42, Math.round(96 - missionPct * 0.34))
  const photosCaptured = Math.round((missionPct / 100) * (missionKey === 'topo' ? 420 : missionKey === 'ndvi' ? 280 : 120))
  const currentAlt = missionPct === 0 ? 0 : mission.altitudeM

  return (
    <div className="space-y-5">
      {/* Mission Recommender Strip */}
      <div className="apple-glass rounded-3xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">
              Planificador Inteligente de Misión • Flota 4° Medio
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              Selecciona Objetivo para Configurar Dron, Patrón y Telemetría OSD
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {(Object.values(MISSIONS) as MissionProfile[]).map((m) => (
              <button
                key={m.id}
                onClick={() => handleSelectMission(m.id)}
                className={`rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all active:scale-[0.98] ${
                  missionKey === m.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white/85 border border-slate-200/80 text-slate-800 hover:bg-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Mission Parameters */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div className="rounded-2xl bg-white/85 border border-slate-200/75 p-3">
            <span className="text-xs text-slate-500 font-semibold block">Dron Recomendado</span>
            <strong className="text-slate-900 font-extrabold">{mission.drone}</strong>
          </div>
          <div className="rounded-2xl bg-white/85 border border-slate-200/75 p-3">
            <span className="text-xs text-slate-500 font-semibold block">Carga Útil / Sensor</span>
            <strong className="text-slate-900 font-extrabold">{mission.sensor}</strong>
          </div>
          <div className="rounded-2xl bg-white/85 border border-slate-200/75 p-3">
            <span className="text-xs text-slate-500 font-semibold block">Altura &amp; Velocidad</span>
            <strong className="font-mono text-blue-700 font-extrabold">
              {mission.altitudeM} m AGL · {mission.speedMs} m/s
            </strong>
          </div>
          <div className="rounded-2xl bg-white/85 border border-slate-200/75 p-3">
            <span className="text-xs text-slate-500 font-semibold block">Patrón de Vuelo</span>
            <strong className="text-slate-900 font-extrabold">{mission.pattern}</strong>
          </div>
        </div>
      </div>

      {/* Feed Switcher + Playback Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 rounded-2xl bg-slate-900/5 p-1.5 border border-slate-900/10">
          <button
            onClick={() => setActiveFeed('rgb')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              activeFeed === 'rgb'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Camera className="size-3.5" />
            <span>Óptica RGB</span>
          </button>

          <button
            onClick={() => setActiveFeed('thermal')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              activeFeed === 'thermal'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Flame className="size-3.5" />
            <span>Mavic 3T Térmica</span>
          </button>

          <button
            onClick={() => setActiveFeed('ndvi')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              activeFeed === 'ndvi'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Sprout className="size-3.5" />
            <span>Mavic 3M NDVI</span>
          </button>

          <button
            onClick={() => setActiveFeed('photogrammetry')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              activeFeed === 'photogrammetry'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Box className="size-3.5" />
            <span>Topografía / 3D</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="apple-glass hover:bg-white rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 inline-flex items-center gap-1.5"
          >
            {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            <span>{isPlaying ? 'Pausar Misión' : 'Reproducir Misión'}</span>
          </button>
          <button
            onClick={() => {
              setMissionPct(0)
              setIsPlaying(true)
            }}
            className="apple-glass hover:bg-white rounded-xl p-2 text-slate-700"
            title="Reiniciar recorrido"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>
      </div>

      {/* Main OSD Screen */}
      <div className="relative aspect-video w-full rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        {/* Top Telemetry OSD */}
        <div className="absolute top-0 inset-x-0 z-20 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 px-4 py-2.5 text-xs font-mono text-white backdrop-blur-sm border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1.5 font-bold text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              {mission.rtkStatus}
            </span>
            <span>ALT: <strong className="text-sky-400">{currentAlt} m</strong></span>
            <span>VEL: <strong>{mission.speedMs} m/s</strong></span>
            <span>BAT: <strong className="text-emerald-400">{batteryPct}%</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <span>CAPTURAS: <strong className="text-amber-300">{photosCaptured}</strong></span>
            <span>GIMBAL: <strong className="text-cyan-300">−{gimbalPitch}&deg;</strong></span>
            <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">
              PROGRESO {missionPct}%
            </span>
          </div>
        </div>

        {/* Center Display */}
        <div className="relative h-full w-full flex items-center justify-center pt-10 pb-12">
          {activeFeed === 'rgb' && (
            <div className="h-full w-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-6">
              <div className="text-center space-y-2 text-white max-w-md">
                <Camera className="size-10 text-slate-300 mx-auto" />
                <h4 className="text-base font-extrabold">Cámara Óptica RGB 4K • Inspección Visual</h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  Muestra detalle estructural y verificación visual directa durante la trayectoria autónoma.
                </p>
              </div>
            </div>
          )}

          {activeFeed === 'thermal' && (
            <div className="relative h-full w-full bg-gradient-to-br from-slate-950 via-red-950 to-amber-950 flex items-center justify-center overflow-hidden">
              <div className="absolute left-[22%] top-[44%] rounded-xl border border-amber-400 bg-red-500/30 px-2.5 py-1.5 text-center text-white">
                <span className="font-mono text-xs font-extrabold text-amber-300 block">36.8°C</span>
                <span className="text-[10px] font-bold uppercase">Objetivo A</span>
              </div>
              <div className="absolute right-[24%] top-[48%] rounded-xl border border-amber-400 bg-red-500/30 px-2.5 py-1.5 text-center text-white">
                <span className="font-mono text-xs font-extrabold text-amber-300 block">37.1°C</span>
                <span className="text-[10px] font-bold uppercase">Objetivo B</span>
              </div>
              <div className="text-center space-y-1.5 z-10 bg-black/65 p-4 rounded-2xl backdrop-blur-sm border border-red-500/40 text-white max-w-md mx-4">
                <div className="flex items-center justify-center gap-1.5 text-sm font-extrabold text-red-400 uppercase">
                  <Flame className="size-4" />
                  <span>Mavic 3T • Telemetría Radiométrica SAR</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200">
                  Detección de firmas térmicas humanas en barrido nocturno a {mission.altitudeM} m AGL.
                </p>
              </div>
            </div>
          )}

          {activeFeed === 'ndvi' && (
            <div className="relative h-full w-full bg-gradient-to-br from-emerald-950 via-lime-950 to-slate-950 flex items-center justify-center overflow-hidden">
              <div className="text-center space-y-1.5 z-10 bg-black/65 p-4 rounded-2xl backdrop-blur-sm border border-emerald-500/40 text-white max-w-md mx-4">
                <div className="flex items-center justify-center gap-1.5 text-sm font-extrabold text-emerald-400 uppercase">
                  <Sprout className="size-4" />
                  <span>Mavic 3M • Captura Multiespectral NDVI</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200">
                  Calibrando bandas Rojo y NIR con sensor de irradiancia solar para mapa de vigor agrícola.
                </p>
              </div>
            </div>
          )}

          {activeFeed === 'photogrammetry' && (
            <div className="relative h-full w-full bg-slate-950 flex items-center justify-center">
              <div className="text-center space-y-1.5 z-10 bg-slate-900/90 p-5 rounded-2xl border border-sky-500/40 text-white max-w-md mx-4">
                <div className="flex items-center justify-center gap-1.5 text-sm font-extrabold text-sky-400 uppercase">
                  <Mountain className="size-4" />
                  <span>Phantom 4 RTK • Captura Topográfica</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200">
                  Disparando obturador mecánico cada 2.2 s con enlace RTK FIX para MDE y curvas de nivel.
                </p>
              </div>
            </div>
          )}

          {/* Mini-Map Picture-in-Picture (Bottom Left) showing Animated Flight Grid */}
          <div className="absolute left-4 bottom-14 z-20 w-44 sm:w-52 rounded-2xl bg-slate-900/90 border border-white/20 p-2 backdrop-blur-md">
            <div className="text-[10px] font-mono text-slate-300 flex justify-between mb-1">
              <span>MAPA TÁCTICO</span>
              <span className="text-emerald-400">AUTÓNOMO</span>
            </div>
            <svg viewBox="0 0 100 100" className="w-full h-24 bg-slate-950 rounded-xl border border-white/10">
              <polyline
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="3 2"
                points={mission.waypoints.map((p) => `${p.x},${p.y}`).join(' ')}
              />
              <circle cx={mission.waypoints[0].x} cy={mission.waypoints[0].y} r="3.5" fill="#10b981" />
              <circle cx={dronePos.x} cy={dronePos.y} r="4.5" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Crosshair className="size-14 text-white/25" />
          </div>
        </div>

        {/* Bottom Gimbal Slider */}
        <div className="absolute bottom-2 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-900/90 px-4 py-2 border border-slate-800 text-xs text-white">
          <span className="font-bold">Ángulo Cámara (Gimbal): −{gimbalPitch}&deg;</span>
          <div className="flex items-center gap-3 w-full sm:w-1/2">
            <span className="text-[11px] text-slate-400">0&deg; (Frente)</span>
            <input
              type="range"
              min={0}
              max={90}
              step={5}
              value={gimbalPitch}
              onChange={(e) => setGimbalPitch(Number(e.target.value))}
              className="flex-1 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400">−90&deg; (Nadir)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
