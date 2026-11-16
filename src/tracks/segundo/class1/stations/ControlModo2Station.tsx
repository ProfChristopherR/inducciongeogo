import React, { useEffect, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Compass,
  Radio,
  RotateCcw,
  RotateCw
} from 'lucide-react'
import { SafeMediaImage } from '../../components/SafeMediaImage'
import { MiniFlightArena3D, type DroneFlightState } from '../MiniFlightArena3D'

interface StickValue {
  x: number // -1 to +1
  y: number // -1 (bottom) to +1 (top)
}

interface GimbalProps {
  title: string
  subtitle: string
  value: StickValue
  onChange: (val: StickValue) => void
  springX: boolean
  springY: boolean
  topLabel: string
  bottomLabel: string
  leftLabel: string
  rightLabel: string
}

const GimbalStick: React.FC<GimbalProps> = ({
  title,
  subtitle,
  value,
  onChange,
  springX,
  springY,
  topLabel,
  bottomLabel,
  leftLabel,
  rightLabel
}) => {
  const padRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef<boolean>(false)
  const [isDraggingUI, setIsDraggingUI] = useState<boolean>(false)
  const grabOffsetRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 })

  const maxRadius = 48 // px travel inside 144x144 gimbal well

  const updateFromClient = (clientX: number, clientY: number) => {
    const pad = padRef.current
    if (!pad) return
    const rect = pad.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2

    const targetKnobX = clientX - grabOffsetRef.current.dx - cx
    const targetKnobY = clientY - grabOffsetRef.current.dy - cy

    // Clamp inside circular gimbal ring
    const dist = Math.hypot(targetKnobX, targetKnobY)
    const clampedX = dist > maxRadius ? (targetKnobX / dist) * maxRadius : targetKnobX
    const clampedY = dist > maxRadius ? (targetKnobY / dist) * maxRadius : targetKnobY

    onChange({
      x: Number((clampedX / maxRadius).toFixed(3)),
      y: Number((-clampedY / maxRadius).toFixed(3))
    })
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    const pad = padRef.current
    if (!pad) return
    pad.setPointerCapture(e.pointerId)
    draggingRef.current = true
    setIsDraggingUI(true)

    const rect = pad.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const currentKnobX = cx + value.x * maxRadius
    const currentKnobY = cy - value.y * maxRadius

    // Preserve grab offset if clicking on knob, otherwise track smoothly from pointer
    const clickDistFromKnob = Math.hypot(e.clientX - currentKnobX, e.clientY - currentKnobY)
    if (clickDistFromKnob <= 26) {
      grabOffsetRef.current = {
        dx: e.clientX - currentKnobX,
        dy: e.clientY - currentKnobY
      }
    } else {
      grabOffsetRef.current = { dx: 0, dy: 0 }
    }

    updateFromClient(e.clientX, e.clientY)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    updateFromClient(e.clientX, e.clientY)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    setIsDraggingUI(false)
    if (padRef.current?.hasPointerCapture(e.pointerId)) {
      padRef.current.releasePointerCapture(e.pointerId)
    }
    if (springX || springY) {
      onChange({
        x: springX ? 0 : value.x,
        y: springY ? 0 : value.y
      })
    }
  }

  const knobLeftPct = 50 + (value.x * maxRadius * 100) / 144
  const knobTopPct = 50 - (value.y * maxRadius * 100) / 144

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-center">
        <span className="text-xs font-extrabold uppercase tracking-wider text-sky-400 block">
          {title}
        </span>
        <span className="text-[11px] font-medium text-slate-400">{subtitle}</span>
      </div>

      <div className="relative flex flex-col items-center">
        <span className="text-[11px] font-mono font-bold text-slate-400 mb-1">{topLabel}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono font-bold text-slate-400 w-9 text-right">
            {leftLabel}
          </span>

          {/* Gimbal Well */}
          <div
            ref={padRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative size-36 rounded-full bg-slate-950 border-2 border-slate-700 shadow-inner touch-none select-none cursor-grab active:cursor-grabbing"
          >
            {/* Precision Crosshair */}
            <div className="pointer-events-none absolute inset-x-3 top-1/2 h-px bg-slate-800" />
            <div className="pointer-events-none absolute inset-y-3 left-1/2 w-px bg-slate-800" />
            <div className="pointer-events-none absolute inset-4 rounded-full border border-dashed border-slate-800" />

            {/* Stick Shaft Shadow Line */}
            <svg viewBox="0 0 144 144" className="pointer-events-none absolute inset-0 size-full">
              <line
                x1="72"
                y1="72"
                x2={72 + value.x * maxRadius}
                y2={72 - value.y * maxRadius}
                stroke="#38bdf8"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.65"
              />
            </svg>

            {/* Draggable Machined Stick Cap */}
            <div
              className="pointer-events-none absolute size-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-500 border-2 border-white/80 shadow-[0_6px_16px_rgba(0,0,0,0.6)] flex items-center justify-center"
              style={{
                left: `${knobLeftPct}%`,
                top: `${knobTopPct}%`,
                transition: isDraggingUI ? 'none' : 'left 140ms cubic-bezier(0.23,1,0.32,1), top 140ms cubic-bezier(0.23,1,0.32,1)'
              }}
            >
              <div className="size-4 rounded-full bg-slate-900/80 ring-1 ring-sky-400/60" />
            </div>
          </div>

          <span className="text-[11px] font-mono font-bold text-slate-400 w-9 text-left">
            {rightLabel}
          </span>
        </div>
        <span className="text-[11px] font-mono font-bold text-slate-400 mt-1">{bottomLabel}</span>
      </div>
    </div>
  )
}

