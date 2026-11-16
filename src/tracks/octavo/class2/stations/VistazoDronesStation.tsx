import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plane, ShieldCheck, ArrowRight } from 'lucide-react'
import { FLEET_DRONES } from '../../../../data/curriculumData'
import { MEDIA_CATALOG } from '../../../../data/media'
import { usePlatformStore } from '../../../../store/usePlatformStore'

interface DroneHotspot {
  id: 'helices' | 'motores' | 'controladora' | 'bateria'
  number: number
  label: string
  sentence: string
  xPercent: number
  yPercent: number
}

const HOTSPOTS: DroneHotspot[] = [
  {
    id: 'helices',
    number: 1,
    label: 'Hélices',
    sentence: 'Empujan el aire hacia abajo; dos giran en un sentido y dos al revés para que el dron no dé vueltas solo.',
    xPercent: 38,
    yPercent: 12
  },
  {
    id: 'motores',
    number: 2,
    label: 'Motores brushless',
    sentence: 'Motores sin escobillas: usan imanes y bobinas para girar rapidísimo casi sin roce ni desgaste.',
    xPercent: 37,
    yPercent: 36
  },
  {
    id: 'controladora',
    number: 3,
    label: 'Controladora de vuelo',
    sentence: 'El cerebro del dron: mide el equilibrio mil veces por segundo para mantenerlo estable en el aire.',
    xPercent: 50,
    yPercent: 42
  },
  {
    id: 'bateria',
    number: 4,
    label: 'Batería LiPo',
    sentence: 'Batería de polímero de litio: entrega mucha energía en poco peso para alimentar los cuatro motores.',
    xPercent: 50,
    yPercent: 80
  }
]

const DRONE_ONE_LINER: Record<string, { image: string; shortName: string; line: string }> = {
  'dji-neo': {
    image: MEDIA_CATALOG.grade3Drones.src,
    shortName: 'DJI NEO',
    line: 'Vuela seguro en sala con hélices enjauladas.'
  },
  'fpv-indoor': {
    image: MEDIA_CATALOG.grade3Drones.src,
    shortName: 'FPV Indoor',
    line: 'Ágil y protegido para maniobrar en interiores.'
  },
  'fpv-outdoor': {
    image: MEDIA_CATALOG.droneExplodedView.src,
    shortName: 'FPV Outdoor 5"',
    line: 'Chasis de carbono con electrónica a la vista.'
  },
  'dji-mini-4k': {
    image: MEDIA_CATALOG.grade3Drones.src,
    shortName: 'DJI Mini 4K',
    line: 'Dron escuela de 3° Medio para grabar en 4K.'
  },
  'phantom-4': {
    image: MEDIA_CATALOG.photogrammetry3D.src,
    shortName: 'Phantom 4 Pro',
    line: 'Mapea el liceo para crear modelos en 3D.'
  },
  'mavic-3t': {
    image: MEDIA_CATALOG.thermalSensorSar.src,
    shortName: 'Mavic 3T (Térmico)',
    line: 'Detecta calor humano en rescates nocturnos.'
  },
  'mavic-3m': {
    image: MEDIA_CATALOG.ndviAgriculture.src,
    shortName: 'Mavic 3M (NDVI)',
    line: 'Cuida cultivos midiendo la salud de las plantas.'
  }
}

const EASE_OUT = [0.23, 1, 0.32, 1] as const

