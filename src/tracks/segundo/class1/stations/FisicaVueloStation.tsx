import React, { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, Gauge, RotateCcw, RotateCw, Scale } from 'lucide-react'

type ManeuverMode =
  | 'neutral'
  | 'roll-left'
  | 'roll-right'
  | 'pitch-forward'
  | 'pitch-back'
  | 'yaw-left'
  | 'yaw-right'

interface ManeuverSpec {
  id: ManeuverMode
  label: string
  axisLabel: string
  /** Differential adjustments for [M1(FR-CCW), M2(RR-CW), M3(RL-CCW), M4(FL-CW)] in % */
  deltas: [number, number, number, number]
  rollDeg: number
  pitchDeg: number
  yawRate: number
  explanation: string
}

const MANEUVERS: Record<ManeuverMode, ManeuverSpec> = {
  neutral: {
    id: 'neutral',
    label: 'Equilibrio (Hover)',
    axisLabel: 'Empuje simétrico',
    deltas: [0, 0, 0, 0],
    rollDeg: 0,
    pitchDeg: 0,
    yawRate: 0,
    explanation:
      'Los 4 motores entregan exactamente el mismo empuje. Los pares CW y CCW cancelan el torque neto y el dron mantiene nivel horizontal.'
  },
  'roll-left': {
    id: 'roll-left',
    label: 'Alabeo Izquierda',
    axisLabel: 'Eje Longitudinal (Roll −)',
    deltas: [14, 14, -14, -14],
    rollDeg: -16,
    pitchDeg: 0,
    yawRate: 0,
    explanation:
      'Aceleran los motores derechos (M1 y M2) y reducen los izquierdos (M3 y M4). El vector de empuje se inclina a la izquierda y el dron se desplaza lateralmente.'
  },
  'roll-right': {
    id: 'roll-right',
    label: 'Alabeo Derecha',
    axisLabel: 'Eje Longitudinal (Roll +)',
    deltas: [-14, -14, 14, 14],
    rollDeg: 16,
    pitchDeg: 0,
    yawRate: 0,
    explanation:
      'Aceleran los motores izquierdos (M3 y M4) y reducen los derechos (M1 y M2). El dron inclina su plano hacia la derecha.'
  },
  'pitch-forward': {
    id: 'pitch-forward',
    label: 'Cabeceo Adelante',
    axisLabel: 'Eje Lateral (Pitch +)',
    deltas: [-14, 14, 14, -14],
    rollDeg: 0,
    pitchDeg: 16,
    yawRate: 0,
    explanation:
      'Aceleran los motores traseros (M2 y M3) y reducen los delanteros (M1 y M4). La nariz baja e inclina el vector de empuje hacia adelante.'
  },
  'pitch-back': {
    id: 'pitch-back',
    label: 'Cabeceo Atrás',
    axisLabel: 'Eje Lateral (Pitch −)',
    deltas: [14, -14, -14, 14],
    rollDeg: 0,
    pitchDeg: -16,
    yawRate: 0,
    explanation:
      'Aceleran los motores delanteros (M1 y M4) y reducen los traseros (M2 y M3). La nariz sube para frenar o retroceder.'
  },
  'yaw-left': {
    id: 'yaw-left',
    label: 'Guiñada Izquierda',
    axisLabel: 'Eje Vertical (Yaw CCW)',
    deltas: [-15, 15, -15, 15],
    rollDeg: 0,
    pitchDeg: 0,
    yawRate: -45,
    explanation:
      'Aceleran los motores CW (M2 y M4) y reducen los CCW (M1 y M3). Por tercera ley de Newton, el chasis gira en sentido opuesto (antihorario, CCW) manteniendo la altura.'
  },
  'yaw-right': {
    id: 'yaw-right',
    label: 'Guiñada Derecha',
    axisLabel: 'Eje Vertical (Yaw CW)',
    deltas: [15, -15, 15, -15],
    rollDeg: 0,
    pitchDeg: 0,
    yawRate: 45,
    explanation:
      'Aceleran los motores CCW (M1 y M3) y reducen los CW (M2 y M4). El exceso de torque reactivo hace girar el chasis en sentido horario (CW).'
  }
}

const MASS_PRESETS = [
  { label: 'DJI Mini 4K (246 g)', mass: 246 },
  { label: 'FPV 5" (680 g)', mass: 680 },
  { label: 'Mavic 3T (920 g)', mass: 920 },
  { label: 'Phantom 4 (1388 g)', mass: 1388 }
]