export const ControlModo2Station: React.FC = () => {
  // Left stick: y in [-1, 1] maps to throttle [0%, 100%], x is Yaw [-1, 1]
  const [leftStick, setLeftStick] = useState<StickValue>({ x: 0, y: -0.92 })
  // Right stick: y is Pitch [-1, 1], x is Roll [-1, 1]
  const [rightStick, setRightStick] = useState<StickValue>({ x: 0, y: 0 })

  const [hudData, setHudData] = useState({
    alt: 0,
    yaw: 0,
    dist: 0,
    throttle: 4
  })

  const [stepsDone, setStepsDone] = useState({
    takeoff: false,
    turn90: false,
    advance: false,
    land: false
  })

  const flightStateRef = useRef<DroneFlightState>({
    x: 0,
    y: 0,
    z: 0,
    yawDeg: 0,
    pitchDeg: 0,
    rollDeg: 0,
    throttlePct: 4
  })

  const stickInputRef = useRef({ left: leftStick, right: rightStick })
  useEffect(() => {
    stickInputRef.current = { left: leftStick, right: rightStick }
  }, [leftStick, rightStick])

  const progressFlagsRef = useRef({
    tookOff: false,
    turned90: false,
    advanced: false,
    landed: false,
    maxDistAfterTurn: 0
  })

  useEffect(() => {
    let animId = 0
    let lastTime = performance.now()
    let hudCounter = 0

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000)
      lastTime = now

      const { left, right } = stickInputRef.current
      const throttlePct = Math.max(0, Math.min(100, ((left.y + 1) / 2) * 100))
      const st = flightStateRef.current

      st.throttlePct = throttlePct

      // Vertical physics: 50% throttle = neutral hover
      const verticalAccel = (throttlePct - 50) * 0.14
      const nextY = Math.max(0, Math.min(8.5, st.y + verticalAccel * dt * 2.2))
      st.y = nextY

      // Yaw, Pitch, Roll only apply cleanly when airborne (or slightly above 0.1m)
      if (st.y > 0.12) {
        st.yawDeg = (st.yawDeg + left.x * 110 * dt + 360) % 360
        st.pitchDeg = right.y * 22
        st.rollDeg = right.x * 22

        const yawRad = (st.yawDeg * Math.PI) / 180
        // Forward (-Z in local space) rotated by -yawRad
        const fwdSpeed = right.y * 5.2
        const latSpeed = right.x * 5.2

        const dx = (Math.sin(yawRad) * fwdSpeed + Math.cos(yawRad) * latSpeed) * dt
        const dz = (-Math.cos(yawRad) * fwdSpeed + Math.sin(yawRad) * latSpeed) * dt

        st.x = Math.max(-10, Math.min(10, st.x + dx))
        st.z = Math.max(-10, Math.min(10, st.z + dz))
      } else {
        st.pitchDeg = 0
        st.rollDeg = 0
      }

      const distFromPad = Math.hypot(st.x, st.z)

      // Check 4-step guided mission completion
      const flags = progressFlagsRef.current
      if (!flags.tookOff && st.y >= 1.8) {
        flags.tookOff = true
      }
      const shortestYawDelta = Math.min(st.yawDeg, 360 - st.yawDeg)
      if (flags.tookOff && !flags.turned90 && shortestYawDelta >= 72) {
        flags.turned90 = true
      }
      if (flags.turned90 && distFromPad >= 2.4) {
        flags.advanced = true
      }
      if (flags.advanced && st.y <= 0.18 && throttlePct <= 28) {
        flags.landed = true
      }

      hudCounter++
      if (hudCounter % 4 === 0) {
        setHudData({
          alt: st.y,
          yaw: Math.round(st.yawDeg),
          dist: distFromPad,
          throttle: Math.round(throttlePct)
        })
        setStepsDone({
          takeoff: flags.tookOff,
          turn90: flags.turned90,
          advance: flags.advanced,
          land: flags.landed
        })
      }

      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [])

  const resetMission = () => {
    setLeftStick({ x: 0, y: -0.92 })
    setRightStick({ x: 0, y: 0 })
    flightStateRef.current = {
      x: 0,
      y: 0,
      z: 0,
      yawDeg: 0,
      pitchDeg: 0,
      rollDeg: 0,
      throttlePct: 4
    }
    progressFlagsRef.current = {
      tookOff: false,
      turned90: false,
      advanced: false,
      landed: false,
      maxDistAfterTurn: 0
    }
    setHudData({ alt: 0, yaw: 0, dist: 0, throttle: 4 })
    setStepsDone({ takeoff: false, turn90: false, advance: false, land: false })
  }

  // Quick impulse helpers for interactive whiteboards / buttons
  const pulseStick = (side: 'left' | 'right', x: number, y: number, durationMs = 480) => {
    if (side === 'left') {
      setLeftStick((prev) => ({ x, y: y !== 99 ? y : prev.y }))
      setTimeout(() => setLeftStick((prev) => ({ x: 0, y: prev.y })), durationMs)
    } else {
      setRightStick({ x, y })
      setTimeout(() => setRightStick({ x: 0, y: 0 }), durationMs)
    }
  }

  const missionSteps = [
    { key: 'takeoff', num: '1', label: 'Despega (≥ 1.8 m)', done: stepsDone.takeoff },
    { key: 'turn90', num: '2', label: 'Gira ~90° (Yaw)', done: stepsDone.turn90 },
    { key: 'advance', num: '3', label: 'Avanza (≥ 2.4 m)', done: stepsDone.advance },
    { key: 'land', num: '4', label: 'Aterriza suave', done: stepsDone.land }
  ]
  const allComplete = stepsDone.takeoff && stepsDone.turn90 && stepsDone.advance && stepsDone.land

  return (
    <section aria-labelledby="seg-st4-title" className="space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h2
            id="seg-st4-title"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900"
          >
            Control de Mando en Modo 2 (1:1 con Sticks)
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
            En Chile y el estándar internacional DJI/FPV usamos <strong>Modo 2</strong>: el stick izquierdo controla <strong>Acelerador + Guiñada</strong> y el derecho controla <strong>Cabeceo + Alabeo</strong>.
          </p>
        </div>

        <button
          onClick={resetMission}
          className="apple-glass hover:bg-white rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-800 inline-flex items-center gap-2 transition-all active:scale-[0.98] shrink-0"
        >
          <RotateCcw className="size-4" />
          <span>Reiniciar Vuelo</span>
        </button>
      </div>

      {/* Guided 4-Step Mission Bar */}
      <div className="apple-glass rounded-3xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 shrink-0">
          <Compass className="size-5 text-blue-600" />
          <span>Misión Guiada:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-1">
          {missionSteps.map((step) => (
            <div
              key={step.key}
              className={`rounded-2xl px-3.5 py-2 border flex items-center gap-2 text-xs sm:text-sm font-semibold transition-colors ${
                step.done
                  ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-900'
                  : 'bg-white/75 border-slate-200/80 text-slate-700'
              }`}
            >
              {step.done ? (
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              ) : (
                <span className="size-5 rounded-full bg-slate-900/10 text-slate-800 flex items-center justify-center text-xs font-bold shrink-0">
                  {step.num}
                </span>
              )}
              <span className="truncate">{step.label}</span>
            </div>
          ))}
        </div>

        {allComplete && (
          <span className="rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shrink-0">
            ¡Misión Completada ✓!
          </span>
        )}
      </div>

      {/* Main Split: 3D Mini-Arena + Realistic Mode 2 Transmitter */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left: 3D Mini-Visor (6 cols) */}
        <div className="lg:col-span-6 apple-glass-dark rounded-3xl overflow-hidden relative flex flex-col justify-between min-h-[380px]">
          {/* Top HUD Overlay */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-slate-900/80 border-b border-white/10 backdrop-blur-md text-xs font-mono text-white">
            <span className="font-bold text-emerald-400">ARENA 3D • MODO 2</span>
            <div className="flex items-center gap-3">
              <span>ALT: <strong className="text-sky-400">{hudData.alt.toFixed(1)} m</strong></span>
              <span>RUMBO: <strong className="text-amber-300">{hudData.yaw}°</strong></span>
              <span>DIST: <strong>{hudData.dist.toFixed(1)} m</strong></span>
            </div>
          </div>

          <div className="flex-1 relative">
            <MiniFlightArena3D flightStateRef={flightStateRef} />
          </div>

          {/* Bottom Reference Thumbnail */}
          <div className="relative z-20 p-3 bg-slate-900/85 border-t border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-white/15">
                <SafeMediaImage mediaKey="radioControlMode2" fallbackKey="grade3Drones" />
              </div>
              <div className="text-xs text-slate-200">
                <span className="font-bold text-white block">Referencia Emisora Real</span>
                <span className="text-slate-400">Throttle {hudData.throttle}% (50% = Hover estable)</span>
              </div>
            </div>

            <button
              onClick={() => setLeftStick({ x: 0, y: 0 })}
              className="rounded-xl bg-sky-500/20 border border-sky-400/40 px-3 py-1.5 text-xs font-bold text-sky-300 hover:bg-sky-500/30 transition-colors"
            >
              Fijar Hover (50%)
            </button>
          </div>
        </div>

        {/* Right: Dual-Stick Radio Controller Panel + Whiteboard Buttons (6 cols) */}
        <div className="lg:col-span-6 apple-glass-dark rounded-3xl p-5 sm:p-6 text-white flex flex-col justify-between gap-5">
          {/* Controller OLED Strip */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="size-5 text-sky-400" />
              <span className="text-sm font-extrabold tracking-tight">
                Emisora RPAS • Modo 2 Estándar
              </span>
            </div>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/35 px-3 py-0.5 text-xs font-mono font-bold text-emerald-300">
              ENLACE 2.4 GHz OK
            </span>
          </div>

          {/* Two Draggable Sticks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-2 place-items-center">
            <GimbalStick
              title="Stick Izquierdo"
              subtitle="Throttle + Guiñada"
              value={leftStick}
              onChange={setLeftStick}
              springX={true}
              springY={false}
              topLabel="SUBIR"
              bottomLabel="BAJAR"
              leftLabel="CCW"
              rightLabel="CW"
            />
            <GimbalStick
              title="Stick Derecho"
              subtitle="Cabeceo + Alabeo"
              value={rightStick}
              onChange={setRightStick}
              springX={true}
              springY={true}
              topLabel="AVANZA"
              bottomLabel="ATRÁS"
              leftLabel="IZQ"
              rightLabel="DER"
            />
          </div>

          {/* Directional Fallback Controls for Projector / Touchboard */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Botones Rápidos para Pizarra o Proyector
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
              <button
                onClick={() => setLeftStick((s) => ({ ...s, y: Math.min(1, s.y + 0.35) }))}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-2 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <ArrowUp className="size-3.5 text-sky-400" />
                <span>Subir</span>
              </button>
              <button
                onClick={() => setLeftStick((s) => ({ ...s, y: Math.max(-0.95, s.y - 0.35) }))}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-2 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <ArrowDown className="size-3.5 text-amber-400" />
                <span>Bajar</span>
              </button>
              <button
                onClick={() => pulseStick('left', -0.85, 99, 650)}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-2 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <RotateCcw className="size-3.5 text-sky-400" />
                <span>Girar Izq</span>
              </button>
              <button
                onClick={() => pulseStick('left', 0.85, 99, 650)}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-2 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <RotateCw className="size-3.5 text-sky-400" />
                <span>Girar Der</span>
              </button>

              <button
                onClick={() => pulseStick('right', 0, 0.85, 650)}
                className="rounded-xl bg-blue-600/30 hover:bg-blue-600/45 border border-blue-500/30 px-3 py-2 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <ArrowUp className="size-3.5" />
                <span>Avanzar</span>
              </button>
              <button
                onClick={() => pulseStick('right', 0, -0.85, 650)}
                className="rounded-xl bg-blue-600/30 hover:bg-blue-600/45 border border-blue-500/30 px-3 py-2 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <ArrowDown className="size-3.5" />
                <span>Retroceder</span>
              </button>
              <button
                onClick={() => pulseStick('right', -0.85, 0, 650)}
                className="rounded-xl bg-blue-600/30 hover:bg-blue-600/45 border border-blue-500/30 px-3 py-2 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <ArrowLeft className="size-3.5" />
                <span>Alabeo Izq</span>
              </button>
              <button
                onClick={() => pulseStick('right', 0.85, 0, 650)}
                className="rounded-xl bg-blue-600/30 hover:bg-blue-600/45 border border-blue-500/30 px-3 py-2 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <ArrowRight className="size-3.5" />
                <span>Alabeo Der</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
