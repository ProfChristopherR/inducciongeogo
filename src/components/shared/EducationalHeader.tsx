import React from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronRight,
  Clock,
  ArrowLeft
} from 'lucide-react'
import { motion } from 'framer-motion'
import { usePlatformStore } from '../../store/usePlatformStore'
import { TRACKS } from '../../tracks/registry'
import type { TrackId } from '../../tracks/types'

interface Props {
  trackId: TrackId
  currentStationTitle: string
  currentStationNumber: number
  totalStations: number
  minuteRange: string
}

export const EducationalHeader: React.FC<Props> = ({
  trackId,
  currentStationTitle,
  currentStationNumber,
  totalStations,
  minuteRange
}) => {
  const {
    activeClass,
    setActiveClass,
    setTrack,
    timerSeconds,
    isTimerRunning,
    toggleTimer,
    resetTimer,
    soundEnabled,
    toggleSound,
    setPremilitarModal
  } = usePlatformStore()

  const track = TRACKS[trackId]
  const isOctavo = trackId === 'octavo'

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-2xl shadow-[0_4px_24px_rgba(15,23,42,0.04)]">
      {/* Top macOS-inspired Glass Navigation Bar */}
      <div className="mx-auto flex flex-wrap max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        {/* Left: Back to Cover + Track Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTrack(null)}
            title="Volver a la portada para elegir inducción"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-900/10 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-white hover:text-slate-900 shadow-2xs transition-all active:scale-[0.97]"
          >
            <ArrowLeft className="size-3.5" />
            <span>Inducciones</span>
          </button>

          <div className="flex items-center gap-2.5">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold border ${
                isOctavo
                  ? 'bg-emerald-500/12 border-emerald-500/25 text-emerald-800'
                  : 'bg-indigo-500/12 border-indigo-500/25 text-indigo-800'
              }`}
            >
              {track.label}
            </span>
            <span className="hidden lg:inline text-xs font-medium text-slate-500 truncate max-w-[260px]">
              {track.decisionQuestion}
            </span>
          </div>
        </div>

        {/* Center: Class Switcher for the Active Track */}
        <div className="relative flex items-center gap-1 rounded-2xl bg-slate-900/[0.06] p-1 border border-slate-900/[0.06] shadow-inner">
          {track.classes.map((cls, idx) => {
            const isActive = activeClass === cls.id
            const dotColor = isOctavo
              ? idx === 0 ? 'bg-emerald-500' : 'bg-blue-500'
              : idx === 0 ? 'bg-indigo-500' : 'bg-sky-500'

            return (
              <button
                key={cls.id}
                onClick={() => setActiveClass(cls.id)}
                className={`relative z-10 flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                  isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeClassPill"
                    className="absolute inset-0 rounded-xl bg-white shadow-[0_2px_10px_rgba(15,23,42,0.08)] border border-black/[0.04]"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
                <span className={`relative z-10 size-2 rounded-full ${dotColor}`} />
                <span className="relative z-10">{cls.label}</span>
              </button>
            )
          })}
        </div>

        {/* Right: Classroom Clock, Sound & Institutional Portal */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-900/10 bg-white/80 px-3 py-1.5 shadow-2xs">
            <Clock
              className={`size-3.5 ${
                isTimerRunning
                  ? isOctavo ? 'text-emerald-600 animate-pulse' : 'text-indigo-600 animate-pulse'
                  : 'text-slate-400'
              }`}
            />
            <span className="font-mono text-xs font-bold text-slate-800 min-w-[42px]">
              {formatTime(timerSeconds)}
            </span>
            <div className="flex items-center gap-0.5 border-l border-slate-200 pl-1.5">
              <button
                onClick={toggleTimer}
                title={isTimerRunning ? 'Pausar Reloj' : 'Iniciar Tiempo de Clase'}
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                {isTimerRunning ? <Pause className="size-3" /> : <Play className="size-3" />}
              </button>
              <button
                onClick={() => resetTimer()}
                title="Reiniciar reloj"
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <RotateCcw className="size-3" />
              </button>
            </div>
          </div>

          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Sonido Activado' : 'Silenciar'}
            className="rounded-xl border border-slate-900/10 bg-white/80 p-2 text-slate-600 hover:bg-white transition-colors shadow-2xs"
          >
            {soundEnabled ? (
              <Volume2 className="size-3.5 text-emerald-600" />
            ) : (
              <VolumeX className="size-3.5 text-slate-400" />
            )}
          </button>

          <button
            onClick={() => setPremilitarModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 shadow-sm transition-all active:scale-[0.97]"
          >
            <span className="hidden sm:inline">Portal Premilitar</span>
            <span className="sm:hidden">Portal</span>
            <ExternalLink className="size-3" />
          </button>
        </div>
      </div>

      {/* Sequential Step Ribbon */}
      <div className="border-t border-slate-900/[0.05] bg-slate-50/50 px-4 py-1.5 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`rounded-full px-2.5 py-0.5 font-bold text-[11px] border ${
                isOctavo
                  ? 'bg-emerald-600/10 border-emerald-600/20 text-emerald-800'
                  : 'bg-indigo-600/10 border-indigo-600/20 text-indigo-800'
              }`}
            >
              Estación {currentStationNumber} de {totalStations}
            </span>
            <ChevronRight className="size-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800 text-xs sm:text-sm tracking-tight">
              {currentStationTitle}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px] font-medium text-slate-500">
            <span className="rounded-full bg-white/80 border border-slate-200/80 px-2.5 py-0.5 text-slate-700 font-semibold">
              Bloque {minuteRange}
            </span>
            <span>Navegación con teclado ← / →</span>
          </div>
        </div>
      </div>

      {/* Ultra-sleek Progress Hairline */}
      <div className="h-[2px] w-full bg-slate-200/60 overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${
            isOctavo
              ? 'from-emerald-500 via-teal-500 to-blue-600'
              : 'from-indigo-600 via-sky-500 to-blue-500'
          }`}
          initial={false}
          animate={{ width: `${(currentStationNumber / totalStations) * 100}%` }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>
    </header>
  )
}
