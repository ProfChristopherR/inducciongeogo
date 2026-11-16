import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Cpu, Plane, ExternalLink, GraduationCap, Compass } from 'lucide-react'
import { TRACK_LIST } from '../../tracks/registry'
import { MEDIA_CATALOG } from '../../data/media'
import { usePlatformStore } from '../../store/usePlatformStore'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const FALLBACK_IMAGES: Record<'octavo' | 'segundo', string> = {
  octavo: MEDIA_CATALOG.heroOverview.src,
  segundo: MEDIA_CATALOG.grade4Geomatica.src
}

const TRACK_META: Record<
  'octavo' | 'segundo',
  {
    audience: string
    accentPill: string
    accentBorder: string
    accentRing: string
    buttonBg: string
    icon: React.ReactNode
    topics: string[]
  }
> = {
  octavo: {
    audience: 'Estudiantes de 8° Básico',
    accentPill: 'bg-emerald-500/90 text-white',
    accentBorder: 'hover:border-emerald-400/60',
    accentRing: 'group-hover:shadow-[0_24px_60px_-12px_rgba(16,185,129,0.22)]',
    buttonBg: 'bg-emerald-600 group-hover:bg-emerald-500',
    icon: <Cpu className="size-4" />,
    topics: ['Ley de Ohm 3D', 'PCB y Soldadura', 'CAD Paramétrico e Impresión 3D', 'IA + Arduino', 'Vistazo a Drones']
  },
  segundo: {
    audience: 'Estudiantes de 2° Medio',
    accentPill: 'bg-indigo-600/90 text-white',
    accentBorder: 'hover:border-indigo-400/60',
    accentRing: 'group-hover:shadow-[0_24px_60px_-12px_rgba(79,70,229,0.24)]',
    buttonBg: 'bg-indigo-600 group-hover:bg-indigo-500',
    icon: <Plane className="size-4" />,
    topics: ['Anatomía 3D RPAS', 'Física de Vuelo y Modo 2', 'Flota 7 Drones + DGAC', 'Mavic 3T / 3M', 'Fotogrametría y Topografía RTK']
  }
}

export const TrackPicker: React.FC = () => {
  const { setTrack, setPremilitarModal } = usePlatformStore()

  return (
    <div className="min-h-screen flex flex-col justify-between px-4 py-6 sm:px-8 sm:py-8">
      {/* Top Institutional Bar */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        className="mx-auto w-full max-w-6xl flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md ring-1 ring-black/10">
            <GraduationCap className="size-5 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900">
                Especialidad Geogo &amp; Geomática
              </span>
              <span className="hidden sm:inline-flex rounded-full bg-slate-900/5 border border-slate-900/10 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                Liceo Bicentenario San Nicolás
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500">
              Plataforma interactiva de inducción tecnológica • Región de Ñuble
            </p>
          </div>
        </div>

        <button
          onClick={() => setPremilitarModal(true)}
          className="apple-glass hover:bg-white rounded-full px-4 py-2 text-xs font-semibold text-slate-800 inline-flex items-center gap-2 transition-transform active:scale-[0.97]"
        >
          <Compass className="size-3.5 text-blue-600" />
          <span>premilitar.liceosannicolas.cl</span>
          <ExternalLink className="size-3 text-slate-400" />
        </button>
      </motion.header>

      {/* Main Selection Hero */}
      <main className="mx-auto w-full max-w-6xl my-auto py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease: EASE_OUT }}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
            Elige tu Inducción
          </h1>
          <p className="text-sm sm:text-lg text-slate-600 leading-relaxed">
            Dos recorridos interactivos diseñados para vivir el laboratorio en sala antes de tomar tu decisión de especialidad.
          </p>
        </motion.div>

        {/* Two Large Apple Glass Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {TRACK_LIST.map((track, idx) => {
            const meta = TRACK_META[track.id]
            const heroMedia = MEDIA_CATALOG[track.heroMediaKey]
            const imageSrc = heroMedia?.src ?? FALLBACK_IMAGES[track.id]
            const fallbackSrc = FALLBACK_IMAGES[track.id]

            return (
              <motion.button
                key={track.id}
                type="button"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, delay: 0.12 + idx * 0.08, ease: EASE_OUT }}
                whileHover={{ y: -4, transition: { duration: 0.22, ease: EASE_OUT } }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setTrack(track.id)}
                className={`group apple-glass rounded-3xl p-4 sm:p-5 text-left flex flex-col justify-between transition-shadow duration-300 border ${meta.accentBorder} ${meta.accentRing}`}
              >
                {/* Media Showcase */}
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 shadow-md">
                  <img
                    src={imageSrc}
                    onError={(e) => {
                      if (e.currentTarget.src !== fallbackSrc) {
                        e.currentTarget.src = fallbackSrc
                      }
                    }}
                    alt={track.label}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />

                  <div className="absolute top-3.5 left-3.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-sm backdrop-blur-md ${meta.accentPill}`}>
                      {meta.icon}
                      <span>{meta.audience}</span>
                    </span>
                  </div>

                  <div className="absolute bottom-3.5 inset-x-4 text-white space-y-1">
                    <div className="text-xs font-semibold text-white/80">
                      {track.classes.length} clases • {track.classes.reduce((acc, c) => acc + c.stations.length, 0)} estaciones interactivas
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {track.label}
                    </h2>
                  </div>
                </div>

                {/* Body Content */}
                <div className="pt-4 px-1 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <p className="text-sm sm:text-base font-semibold text-slate-900">
                      {track.decisionQuestion}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {track.tagline}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {meta.topics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-full bg-slate-900/[0.04] border border-slate-900/[0.08] px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-200/70">
                      <div className="text-xs font-medium text-slate-500">
                        2 bloques de 90 minutos • Navegación ← / →
                      </div>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors ${meta.buttonBg}`}
                      >
                        <span>Entrar</span>
                        <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </main>

      {/* Subtle Footer Note */}
      <footer className="mx-auto w-full max-w-6xl text-center text-xs text-slate-500">
        Liceo Bicentenario Polivalente San Nicolás • Flota real: DJI NEO, FPV Indoor/Outdoor, Mini 4K, Phantom 4, Mavic 3T y Mavic 3M.
      </footer>
    </div>
  )
}

