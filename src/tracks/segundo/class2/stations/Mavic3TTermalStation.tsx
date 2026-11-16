import React, { useRef, useState } from 'react'
import { Crosshair, Flame, MoveHorizontal, Thermometer } from 'lucide-react'
import { SafeMediaImage } from '../../components/SafeMediaImage'

type ThermalPalette = 'ironbow' | 'white-hot' | 'black-hot'

interface SpotTarget {
  id: string
  label: string
  tempC: number
  xPct: number
  yPct: number
  rgbNote: string
  thermalNote: string
}

const SPOT_TARGETS: SpotTarget[] = [
  {
    id: 'person',
    label: 'Persona Extraviada (SAR)',
    tempC: 36.8,
    xPct: 51,
    yPct: 54,
    rgbNote: 'Oculta por sombra nocturna y camuflaje entre matorrales.',
    thermalNote: 'Brilla con máxima emisividad térmica (~36.8 °C) frente al suelo frío.'
  },
  {
    id: 'canopy',
    label: 'Copa de Árbol Nocturna',
    tempC: 11.4,
    xPct: 24,
    yPct: 35,
    rgbNote: 'Silueta oscura indistinguible sin iluminación artificial.',
    thermalNote: 'Equilibrio térmico ambiental (~11 °C): aparece en tonos fríos.'
  },
  {
    id: 'rock',
    label: 'Roca Expuesta (Calor Residual)',
    tempC: 18.6,
    xPct: 76,
    yPct: 68,
    rgbNote: 'Superficie gris tenue apenas visible en penumbra.',
    thermalNote: 'Conserva inercia térmica solar del día (+7 °C sobre el entorno).'
  },
  {
    id: 'stream',
    label: 'Humedal / Quebrada',
    tempC: 8.9,
    xPct: 32,
    yPct: 78,
    rgbNote: 'Superficie oscura sin contraste en espectro visible.',
    thermalNote: 'Alta capacidad calorífica del agua la mantiene como firma más fría.'
  }
]

const PALETTES: { id: ThermalPalette; label: string; filter: string; gradient: string }[] = [
  {
    id: 'ironbow',
    label: 'Ironbow (Calor Clásico)',
    filter: 'contrast(1.12) saturate(1.2)',
    gradient: 'from-blue-900 via-red-600 to-amber-300'
  },
  {
    id: 'white-hot',
    label: 'White-Hot (Blanco Caliente)',
    filter: 'grayscale(100%) contrast(1.4) brightness(1.06)',
    gradient: 'from-slate-950 via-slate-500 to-white'
  },
  {
    id: 'black-hot',
    label: 'Black-Hot (Negro Caliente)',
    filter: 'grayscale(100%) invert(100%) contrast(1.3)',
    gradient: 'from-white via-slate-500 to-slate-950'
  }
]

