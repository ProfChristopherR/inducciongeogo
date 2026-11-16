import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import confetti from 'canvas-confetti'
import { usePlatformStore } from '../../../../store/usePlatformStore'

const QUESTIONS = [
  {
    q: '1. ¿Para qué sirve la resistencia que viste en el simulador 3D y tocaste en la Bandeja 1?',
    a: 'Frena y regula la corriente eléctrica (Ley de Ohm: I = V / R). Sin ella, pasa demasiada electricidad de golpe y el LED se quema en milisegundos.'
  },
  {
    q: '2. ¿Por qué en 2° Medio cambiamos la protoboard blanca por una placa PCB soldada con estaño?',
    a: 'Porque los cables puestos a presión en una protoboard se sueltan con cualquier movimiento fuerte. En una placa PCB, las pistas de cobre soldadas aguantan vibraciones en robots y drones.'
  },
  {
    q: '3. ¿Por qué diseñamos en 3D con medidas conectadas (paramétricas) en lugar de dibujar cada línea a mano?',
    a: 'Porque así todo queda vinculado: si cambias el tamaño de un motor, el soporte y los orificios de los pernos se ajustan solos sin empezar desde cero.'
  }
]

export const CierreClase1Station: React.FC = () => {
  const { setActiveClass } = usePlatformStore()
  const [activeQuestion, setActiveQuestion] = useState<number>(0)
  const [showAnswer, setShowAnswer] = useState<boolean>(false)

  return (
    <section aria-labelledby="st5-title" className="space-y-6 max-w-4xl mx-auto">
      <div className="apple-glass rounded-3xl p-8 text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
          Síntesis • Cierre de Clase 1 (8° Básico)
        </span>
        <h2 id="st5-title" className="text-3xl font-extrabold tracking-tight text-slate-900">
          Repaso Rápido en Sala
        </h2>
        <p className="text-sm sm:text-base text-slate-700 max-w-2xl mx-auto leading-relaxed">
          Responde estas tres preguntas a mano alzada antes de pasar a la Clase 2 de 8°, donde le daremos vida con Inteligencia Artificial y veremos los drones del liceo.
        </p>
      </div>

      <div className="apple-glass rounded-3xl p-7 space-y-5">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500">
          <span>
            PREGUNTA {activeQuestion + 1} DE {QUESTIONS.length}
          </span>
          <span className="text-blue-700">¡Levanta la mano para responder!</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-snug">
          {QUESTIONS[activeQuestion].q}
        </h3>

        <AnimatePresence mode="wait">
          {showAnswer ? (
            <motion.div
              key="answer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5"
            >
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Check className="size-4 text-emerald-600 stroke-[2.5]" />
                Respuesta Clave
              </span>
              <p className="mt-2 text-base font-semibold text-slate-900 leading-relaxed">
                {QUESTIONS[activeQuestion].a}
              </p>
            </motion.div>
          ) : (
            <motion.button
              key="reveal-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => {
                setShowAnswer(true)
                confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } })
              }}
              className="w-full rounded-2xl border border-slate-300/80 bg-white/80 py-4 text-sm sm:text-base font-semibold text-slate-800 hover:border-blue-500 hover:text-blue-700 shadow-2xs transition-all"
            >
              Mostrar Respuesta en Pantalla
            </motion.button>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/60">
          <button
            onClick={() => {
              setShowAnswer(false)
              setActiveQuestion((prev) => (prev + 1) % QUESTIONS.length)
            }}
            className="rounded-full bg-slate-900/5 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-900/10 transition-colors"
          >
            Siguiente Pregunta ({((activeQuestion + 1) % QUESTIONS.length) + 1}/{QUESTIONS.length})
          </button>

          <button
            onClick={() => {
              confetti({ particleCount: 70, spread: 70 })
              setActiveClass('class-2')
            }}
            className="flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 shadow-md transition-all active:scale-[0.98]"
          >
            <span>Ir a Clase 2 de 8°: IA y Drones</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
