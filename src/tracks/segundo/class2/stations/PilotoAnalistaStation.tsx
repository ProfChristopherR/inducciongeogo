import React, { useState } from 'react'
import { ArrowRight, Box, Flame, Mountain, Radar, Sprout } from 'lucide-react'
import { usePlatformStore } from '../../../../store/usePlatformStore'
import { SafeMediaImage } from '../../components/SafeMediaImage'

interface MissionTrack {
  id: string
  stationIdx: number
  title: string
  drone: string
  sensor: string
  icon: React.FC<{ className?: string }>
  badgeCls: string
  pipeline: string[]
  deliverable: string
  nubleUseCase: string
}

const MISSIONS: MissionTrack[] = [
  {
    id: 'sar',
    stationIdx: 1,
    title: 'Búsqueda y Rescate Térmico (SAR)',
    drone: 'DJI Mavic 3T',
    sensor: 'Cámara Térmica LWIR 640×512 + Zoom 56×',
    icon: Flame,
    badgeCls: 'bg-red-500/15 text-red-800 border-red-500/30',
    pipeline: ['Radiación Infrarroja (8–14 µm)', 'Mapa Radiométrico Ironbow', 'Localización Georreferenciada'],
    deliverable: 'Coordenadas exactas de firmas de calor humano y focos activos en oscuridad o bosque.',
    nubleUseCase: 'Apoyo a búsqueda de personas extraviadas y detección de puntos calientes post-incendio.'
  },
  {
    id: 'ndvi',
    stationIdx: 2,
    title: 'Agricultura Multiespectral NDVI',
    drone: 'DJI Mavic 3M',
    sensor: '4 Bandas (G, R 650nm, RE, NIR 860nm) + Sensor Solar',
    icon: Sprout,
    badgeCls: 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30',
    pipeline: ['Reflectancia Rojo vs NIR', 'Cálculo (NIR − R)/(NIR + R)', 'Mapa de Prescripción Variable'],
    deliverable: 'Zonificación de estrés hídrico y vigor vegetal para guiar drones de riego/aspersión.',
    nubleUseCase: 'Optimización de cultivos y huertos en el valle agrícola de San Nicolás y Chillán.'
  },
  {
    id: 'photogrammetry',
    stationIdx: 3,
    title: 'Fotogrametría y Gemelos 3D',
    drone: 'DJI Phantom 4 Pro',
    sensor: 'CMOS 1" 20 MP con Obturador Mecánico',
    icon: Box,
    badgeCls: 'bg-blue-500/15 text-blue-800 border-blue-500/30',
    pipeline: ['Grilla con Traslape ≥ 75%', 'Triangulación Structure-from-Motion', 'Ortomosaico + Nube de Puntos'],
    deliverable: 'Modelo 3D texturizado y ortofoto métrica de precisión centimétrica según GSD.',
    nubleUseCase: 'Levantamiento digital completo de las 12 hectáreas del Campus Liceo San Nicolás.'
  },
  {
    id: 'topography',
    stationIdx: 4,
    title: 'Topografía de Precisión RTK',
    drone: 'Phantom 4 RTK + Base GNSS',
    sensor: 'Posicionamiento RTK + Puntos de Control (GCP)',
    icon: Mountain,
    badgeCls: 'bg-amber-500/15 text-amber-900 border-amber-500/30',
    pipeline: ['Corrección RTK + GCP', 'Modelo Digital de Elevación (MDE)', 'Curvas de Nivel y Cubicación (m³)'],
    deliverable: 'Planos altimétricos con equidistancia configurable, perfiles y volumen exacto de acopios.',
    nubleUseCase: 'Cubicaciones de áridos, diseño de drenajes agrícolas y obras civiles.'
  }
]

export const PilotoAnalistaStation: React.FC = () => {
  const { goToStation } = usePlatformStore()
  const [selectedIdx, setSelectedIdx] = useState<number>(0)
  const active = MISSIONS[selectedIdx]

  return (
    <section aria-labelledby="seg-c2-st0-title" className="space-y-6">
      {/* Hero Banner */}
      <div className="apple-glass rounded-3xl p-5 sm:p-6 grid gap-6 lg:grid-cols-12 items-center">
        <div className="lg:col-span-6 space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-800">
            <Radar className="size-3.5" />
            <span>Clase 2 • 4° Medio Geomática II</span>
          </span>
          <h1
            id="seg-c2-st0-title"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight"
          >
            De Piloto a Analista de Datos Espaciales
          </h1>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            En 3° Medio aprendes a dominar el vuelo seguro. En 4° Medio el dron se transforma en un{' '}
            <strong>instrumento científico volante</strong>: capturas bandas térmicas, multiespectrales y modelos 3D que resuelven problemas reales de la agricultura, las emergencias y la topografía.
          </p>
        </div>

        <div className="lg:col-span-6 relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 shadow-lg">
          <SafeMediaImage mediaKey="geomatica4Medio" fallbackKey="grade4Geomatica" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-3.5 inset-x-4 text-white flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-extrabold">4 Misiones Reales de 4° Medio</span>
            <span className="rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-3 py-1 text-xs font-semibold">
              Térmica · NDVI · Fotogrametría · Topografía
            </span>
          </div>
        </div>
      </div>

      {/* 4 Interactive Mission Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MISSIONS.map((m, idx) => {
          const Icon = m.icon
          const isSelected = idx === selectedIdx
          return (
            <button
              key={m.id}
              onClick={() => setSelectedIdx(idx)}
              className={`rounded-3xl p-4 sm:p-5 text-left transition-all flex flex-col justify-between gap-4 active:scale-[0.985] ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xl ring-2 ring-sky-500/60 -translate-y-0.5'
                  : 'apple-glass hover:bg-white/95 text-slate-900 hover:-translate-y-0.5'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex size-10 items-center justify-center rounded-2xl ${
                      isSelected ? 'bg-sky-500 text-slate-950' : 'bg-blue-600/10 text-blue-700'
                    }`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      isSelected ? 'bg-white/15 text-sky-300' : 'bg-slate-900/5 text-slate-700'
                    }`}
                  >
                    {m.drone}
                  </span>
                </div>

                <div>
                  <h2 className="text-base sm:text-lg font-extrabold tracking-tight leading-snug">
                    {m.title}
                  </h2>
                  <p className={`mt-1 text-xs sm:text-sm leading-snug ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                    {m.sensor}
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                  isSelected ? 'text-sky-400' : 'text-blue-700'
                }`}
              >
                <span>{isSelected ? 'Seleccionada' : 'Ver flujo de datos'}</span>
                <ArrowRight className="size-3.5" />
              </span>
            </button>
          )
        })}
      </div>

      {/* Selected Mission Data Pipeline */}
      <div className="apple-glass rounded-3xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-3 py-0.5 text-xs font-bold ${active.badgeCls}`}>
              Flujo Técnico • {active.drone}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {active.nubleUseCase}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {active.pipeline.map((step, i) => (
              <React.Fragment key={step}>
                <span className="rounded-xl bg-white/90 border border-slate-200 px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-800">
                  {i + 1}. {step}
                </span>
                {i < active.pipeline.length - 1 && (
                  <ArrowRight className="size-4 text-slate-400 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>

          <p className="text-sm text-slate-700 font-medium leading-relaxed">
            <strong className="text-slate-900">Producto final:</strong> {active.deliverable}
          </p>
        </div>

        <button
          onClick={() => goToStation(active.stationIdx)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 shadow-md transition-all active:scale-[0.98] shrink-0"
        >
          <span>Abrir Simulador de {active.title.split(':')[0]}</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </section>
  )
}