export const Mavic3TTermalStation: React.FC = () => {
  const [curtainPct, setCurtainPct] = useState<number>(48)
  const [palette, setPalette] = useState<ThermalPalette>('ironbow')
  const [selectedTargetId, setSelectedTargetId] = useState<string>('person')

  const stageRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef<boolean>(false)

  const activePalette = PALETTES.find((p) => p.id === palette) ?? PALETTES[0]
  const activeTarget = SPOT_TARGETS.find((t) => t.id === selectedTargetId) ?? SPOT_TARGETS[0]

  const updateCurtainFromPointer = (clientX: number) => {
    const el = stageRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setCurtainPct(Math.max(4, Math.min(96, Math.round(pct))))
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Allow clicking hotspot buttons without hijacking drag immediately unless dragging handle/stage
    if ((e.target as HTMLElement).closest('button[data-hotspot="true"]')) return
    e.preventDefault()
    stageRef.current?.setPointerCapture(e.pointerId)
    draggingRef.current = true
    updateCurtainFromPointer(e.clientX)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    updateCurtainFromPointer(e.clientX)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    if (stageRef.current?.hasPointerCapture(e.pointerId)) {
      stageRef.current.releasePointerCapture(e.pointerId)
    }
  }

  return (
    <section aria-labelledby="seg-c2-st1-title" className="space-y-6">
      {/* Header + Palette Selector */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h2
            id="seg-c2-st1-title"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900"
          >
            Mavic 3T: Comparador RGB ↔ Térmico LWIR
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
            Desliza la cortina sobre la escena de búsqueda y rescate: a la izquierda ves luz visible nocturna (RGB); a la derecha, radiación infrarroja lejana capturada por el sensor térmico.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 rounded-2xl bg-slate-900/5 p-1.5 border border-slate-900/10 shrink-0">
          {PALETTES.map((p) => (
            <button
              key={p.id}
              onClick={() => setPalette(p.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                palette === p.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white/80'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Comparator + Radiometric Physics */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left: Interactive Curtain Stage (8 cols) */}
        <div className="lg:col-span-8 apple-glass-dark rounded-3xl p-3 sm:p-4 space-y-3">
          <div
            ref={stageRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 select-none touch-none cursor-ew-resize"
          >
            {/* Base Thermal Layer (Full Frame, revealed on the right side) */}
            <div className="absolute inset-0" style={{ filter: activePalette.filter }}>
              <SafeMediaImage mediaKey="thermalSensorSar" fallbackKey="grade4Geomatica" />
            </div>

            {/* Simulated Visible-Light Night/Twilight Canopy Layer (Clipped to Left 0..curtainPct) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - curtainPct}% 0 0)` }}
            >
              <div
                className="size-full"
                style={{
                  filter: 'brightness(0.32) contrast(0.95) saturate(0.35) hue-rotate(115deg)'
                }}
              >
                <SafeMediaImage mediaKey="thermalSensorSar" fallbackKey="grade4Geomatica" />
              </div>
              <div className="absolute inset-0 bg-emerald-950/45 mix-blend-multiply" />
            </div>

            {/* Spot Temperature Hotspots */}
            {SPOT_TARGETS.map((t) => {
              const isSelected = t.id === selectedTargetId
              const isThermalVisible = t.xPct >= curtainPct
              return (
                <button
                  key={t.id}
                  data-hotspot="true"
                  onClick={() => setSelectedTargetId(t.id)}
                  style={{ left: `${t.xPct}%`, top: `${t.yPct}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-mono font-bold transition-transform hover:scale-105 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-white shadow-lg scale-105'
                      : 'bg-slate-900/80 text-white border border-white/30'
                  }`}
                >
                  <Crosshair className="size-3.5" />
                  <span>{isThermalVisible ? `${t.tempC.toFixed(1)}°C` : 'RGB ?'}</span>
                </button>
              )
            })}

            {/* Top Left / Right Mode Labels */}
            <div className="pointer-events-none absolute top-3 left-3 z-20 rounded-full bg-slate-900/85 border border-white/20 px-3 py-1 text-xs font-bold text-slate-200 backdrop-blur-md">
              Óptico Visible (RGB)
            </div>
            <div className="pointer-events-none absolute top-3 right-3 z-20 rounded-full bg-red-600/90 border border-white/25 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
              Térmico LWIR • {activePalette.label.split(' ')[0]}
            </div>

            {/* Temperature Gradient Scale Bar on Right Edge */}
            <div className="pointer-events-none absolute right-3 top-14 bottom-12 w-4 rounded-full border border-white/30 overflow-hidden z-20 flex flex-col justify-between items-center py-1 text-[10px] font-mono font-bold text-white">
              <div className={`absolute inset-0 bg-gradient-to-t ${activePalette.gradient} opacity-90`} />
              <span className="relative z-10 drop-shadow">40°</span>
              <span className="relative z-10 drop-shadow">20°</span>
              <span className="relative z-10 drop-shadow">8°</span>
            </div>

            {/* Curtain Divider Line & Handle */}
            <div
              className="pointer-events-none absolute inset-y-0 z-30 w-0.5 bg-white shadow-[0_0_16px_rgba(255,255,255,0.9)]"
              style={{ left: `${curtainPct}%` }}
            >
              <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 size-10 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center border-2 border-slate-900/20">
                <MoveHorizontal className="size-5" />
              </div>
            </div>
          </div>

          {/* Keyboard / Projector Accessible Range Control */}
          <div className="flex items-center justify-between gap-4 px-2 text-xs text-slate-300">
            <span className="font-semibold">Posición de cortina ({curtainPct}% RGB / {100 - curtainPct}% Térmico)</span>
            <input
              type="range"
              min={4}
              max={96}
              value={curtainPct}
              onChange={(e) => setCurtainPct(Number(e.target.value))}
              className="w-44 sm:w-64"
            />
          </div>
        </div>

        {/* Right: Spot Readout + LWIR Physics (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Spot Radiometer Card */}
          <div className="apple-glass rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-700">
                <Thermometer className="size-4" />
                Lectura Puntual (Spot Meter)
              </span>
              <span className="font-mono text-xs font-bold text-slate-500">±2 °C (ref. 3T)</span>
            </div>

            <div className="rounded-2xl bg-slate-900 text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Objetivo Seleccionado</span>
                <strong className="text-base font-extrabold">{activeTarget.label}</strong>
              </div>
              <span className="font-mono text-2xl font-extrabold text-amber-400">
                {activeTarget.tempC.toFixed(1)} °C
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="rounded-2xl bg-white/80 border border-slate-200/75 p-3">
                <span className="text-xs font-bold text-slate-500 block">En cámara RGB:</span>
                <p className="text-slate-800 font-medium">{activeTarget.rgbNote}</p>
              </div>
              <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-3">
                <span className="text-xs font-bold text-red-800 block">En cámara Térmica LWIR:</span>
                <p className="text-slate-900 font-semibold">{activeTarget.thermalNote}</p>
              </div>
            </div>
          </div>

          {/* LWIR Physics Explanation */}
          <div className="apple-glass rounded-3xl p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
              <Flame className="size-4 text-red-600" />
              <span>¿Qué detecta el Infrarrojo Lejano (LWIR)?</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              Las cámaras RGB necesitan <strong>luz solar reflejada</strong> (0.4–0.7 µm). El sensor del Mavic 3T mide radiación térmica <strong>emitida directamente</strong> por todo cuerpo sobre 0 K en la banda <strong>LWIR (8–14 µm)</strong>: a mayor temperatura, mayor energía radiada.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