const MAX_MOTOR_THRUST_GF = 700 // 4 * 700 = 2800 gf max total thrust
const GRAVITY = 9.81

const MOTOR_META = [
  { id: 'M1', pos: 'Del. Der.', spin: 'CCW', cx: 186, cy: 62 },
  { id: 'M2', pos: 'Tras. Der.', spin: 'CW', cx: 186, cy: 178 },
  { id: 'M3', pos: 'Tras. Izq.', spin: 'CCW', cx: 74, cy: 178 },
  { id: 'M4', pos: 'Del. Izq.', spin: 'CW', cx: 74, cy: 62 }
] as const

export const FisicaVueloStation: React.FC = () => {
  const [massGrams, setMassGrams] = useState<number>(920)
  const [throttlePct, setThrottlePct] = useState<number>(38)
  const [maneuver, setManeuver] = useState<ManeuverMode>('neutral')

  // Live animated physics state
  const [altitudeM, setAltitudeM] = useState<number>(4.5)
  const [verticalVel, setVerticalVel] = useState<number>(0)
  const [yawHeading, setYawHeading] = useState<number>(0)

  const spec = MANEUVERS[maneuver]

  // Individual motor throttles (clamped 0-100)
  const motorPcts = spec.deltas.map((d) =>
    throttlePct === 0 ? 0 : Math.max(4, Math.min(100, throttlePct + d))
  )
  const motorThrustGf = motorPcts.map((pct) => (pct / 100) * MAX_MOTOR_THRUST_GF)
  const totalThrustGf = motorThrustGf.reduce((acc, t) => acc + t, 0)
  const totalThrustN = (totalThrustGf / 1000) * GRAVITY
  const weightN = (massGrams / 1000) * GRAVITY

  const tiltRad =
    (Math.abs(spec.rollDeg) * Math.PI) / 180 + (Math.abs(spec.pitchDeg) * Math.PI) / 180
  const verticalLiftN = totalThrustN * Math.cos(tiltRad)
  const thrustToWeight = weightN > 0 ? totalThrustGf / massGrams : 0
  const netAccelZ = (verticalLiftN - weightN) / (massGrams / 1000)

  const simRef = useRef({
    netAccelZ,
    yawRate: spec.yawRate,
    altitude: 4.5,
    velZ: 0,
    yaw: 0
  })

  useEffect(() => {
    simRef.current.netAccelZ = netAccelZ
    simRef.current.yawRate = throttlePct > 4 ? spec.yawRate : 0
  }, [netAccelZ, throttlePct, spec.yawRate])

  useEffect(() => {
    let animId = 0
    let lastTime = performance.now()

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000)
      lastTime = now

      const s = simRef.current
      // Damped vertical motion bounded cleanly between 0 m and 20 m
      s.velZ = s.velZ + (s.netAccelZ - s.velZ * 1.45) * dt
      s.altitude += s.velZ * dt
      if (s.altitude <= 0) {
        s.altitude = 0
        if (s.velZ < 0) s.velZ = 0
      } else if (s.altitude >= 20) {
        s.altitude = 20
        if (s.velZ > 0) s.velZ = 0
      }

      if (s.altitude > 0.05) {
        s.yaw = (s.yaw + s.yawRate * dt + 360) % 360
      }

      setAltitudeM(s.altitude)
      setVerticalVel(s.velZ)
      setYawHeading(s.yaw)

      animId = requestAnimationFrame(step)
    }

    animId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animId)
  }, [])

  const calibrateHover = () => {
    const hoverPct = Math.round((massGrams / (4 * MAX_MOTOR_THRUST_GF)) * 100)
    setManeuver('neutral')
    setThrottlePct(Math.max(5, Math.min(95, hoverPct)))
  }

  const regimeBadge =
    thrustToWeight > 1.03
      ? { text: 'ASCENSO (T > P)', cls: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300' }
      : thrustToWeight >= 0.97
      ? { text: 'HOVER ESTACIONARIO (T ≈ P)', cls: 'bg-sky-500/15 border-sky-500/35 text-sky-300' }
      : { text: 'DESCENSO / EN TIERRA (T < P)', cls: 'bg-amber-500/15 border-amber-500/35 text-amber-300' }

  const droneBottomPct = 14 + (altitudeM / 20) * 66
  const vectorAngleDeg = spec.rollDeg !== 0 ? spec.rollDeg : spec.pitchDeg

  return (
    <section aria-labelledby="seg-st2-title" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h2
            id="seg-st2-title"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900"
          >
            Física del Vuelo: Empuje, Peso y Control en 3 Ejes
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
            Ajusta la masa y el acelerador para equilibrar el vuelo estacionario, luego activa Alabeo, Cabeceo o Guiñada para ver qué motores aceleran.
          </p>
        </div>

        <button
          onClick={calibrateHover}
          className="apple-glass hover:bg-white rounded-2xl px-4 py-2.5 text-sm font-semibold text-blue-700 inline-flex items-center gap-2 transition-all active:scale-[0.98] shrink-0"
        >
          <Scale className="size-4" />
          <span>Calibrar Hover (T/W = 1.00)</span>
        </button>
      </div>

      {/* Main Split Simulator */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left: Live Flight Column + Attitude / Motor Mixing (7 cols) */}
        <div className="lg:col-span-7 apple-glass-dark rounded-3xl p-5 text-white flex flex-col justify-between gap-5">
          {/* Physics Telemetry Readout Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Empuje Total (T)</span>
                <span className="font-mono text-lg font-extrabold text-sky-400">
                  {totalThrustN.toFixed(2)} N{' '}
                  <span className="text-xs text-slate-300">({Math.round(totalThrustGf)} gf)</span>
                </span>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block" />
              <div>
                <span className="text-xs text-slate-400 block">Peso (P = m·g)</span>
                <span className="font-mono text-lg font-extrabold text-amber-400">
                  {weightN.toFixed(2)} N{' '}
                  <span className="text-xs text-slate-300">({massGrams} gf)</span>
                </span>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block" />
              <div>
                <span className="text-xs text-slate-400 block">Relación T / P</span>
                <span className="font-mono text-lg font-extrabold text-white">
                  {thrustToWeight.toFixed(2)}×
                </span>
              </div>
            </div>

            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${regimeBadge.cls}`}>
              {regimeBadge.text}
            </span>
          </div>

          {/* Center Dual Stage: Altitude + Force Vectors (Left) & 4-Motor Mixing SVG (Right) */}
          <div className="grid gap-4 sm:grid-cols-12 items-stretch">
            {/* Altitude Column & Force Vectors */}
            <div className="sm:col-span-5 rounded-2xl bg-slate-950/80 border border-white/10 p-4 relative min-h-[290px] flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 z-10">
                <span>ALTURA: {altitudeM.toFixed(1)} m</span>
                <span>Vz: {verticalVel >= 0 ? '+' : ''}{verticalVel.toFixed(1)} m/s</span>
              </div>

              {/* Altitude ruler marks */}
              <div className="absolute right-3 top-12 bottom-10 flex flex-col justify-between text-[11px] font-mono text-slate-500 select-none">
                <span>20m</span>
                <span>10m</span>
                <span>0m</span>
              </div>

              {/* Animated Drone Side Silhouette with Force Vectors */}
              <div
                className="absolute left-1/2 -translate-x-1/2 transition-transform duration-200"
                style={{
                  bottom: `${droneBottomPct}%`,
                  transform: `translateX(-50%) rotate(${vectorAngleDeg}deg)`
                }}
              >
                {/* Upward Thrust Vector T */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-5 flex flex-col items-center">
                  <ArrowUp className="size-4 text-sky-400 -mb-1" />
                  <div
                    className="w-1 bg-sky-400 rounded-full transition-all duration-150"
                    style={{ height: `${Math.max(14, Math.min(72, thrustToWeight * 36))}px` }}
                  />
                  <span className="text-[11px] font-mono font-bold text-sky-300 -mt-1">T</span>
                </div>

                {/* Drone body side profile */}
                <svg width="96" height="28" viewBox="0 0 96 28" className="drop-shadow-lg">
                  <rect x="8" y="4" width="24" height="3" rx="1.5" fill="#38bdf8" />
                  <rect x="64" y="4" width="24" height="3" rx="1.5" fill="#f59e0b" />
                  <rect x="17" y="7" width="6" height="7" rx="1.5" fill="#94a3b8" />
                  <rect x="73" y="7" width="6" height="7" rx="1.5" fill="#94a3b8" />
                  <rect x="14" y="13" width="68" height="4" rx="2" fill="#e2e8f0" />
                  <rect x="33" y="9" width="30" height="10" rx="3" fill="#0ea5e9" />
                  <path d="M26 17 L22 26 M70 17 L74 26" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
                </svg>

                {/* Downward Weight Vector P (always vertical relative to ground, approximate visually) */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-6 flex flex-col items-center"
                  style={{ transform: `translateX(-50%) rotate(${-vectorAngleDeg}deg)` }}
                >
                  <div
                    className="w-1 bg-amber-400 rounded-full transition-all duration-150"
                    style={{ height: `${Math.max(18, Math.min(64, (massGrams / 1400) * 44))}px` }}
                  />
                  <ArrowDown className="size-4 text-amber-400 -mt-1" />
                  <span className="text-[11px] font-mono font-bold text-amber-300">P</span>
                </div>
              </div>

              {/* Ground Landing Pad */}
              <div className="mt-auto pt-2 border-t border-emerald-500/40 flex items-center justify-between text-xs font-mono text-emerald-400 z-10">
                <span>PLATAFORMA H</span>
                <span>Rumbo: {Math.round(yawHeading)}°</span>
              </div>
            </div>

            {/* 4-Motor Top-Down Torque & Differential Thrust Diagram */}
            <div className="sm:col-span-7 rounded-2xl bg-slate-950/80 border border-white/10 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">{spec.axisLabel}</span>
                <span className="font-mono text-sky-400">
                  Roll {spec.rollDeg}° · Pitch {spec.pitchDeg}° · Yaw {spec.yawRate}°/s
                </span>
              </div>

              <div className="flex justify-center my-1">
                <svg viewBox="0 0 260 236" className="w-full max-w-[280px] h-auto">
                  {/* X-Frame Chassis */}
                  <g
                    style={{
                      transformOrigin: '130px 120px',
                      transform: `rotate(${spec.yawRate !== 0 ? (spec.yawRate > 0 ? 8 : -8) : 0}deg)`,
                      transition: 'transform 220ms ease-out'
                    }}
                  >
                    <line x1="74" y1="62" x2="186" y2="178" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
                    <line x1="186" y1="62" x2="74" y2="178" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
                    {/* Central Stack */}
                    <rect x="112" y="96" width="36" height="48" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                    {/* Nose Forward Indicator */}
                    <polygon points="130,78 122,92 138,92" fill="#38bdf8" />
                    <text x="130" y="72" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="700">
                      FRENTE
                    </text>

                    {MOTOR_META.map((m, idx) => {
                      const delta = spec.deltas[idx]
                      const pct = motorPcts[idx]
                      const isBoosted = delta > 0
                      const isReduced = delta < 0
                      const strokeColor = isBoosted ? '#10b981' : isReduced ? '#64748b' : '#38bdf8'
                      const fillGlow = isBoosted ? 'rgba(16,185,129,0.22)' : 'rgba(56,189,248,0.08)'

                      return (
                        <g key={m.id}>
                          <circle
                            cx={m.cx}
                            cy={m.cy}
                            r={isBoosted ? 33 : 27}
                            fill={fillGlow}
                            stroke={strokeColor}
                            strokeWidth={isBoosted ? 3 : 2}
                          />
                          <circle cx={m.cx} cy={m.cy} r={14} fill="#0f172a" stroke={strokeColor} strokeWidth="1.5" />
                          <text x={m.cx} y={m.cy - 2} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="800">
                            {m.id} · {m.spin}
                          </text>
                          <text
                            x={m.cx}
                            y={m.cy + 10}
                            textAnchor="middle"
                            fill={isBoosted ? '#6ee7b7' : isReduced ? '#94a3b8' : '#7dd3fc'}
                            fontSize="10"
                            fontWeight="700"
                          >
                            {pct}%
                          </text>
                          {delta !== 0 && (
                            <text
                              x={m.cx}
                              y={m.cy < 120 ? m.cy - 38 : m.cy + 46}
                              textAnchor="middle"
                              fill={isBoosted ? '#34d399' : '#fca5a5'}
                              fontSize="10"
                              fontWeight="800"
                            >
                              {delta > 0 ? '▲ ACELERA' : '▼ REDUCE'}
                            </text>
                          )}
                        </g>
                      )
                    })}
                  </g>
                </svg>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed bg-white/5 rounded-xl p-3 border border-white/10">
                {spec.explanation}
              </p>
            </div>
          </div>

          {/* Visible Physics Formula Strip */}
          <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-200">
            <span>Fórmula: Empuje Total = Σ(T₁..T₄) · cos(θ)</span>
            <span>Peso = (m / 1000) × 9.81 m/s²</span>
            <span className="text-sky-300 font-bold">
              a_z = ({verticalLiftN.toFixed(2)} − {weightN.toFixed(2)}) / {(massGrams / 1000).toFixed(2)} ={' '}
              {netAccelZ >= 0 ? '+' : ''}
              {netAccelZ.toFixed(2)} m/s²
            </span>
          </div>
        </div>

        {/* Right: Controls Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Mass & Throttle Sliders */}
          <div className="apple-glass rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                <Gauge className="size-4 text-blue-600" />
                Variables Físicas
              </span>
              <span className="font-mono text-xs font-bold text-slate-500">
                4 motores × 700 gf máx
              </span>
            </div>

            {/* Mass Presets */}
            <div className="flex flex-wrap gap-1.5">
              {MASS_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setMassGrams(p.mass)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                    massGrams === p.mass
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-900/5 text-slate-700 hover:bg-slate-900/10'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Mass Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm font-semibold">
                <label htmlFor="mass-slider" className="text-slate-800">
                  Masa Total del Dron (m)
                </label>
                <span className="font-mono font-bold text-amber-700">
                  {massGrams} g ({weightN.toFixed(2)} N)
                </span>
              </div>
              <input
                id="mass-slider"
                type="range"
                min={130}
                max={1800}
                step={10}
                value={massGrams}
                onChange={(e) => setMassGrams(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Throttle Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm font-semibold">
                <label htmlFor="throttle-slider" className="text-slate-800">
                  Acelerador Base por Motor
                </label>
                <span className="font-mono font-bold text-blue-700">
                  {throttlePct}% ({Math.round((throttlePct / 100) * MAX_MOTOR_THRUST_GF)} gf/motor)
                </span>
              </div>
              <input
                id="throttle-slider"
                type="range"
                min={0}
                max={100}
                step={1}
                value={throttlePct}
                onChange={(e) => setThrottlePct(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* 3-Axis Attitude Controls (Roll, Pitch, Yaw) */}
          <div className="apple-glass rounded-3xl p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Maniobras en 3 Ejes (Mezcla de Motores)
              </span>
              <button
                onClick={() => setManeuver('neutral')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900"
              >
                Nivelar
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setManeuver('roll-left')}
                className={`rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-left transition-all active:scale-[0.98] ${
                  maneuver === 'roll-left'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white/80 hover:bg-white text-slate-800 border border-slate-200/80'
                }`}
              >
                ← Alabeo Izquierda (Roll)
              </button>
              <button
                onClick={() => setManeuver('roll-right')}
                className={`rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-left transition-all active:scale-[0.98] ${
                  maneuver === 'roll-right'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white/80 hover:bg-white text-slate-800 border border-slate-200/80'
                }`}
              >
                Alabeo Derecha (Roll) →
              </button>

              <button
                onClick={() => setManeuver('pitch-forward')}
                className={`rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-left transition-all active:scale-[0.98] ${
                  maneuver === 'pitch-forward'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white/80 hover:bg-white text-slate-800 border border-slate-200/80'
                }`}
              >
                ↑ Cabeceo Adelante (Pitch)
              </button>
              <button
                onClick={() => setManeuver('pitch-back')}
                className={`rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-left transition-all active:scale-[0.98] ${
                  maneuver === 'pitch-back'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white/80 hover:bg-white text-slate-800 border border-slate-200/80'
                }`}
              >
                ↓ Cabeceo Atrás (Pitch)
              </button>

              <button
                onClick={() => setManeuver('yaw-left')}
                className={`rounded-2xl px-3.5 py-2.5 text-sm font-semibold inline-flex items-center gap-2 transition-all active:scale-[0.98] ${
                  maneuver === 'yaw-left'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white/80 hover:bg-white text-slate-800 border border-slate-200/80'
                }`}
              >
                <RotateCcw className="size-4" />
                <span>Guiñada CCW</span>
              </button>
              <button
                onClick={() => setManeuver('yaw-right')}
                className={`rounded-2xl px-3.5 py-2.5 text-sm font-semibold inline-flex items-center gap-2 transition-all active:scale-[0.98] ${
                  maneuver === 'yaw-right'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white/80 hover:bg-white text-slate-800 border border-slate-200/80'
                }`}
              >
                <RotateCw className="size-4" />
                <span>Guiñada CW</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
