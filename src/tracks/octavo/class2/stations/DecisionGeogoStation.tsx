import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  Cpu,
  Layers,
  Plane,
  Wrench,
  Sparkles,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  Compass
} from 'lucide-react'
import { MEDIA_CATALOG } from '../../../../data/media'
import { usePlatformStore } from '../../../../store/usePlatformStore'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

interface TimelineStep {
  id: string
  grade: string
  subject: string
  summary: string
  whatYouBuild: string
  skills: string[]
  icon: React.ReactNode
  accentBg: string
}

const GEOGO_TIMELINE: TimelineStep[] = [
  {
    id: '1-medio',
    grade: '1° Medio',
    subject: 'Geogo I • Fundamentos y Prototipos',
    summary:
      'Empiezas desde cero: aprendes cómo viaja la electricidad, programas Arduino con ayuda de IA y dibujas tus primeras piezas en 3D.',
    whatYouBuild:
      'Construyes tu primer circuito funcional con sensores (como un radar ultrasónico) y su carcasa dibujada en 3D a medida.',
    skills: ['Electrónica y Ley de Ohm', 'Arduino en C++ e IA', 'Diseño 3D en Fusion'],
    icon: <Cpu className="size-5" />,
    accentBg: 'bg-emerald-600'
  },
  {
    id: '2-medio',
    grade: '2° Medio',
    subject: 'Geogo II • Placas PCB y Fabricación Digital',
    summary:
      'Das el salto de los cables de prueba a placas electrónicas soldadas por ti mismo, combinando impresión 3D, corte láser y Python.',
    whatYouBuild:
      'Construyes un proyecto completo y resistente: tu propia placa PCB soldada con estaño dentro de un chasis fabricado en 3D y láser.',
    skills: ['Diseño y soldadura de PCB', 'Impresión 3D y Corte Láser', 'Python y control de sensores'],
    icon: <Layers className="size-5" />,
    accentBg: 'bg-blue-600'
  }
]

const REASONS = [
  {
    title: 'Proyectos reales con tus manos',
    description:
      'Aquí no te quedas solo mirando la pizarra: armas circuitos, sueldas componentes, imprimes en 3D y ves funcionar tus propias creaciones.',
    icon: <Wrench className="size-5 text-emerald-700" />,
    iconBg: 'bg-emerald-500/12'
  },
  {
    title: 'Un laboratorio equipado de verdad',
    description:
      'Trabajas desde 1° Medio con impresoras 3D, cortadora láser, placas Arduino, sensores reales y herramientas listas para inventar.',
    icon: <Sparkles className="size-5 text-blue-700" />,
    iconBg: 'bg-blue-500/12'
  },
  {
    title: 'La puerta directa a los drones',
    description:
      'Todo lo que aprendes en Geogo (1° y 2° Medio) es la base exacta que necesitas para volar y operar drones profesionales en 3° y 4° Medio.',
    icon: <Plane className="size-5 text-sky-700" />,
    iconBg: 'bg-sky-500/12'
  }
]

