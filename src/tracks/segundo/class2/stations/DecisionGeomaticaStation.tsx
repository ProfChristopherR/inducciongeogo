import React, { useState } from 'react'
import confetti from 'canvas-confetti'
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  ExternalLink,
  Flame,
  GraduationCap,
  HardHat,
  Mountain,
  Sprout
} from 'lucide-react'
import { PREMILITAR_PROJECTS } from '../../../../data/curriculumData'
import { usePlatformStore } from '../../../../store/usePlatformStore'
import { SafeMediaImage } from '../../components/SafeMediaImage'

const TIMELINE_STEPS = [
  {
    stage: 'Hoy • 2° Medio',
    title: 'Geogo II',
    summary: 'Cierre de electrónica, placas PCB, CAD 3D y programación base.'
  },
  {
    stage: 'Año 3 • 3° Medio',
    title: 'Geomática I',
    summary: 'Ingeniería RPAS, física de vuelo, Modo 2 y normativa DGAC.'
  },
  {
    stage: 'Año 4 • 4° Medio',
    title: 'Geomática II',
    summary: 'Térmica SAR, multiespectral NDVI, fotogrametría y topografía RTK.'
  },
  {
    stage: 'Egreso Técnico',
    title: 'Proyección Real',
    summary: 'Continuidad en ingeniería, geomensura o desempeño técnico RPAS.'
  }
]

const CAREER_FIELDS = [
  {
    title: 'Agricultura de Precisión',
    detail: 'Mapeo NDVI y prescripción de riego/insumos con drones agrícolas en Ñuble.',
    icon: Sprout,
    colorCls: 'text-emerald-700 bg-emerald-500/12 border-emerald-500/25'
  },
  {
    title: 'Minería y Cubicación',
    detail: 'Cálculo de volúmenes de acopios (m³) y monitoreo seguro de taludes.',
    icon: Mountain,
    colorCls: 'text-amber-800 bg-amber-500/12 border-amber-500/25'
  },
  {
    title: 'Construcción y Topografía',
    detail: 'Modelos Digitales de Elevación (MDE), curvas de nivel y avance de obra RTK.',
    icon: HardHat,
    colorCls: 'text-blue-800 bg-blue-500/12 border-blue-500/25'
  },
  {
    title: 'Emergencias y Rescate (SAR)',
    detail: 'Detección térmica infrarroja nocturna y apoyo táctico en incendios forestales.',
    icon: Flame,
    colorCls: 'text-red-800 bg-red-500/12 border-red-500/25'
  }
]

export const DecisionGeomaticaStation: React.FC = () => {
  const { setActiveClass, setPremilitarModal } = usePlatformStore()
  const [committed, setCommitted] = useState<boolean>(false)

  const handleCommit = () => {
    setCommitted(true)
    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.65 },
      colors: ['#0284c7', '#10b981', '#f59e0b', '#e2e8f0']
    })
  }

  return (
    <section aria-labelledby="seg-c2-st7-title" className="space-y-6">
      {/* Hero Decision Header */}
      <div className="apple-glass rounded-3xl p-5 sm:p-6 grid gap-6 lg:grid-cols-12 items-center">
        <div className="lg:col-span-6 space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-800">
            <GraduationCap className="size-4" />
            <span>Decisión Vocacional • Liceo San Nicolás</span>
          </span>
          <h1
            id="seg-c2-st7-title"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight"
          >
            ¿Sigues la senda en 3° y 4° Medio?
          </h1>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Todo lo que ya construiste en Geogo es la base. En <strong>3° y 4° Medio (Geomática)</strong> tomarás los mandos de la flota real para transformar territorio, cultivos, emergencias y topografía en decisiones de ingeniería.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleCommit}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold shadow-md transition-all active:scale-[0.97] ${
                committed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="size-4" />
              <span>{committed ? '¡Rumbo a Geomática Confirmado ✓!' : 'Quiero seguir la senda Geomática'}</span>
            </button>

            <button
              onClick={() => setPremilitarModal(true)}
              className="apple-glass hover:bg-white rounded-full px-4 py-3 text-sm font-semibold text-slate-800 inline-flex items-center gap-2 transition-all"
            >
              <Compass className="size-4 text-blue-600" />
              <span>Ver Portal Premilitar</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 shadow-lg">
          <SafeMediaImage mediaKey="segundoDecision" fallbackKey="grade4Geomatica" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-3.5 inset-x-4 flex flex-wrap items-center justify-between gap-2 text-white">
            <span className="text-sm font-extrabold">Geomática • 3° y 4° Medio</span>
            <a
              href="https://premilitar.liceosannicolas.cl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 px-3 py-1 text-xs font-bold text-white transition-colors"
            >
              <span>premilitar.liceosannicolas.cl</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Timeline 2° -> 3° -> 4° -> Egreso */}
      <div className="apple-glass rounded-3xl p-5 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Línea de Progresión Técnica
        </span>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TIMELINE_STEPS.map((step, idx) => (
            <div
              key={step.stage}
              className={`rounded-2xl border p-4 space-y-1.5 ${
                idx === 1 || idx === 2
                  ? 'bg-blue-600/[0.06] border-blue-600/20'
                  : 'bg-white/85 border-slate-200/75'
              }`}
            >
              <span className="text-xs font-bold text-blue-700 block">{step.stage}</span>
              <h2 className="text-base font-extrabold text-slate-900">{step.title}</h2>
              <p className="text-sm text-slate-600 leading-snug">{step.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Real Career Fields + Liceo Real Projects */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Career Fields (6 cols) */}
        <div className="lg:col-span-6 apple-glass rounded-3xl p-5 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Campo Laboral Real en Chile
          </span>
          <div className="grid gap-3 sm:grid-cols-2">
            {CAREER_FIELDS.map((field) => {
              const Icon = field.icon
              return (
                <div
                  key={field.title}
                  className="rounded-2xl bg-white/85 border border-slate-200/75 p-4 space-y-2"
                >
                  <span className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-bold ${field.colorCls}`}>
                    <Icon className="size-3.5" />
                    <span>{field.title}</span>
                  </span>
                  <p className="text-sm text-slate-700 leading-snug">{field.detail}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Real Projects from premilitar.liceosannicolas.cl (6 cols) */}
        <div className="lg:col-span-6 apple-glass rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <Award className="size-4" />
              Proyectos Reales en el Liceo
            </span>
            <a
              href="https://premilitar.liceosannicolas.cl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-blue-700 hover:underline inline-flex items-center gap-1"
            >
              <span>Abrir web</span>
              <ExternalLink className="size-3" />
            </a>
          </div>

          <div className="space-y-2.5">
            {PREMILITAR_PROJECTS.map((proj) => (
              <div
                key={proj.title}
                className="rounded-2xl bg-white/85 border border-slate-200/75 p-3.5 space-y-1"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <strong className="text-sm font-extrabold text-slate-900">{proj.title}</strong>
                  <span className="rounded-full bg-blue-600/10 px-2.5 py-0.5 text-[11px] font-bold text-blue-800">
                    {proj.category}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">{proj.summary}</p>
                <span className="text-xs font-mono font-bold text-emerald-700 block">
                  {proj.metrics}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-1 flex justify-end">
            <button
              onClick={() => setActiveClass('class-1')}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900/5 hover:bg-slate-900/10 px-4 py-2 text-xs font-bold text-slate-800 transition-colors"
            >
              <span>Repasar Clase 1 (3° Medio)</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
