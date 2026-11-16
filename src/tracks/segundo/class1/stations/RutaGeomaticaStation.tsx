import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Compass, Cpu, ExternalLink, Layers, Plane, Radar } from 'lucide-react'
import { usePlatformStore } from '../../../../store/usePlatformStore'
import { SafeMediaImage } from '../../components/SafeMediaImage'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const YEAR_BLOCKS = [
  {
    id: '3-medio',
    grade: '3° Medio • Geomática I',
    title: 'Ingeniería RPAS, Pilotaje y Normativa DGAC',
    mediaKey: 'geomatica3Medio',
    fallbackKey: 'grade3Drones' as const,
    accentBadge: 'bg-blue-600 text-white',
    ringColor: 'border-blue-500/25',
    practicalGoal:
      'Construir, diagnosticar y pilotar cuadricópteros en Modo 2 evaluando física de empuje, meteorología METAR y reglamentos chilenos DAN 91 / DAN 151.',
    tools: ['FPV Indoor / Outdoor 5"', 'DJI NEO & Mini 4K', 'Control Modo 2', 'Normativa DGAC / METAR'],
    competencies: [
      'Arquitectura completa: chasis 3K, motores brushless, ESC 4-en-1, FC y LiPo.',
      'Equilibrio aerodinámico CW/CCW, relación empuje/peso y control en 3 ejes.',
      'Evaluación pre-vuelo profesional y operación segura en espacios controlados.'
    ]
  },
  {
    id: '4-medio',
    grade: '4° Medio • Geomática II',
    title: 'Sensores Térmicos, NDVI, Fotogrametría y Topografía',
    mediaKey: 'geomatica4Medio',
    fallbackKey: 'grade4Geomatica' as const,
    accentBadge: 'bg-sky-600 text-white',
    ringColor: 'border-sky-500/25',
    practicalGoal:
      'Planificar misiones autónomas de rescate térmico, agricultura multiespectral NDVI, reconstrucción 3D y levantamientos topográficos con GNSS RTK y cubicación de acopios.',
    tools: ['DJI Mavic 3T (Térmica)', 'DJI Mavic 3M (NDVI)', 'Phantom 4 Pro / RTK', 'MDE y Curvas de Nivel'],
    competencies: [
      'Detección radiométrica LWIR (8–14 µm) para Búsqueda y Rescate (SAR).',
      'Cálculo de vigor vegetal NDVI y prescripción agrícola por zonas.',
      'Topografía con drones: GCP, precisión centimétrica RTK, perfiles y volúmenes (m³).'
    ]
  }
]

const BRIDGE_PILLARS = [
  {
    icon: Cpu,
    from: '1° Medio • Geogo I',
    to: 'Controladora de Vuelo y Telemetría',
    detail: 'Los pines, sensores y lógica en C++ ahora gobiernan el giroscopio e IMU de una aeronave.'
  },
  {
    icon: Layers,
    from: '2° Medio • Geogo II',
    to: 'Chasis 3K, PCB ESC y Manufactura',
    detail: 'Las placas soldadas, piezas CAD paramétricas y Python escalan a sistemas aéreos reales.'
  },
  {
    icon: Radar,
    from: '3° y 4° Medio • Geomática',
    to: 'Ingeniería Territorial con Datos',
    detail: 'Vuelas para capturar mapas térmicos, índices NDVI, nubes de puntos y topografía RTK.'
  }
]

export const RutaGeomaticaStation: React.FC = () => {
  const { goToStation, setActiveClass, setPremilitarModal } = usePlatformStore()

  return (
    <section aria-labelledby="seg-st0-title" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <h1
            id="seg-st0-title"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight"
          >
            Ruta Geomática: 3° y 4° Medio
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            En 1° y 2° Medio aprendiste a construir hardware y programar en{' '}
            <strong className="text-slate-900">Geogo</strong>. Los próximos dos años despegarás hacia la{' '}
            <strong className="text-slate-900">ingeniería aeronáutica RPAS y el análisis territorial con drones</strong>.
          </p>
        </div>

        <button
          onClick={() => setPremilitarModal(true)}
          className="apple-glass hover:bg-white rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-800 inline-flex items-center gap-2 transition-all active:scale-[0.98] shrink-0"
        >
          <Compass className="size-4 text-blue-600" />
          <span>Proyectos en premilitar.liceosannicolas.cl</span>
          <ExternalLink className="size-3.5 text-slate-400" />
        </button>
      </div>

      {/* 2-Year Bento Grid */}
      <div className="grid gap-5 lg:grid-cols-2">
        {YEAR_BLOCKS.map((block, idx) => (
          <motion.article
            key={block.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08, ease: EASE_OUT }}
            className={`apple-glass rounded-3xl p-4 sm:p-5 flex flex-col justify-between gap-4 border ${block.ringColor}`}
          >
            {/* Visual Header (no caption underneath) */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 shadow-md group">
              <SafeMediaImage
                mediaKey={block.mediaKey}
                fallbackKey={block.fallbackKey}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />

              <div className="absolute top-3.5 left-3.5">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold shadow-sm ${block.accentBadge}`}>
                  <Plane className="size-3.5" />
                  <span>{block.grade}</span>
                </span>
              </div>

              <div className="absolute bottom-3.5 inset-x-4 space-y-2 text-white">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug">
                  {block.title}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {block.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full bg-white/15 backdrop-blur-md border border-white/20 px-2.5 py-0.5 text-xs font-semibold text-white"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Practical Goal & Competencies */}
            <div className="space-y-4 px-1 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="rounded-2xl bg-blue-600/[0.06] border border-blue-600/15 p-3.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-800 block mb-1">
                    Meta Práctica del Año
                  </span>
                  <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                    {block.practicalGoal}
                  </p>
                </div>

                <ul className="space-y-2">
                  {block.competencies.map((comp) => (
                    <li key={comp} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700">
                        <Check className="size-3.5 stroke-[2.5]" />
                      </span>
                      <span className="leading-snug font-medium">{comp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                {idx === 0 ? (
                  <button
                    onClick={() => goToStation(1)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 shadow-sm transition-all active:scale-[0.98]"
                  >
                    <span>Desarmar Dron en 3D (Estación 2)</span>
                    <ArrowRight className="size-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveClass('class-2')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 shadow-sm transition-all active:scale-[0.98]"
                  >
                    <span>Explorar Sensores y Topografía (Clase 2)</span>
                    <ArrowRight className="size-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Geogo -> Geomatica Continuity Strip */}
      <div className="apple-glass rounded-3xl p-4 sm:p-5 grid gap-3.5 sm:grid-cols-3">
        {BRIDGE_PILLARS.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.from}
              className="rounded-2xl bg-white/80 border border-slate-200/75 p-4 space-y-1.5"
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                <Icon className="size-4" />
                <span>{item.from}</span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">{item.to}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.detail}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