export const DecisionGeogoStation: React.FC = () => {
  const { setPremilitarModal } = usePlatformStore()
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0)
  const [choice, setChoice] = useState<'enthusiastic' | 'curious' | null>(null)

  const fallbackImg = MEDIA_CATALOG.grade2Pcb3D.src
  const decisionImg = MEDIA_CATALOG['octavoDecision']?.src ?? fallbackImg

  const activeStep = GEOGO_TIMELINE[activeStepIdx]

  const handleConfirm = (nextChoice: 'enthusiastic' | 'curious') => {
    setChoice(nextChoice)
    confetti({
      particleCount: nextChoice === 'enthusiastic' ? 65 : 35,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#059669', '#0284c7', '#10b981', '#0f172a']
    })
  }

  return (
    <section aria-labelledby="c2-st5-title" className="space-y-6">
      {/* Hero Conclusion Card */}
      <div className="apple-glass rounded-3xl p-5 sm:p-7 grid gap-6 lg:grid-cols-12 items-center">
        <div className="lg:col-span-6 space-y-5">
          <div className="space-y-2.5">
            <h1 id="c2-st5-title" className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              ¿Te vienes a Geogo en 1° Medio?
            </h1>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Ya viviste la electrónica, el diseño 3D, la programación con IA y un primer vistazo a los drones. Si te gusta crear cosas reales y entender cómo funciona la tecnología por dentro, este es tu lugar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleConfirm('enthusiastic')}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all active:scale-[0.98] shadow-md ${
                choice === 'enthusiastic'
                  ? 'bg-emerald-700 text-white ring-4 ring-emerald-500/30'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              <CheckCircle2 className="size-4" />
              <span>¡Sí, quiero elegir Geogo!</span>
            </button>

            <button
              type="button"
              onClick={() => handleConfirm('curious')}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold border transition-all active:scale-[0.98] ${
                choice === 'curious'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>Me interesa, quiero saber más</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {choice && (
              <motion.div
                key={choice}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm sm:text-base font-semibold text-slate-900 leading-relaxed"
              >
                {choice === 'enthusiastic'
                  ? '¡Excelente decisión! Te esperamos en el taller de 1° Medio para armar tu primer proyecto desde la semana uno.'
                  : '¡Buen punto! Quédate unos minutos al cierre o pregúntale ahora mismo al profesor para resolver cualquier duda.'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-6 relative aspect-video rounded-2xl overflow-hidden bg-slate-950 shadow-lg group">
          <img
            src={decisionImg}
            onError={(e) => {
              if (e.currentTarget.src !== fallbackImg) {
                e.currentTarget.src = fallbackImg
              }
            }}
            alt="Taller de electrónica y fabricación digital de Geogo en 1° y 2° Medio"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        </div>
      </div>

      {/* Animated Timeline of 1° Medio & 2° Medio */}
      <div className="apple-glass rounded-3xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              Tu Camino en Geogo: 1° y 2° Medio
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Haz clic en cada año para ver qué herramientas usarás y qué construirás con ellas.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/5 border border-slate-900/10 px-4 py-1.5 text-sm font-bold text-slate-800 shrink-0">
            <Plane className="size-4 text-blue-600" />
            <span>Luego en 3° y 4° Medio: Geomática y Drones</span>
          </div>
        </div>

        {/* Animated Progress Track */}
        <div className="relative pt-2">
          <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden mb-4">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-600"
              initial={false}
              animate={{ width: activeStepIdx === 0 ? '50%' : '100%' }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {GEOGO_TIMELINE.map((step, idx) => {
              const isActive = idx === activeStepIdx
              return (
                <motion.button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStepIdx(idx)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.08, ease: EASE_OUT }}
                  className={`rounded-2xl p-5 text-left transition-all active:scale-[0.99] border ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg ring-2 ring-emerald-500/50'
                      : 'bg-white/80 text-slate-900 border-slate-200/80 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs sm:text-sm font-bold text-white ${step.accentBg}`}
                    >
                      {step.icon}
                      <span>{step.grade}</span>
                    </span>
                    <span className={`text-xs font-semibold ${isActive ? 'text-emerald-300' : 'text-slate-500'}`}>
                      {isActive ? 'Seleccionado' : 'Ver detalle'}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold tracking-tight">{step.subject}</h3>
                  <p className={`mt-1.5 text-sm leading-relaxed ${isActive ? 'text-slate-200' : 'text-slate-700'}`}>
                    {step.summary}
                  </p>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Active Year Build Spotlight */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="rounded-2xl bg-blue-600/[0.06] border border-blue-600/15 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1 max-w-2xl">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-800 block">
                Qué vas a construir en {activeStep.grade}
              </span>
              <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                {activeStep.whatYouBuild}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              {activeStep.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-white border border-slate-200/80 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3 Concrete Reasons to Choose Geogo */}
      <div className="grid gap-4 md:grid-cols-3">
        {REASONS.map((reason) => (
          <div key={reason.title} className="apple-glass rounded-3xl p-5 space-y-2.5">
            <div className={`flex size-11 items-center justify-center rounded-2xl ${reason.iconBg}`}>
              {reason.icon}
            </div>
            <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
              {reason.title}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {reason.description}
            </p>
          </div>
        ))}
      </div>

      {/* Portal Link + Talk to the Teacher Block */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="apple-glass rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-700">
              <Compass className="size-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900">
                Mira proyectos hechos en el liceo
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Explora trabajos reales de estudiantes mayores en el portal oficial <strong>premilitar.liceosannicolas.cl</strong>.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPremilitarModal(true)}
            className="self-start inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 shadow-sm transition-all active:scale-[0.98]"
          >
            <span>Abrir Portal premilitar.liceosannicolas.cl</span>
            <ExternalLink className="size-4" />
          </button>
        </div>

        <div className="apple-glass rounded-3xl p-5 sm:p-6 flex items-start gap-4 border-emerald-500/25">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-700">
            <MessageCircle className="size-5" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-extrabold text-slate-900">
              ¿Dudas? Conversa con el profesor
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Levanta la mano ahora o acércate al terminar la clase para preguntarle sobre horarios, materiales, cupos y cómo postular a Geogo en 1° Medio.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