export const VistazoDronesStation: React.FC = () => {
  const { nextStation } = usePlatformStore()
  const [activeId, setActiveId] = useState<DroneHotspot['id']>('controladora')
  const activeHotspot = HOTSPOTS.find((h) => h.id === activeId) ?? HOTSPOTS[0]

  return (
    <section aria-labelledby="c2-st3-title" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h2 id="c2-st3-title" className="text-3xl font-extrabold tracking-tight text-slate-900">
            Un Vistazo a los Drones del Liceo
          </h2>
          <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed">
            La electrónica, la programación y las piezas 3D que conociste se unen aquí. Haz clic en los 4 puntos del dron para ver qué hace cada parte:
          </p>
        </div>
      </div>

      {/* Main Visual Interactive Hotspots Block */}
      <div className="grid gap-5 lg:grid-cols-12 items-stretch">
        {/* Large Exploded Drone Image with 4 Clickable Hotspots */}
        <div className="lg:col-span-8 apple-glass-dark rounded-3xl overflow-hidden relative aspect-video shadow-xl">
          <img
            src={MEDIA_CATALOG.droneExplodedView.src}
            alt={MEDIA_CATALOG.droneExplodedView.title}
            className="w-full h-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/20" />

          {HOTSPOTS.map((spot) => {
            const isSelected = spot.id === activeId
            return (
              <button
                key={spot.id}
                type="button"
                onClick={() => setActiveId(spot.id)}
                aria-label={`${spot.label}: ${spot.sentence}`}
                aria-pressed={isSelected}
                style={{ left: `${spot.xPercent}%`, top: `${spot.yPercent}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center group focus:outline-none"
              >
                {!isSelected && (
                  <span className="absolute size-10 rounded-full bg-sky-400/35 animate-ping pointer-events-none" />
                )}
                <span
                  className={`relative z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:text-sm font-extrabold transition-all duration-200 active:scale-95 shadow-lg border ${
                    isSelected
                      ? 'bg-emerald-500 text-white border-white ring-4 ring-emerald-400/40 scale-105'
                      : 'bg-slate-900/85 text-white border-white/40 hover:bg-blue-600 hover:border-white'
                  }`}
                >
                  <span className="flex size-5 items-center justify-center rounded-full bg-white/20 text-xs font-black">
                    {spot.number}
                  </span>
                  <span className="hidden sm:inline">{spot.label}</span>
                </span>
              </button>
            )
          })}
        </div>

        {/* Clean Active Hotspot Panel + Quick Selector */}
        <div className="lg:col-span-4 apple-glass rounded-3xl p-5 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {HOTSPOTS.map((spot) => {
                const isSelected = spot.id === activeId
                return (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => setActiveId(spot.id)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition-all active:scale-[0.98] ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-md ring-2 ring-emerald-500/60'
                        : 'bg-white/75 text-slate-800 hover:bg-white border border-slate-200/70'
                    }`}
                  >
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                        isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-900/10 text-slate-700'
                      }`}
                    >
                      {spot.number}
                    </span>
                    <span>{spot.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeHotspot.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
              className="rounded-2xl bg-emerald-500/10 border border-emerald-500/25 p-4 space-y-1.5"
            >
              <h3 className="text-base font-extrabold text-slate-900">
                {activeHotspot.number}. {activeHotspot.label}
              </h3>
              <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed">
                {activeHotspot.sentence}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Compact Strip of the 7 Real Drones */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
            Los 7 Drones Reales de Nuestro Liceo
          </h3>
          <span className="text-sm font-semibold text-slate-600">
            Desde sala de clases hasta operaciones profesionales
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3">
          {FLEET_DRONES.map((drone) => {
            const info = DRONE_ONE_LINER[drone.id] ?? {
              image: MEDIA_CATALOG.grade3Drones.src,
              shortName: drone.name,
              line: drone.category
            }
            return (
              <div
                key={drone.id}
                className="group apple-glass rounded-2xl p-2.5 flex flex-col gap-2 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-950">
                  <img
                    src={info.image}
                    alt={info.shortName}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="px-1 pb-0.5 space-y-1">
                  <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                    {info.shortName}
                  </h4>
                  <p className="text-sm text-slate-700 leading-snug">
                    {info.line}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Safe In-Class Demo Card + Motivating Closing */}
      <div className="grid gap-4 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 apple-glass rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 border-emerald-500/30">
          <div className="relative w-full sm:w-52 aspect-video rounded-2xl overflow-hidden bg-slate-950 shrink-0">
            <img
              src={MEDIA_CATALOG.grade3Drones.src}
              alt="Drones seguros DJI NEO y FPV Indoor con protectores de hélices"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-sm font-extrabold text-emerald-800">
              <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
              <span>Demo en Sala: DJI NEO y FPV Indoor</span>
            </div>
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
              Hacemos un vuelo corto frente al curso. Sus hélices llevan jaula protectora 360° para volar de forma segura dentro de la sala.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 apple-glass-dark rounded-3xl p-5 sm:p-6 text-white flex flex-col justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Plane className="size-5" />
            </div>
            <p className="text-base sm:text-lg font-extrabold leading-snug">
              Todo esto lo dominarás en 3° y 4° Medio si eliges el camino de la especialidad.
            </p>
          </div>

          <button
            type="button"
            onClick={nextStation}
            className="self-start inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-400 shadow-md transition-all active:scale-[0.98]"
          >
            <span>Jugar Trivia Final</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
