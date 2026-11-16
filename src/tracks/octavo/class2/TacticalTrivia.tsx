import React, { useState } from 'react'
import confetti from 'canvas-confetti'
import { Trophy, Check, X, RotateCcw, ArrowRight, GraduationCap } from 'lucide-react'
import { usePlatformStore } from '../../../store/usePlatformStore'

interface TriviaItem {
  id: number
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  yearTag: string
}

const TRIVIA_QUESTIONS: TriviaItem[] = [
  {
    id: 1,
    question: '¿Para qué le ponemos una resistencia a un LED cuando armamos un circuito en el taller?',
    options: [
      'Para que el LED cambie de color solo',
      'Para frenar el exceso de corriente eléctrica y evitar que el LED se queme',
      'Para apagar la batería automáticamente',
      'Para que el circuito funcione sin electricidad'
    ],
    correctIndex: 1,
    explanation: '¡Correcto! Según la Ley de Ohm (I = V / R), la resistencia frena el paso de la corriente. Sin ella, pasa demasiada energía de golpe y el LED se funde.',
    yearTag: '1° Medio • Ley de Ohm y Electrónica'
  },
  {
    id: 2,
    question: '¿Por qué en 2° Medio pasamos de la protoboard blanca a soldar nuestra propia placa PCB?',
    options: [
      'Porque la protoboard no usa electricidad',
      'Porque los cables sueltos se salen con las vibraciones, mientras que la PCB soldada queda firme',
      'Porque las placas PCB se cortan en impresora 3D',
      'Porque la protoboard solo funciona bajo el agua'
    ],
    correctIndex: 1,
    explanation: '¡Exacto! La protoboard sirve para probar rápido en la mesa, pero las pistas de cobre soldadas con estaño en la PCB aguantan golpes y vibraciones sin soltarse.',
    yearTag: '2° Medio • Protoboard vs. Placa PCB'
  },
  {
    id: 3,
    question: '¿Qué ventaja tiene diseñar piezas en 3D con medidas paramétricas e imprimirlas con relleno tipo panal (infill al 20%)?',
    options: [
      'Quedan macizas y súper pesadas como una piedra',
      'Si cambias un número la pieza se ajusta sola, y por dentro queda liviana y resistente',
      'Solo sirve para dibujar planos en papel',
      'Hace que la cortadora láser funcione más lento'
    ],
    correctIndex: 1,
    explanation: '¡Muy bien! El diseño paramétrico recalcula la pieza al instante y el relleno de panal ahorra plástico y peso manteniendo la firmeza.',
    yearTag: '1° y 2° Medio • Diseño CAD 3D y Manufactura'
  },
  {
    id: 4,
    question: '¿Cómo calcula la distancia el sensor ultrasónico HC-SR04 que programamos en Arduino con ayuda de la IA?',
    options: [
      'Midiendo la temperatura de tu mano',
      'Emitiendo un sonido que no oímos y midiendo cuánto tarda en rebotar y volver',
      'Sacando una foto en 4K del objeto',
      'Midiendo el peso con un imán'
    ],
    correctIndex: 1,
    explanation: '¡Brillante! Igual que un murciélago, envía un pulso de ultrasonido y calcula los centímetros midiendo el tiempo del eco (ida y vuelta).',
    yearTag: 'Clase 2 • IA y Sensor Ultrasónico'
  },
  {
    id: 5,
    question: '¿Por qué un dron de cuatro hélices gira dos hacia un lado y dos al revés, y cuál podemos volar seguro en sala?',
    options: [
      'Para hacer más ruido; volamos el Phantom 4 grande',
      'Para equilibrar el giro y no dar vueltas solo; volamos el DJI NEO o FPV Indoor con jaula protectora',
      'Para gastar menos batería apagando dos motores',
      'Para que pueda volar sin batería LiPo'
    ],
    correctIndex: 1,
    explanation: '¡Así se habla! Las hélices opuestas cancelan la fuerza de giro, y el DJI NEO y el FPV Indoor tienen protectores 360° para volar seguros en clases.',
    yearTag: 'Clase 2 • Nociones Básicas de Drones'
  }
]

export const TacticalTrivia: React.FC = () => {
  const { nextStation } = usePlatformStore()
  const [currentIdx, setCurrentIdx] = useState<number>(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [score, setScore] = useState<number>(0)
  const [isFinished, setIsFinished] = useState<boolean>(false)

  const currentQ = TRIVIA_QUESTIONS[currentIdx]

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return
    setSelectedOption(index)
    if (index === currentQ.correctIndex) {
      setScore((s) => s + 1)
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 }
      })
    }
  }

  const handleNext = () => {
    if (currentIdx < TRIVIA_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1)
      setSelectedOption(null)
    } else {
      setIsFinished(true)
      confetti({
        particleCount: 95,
        spread: 85,
        origin: { y: 0.55 }
      })
    }
  }

  const restartTrivia = () => {
    setCurrentIdx(0)
    setSelectedOption(null)
    setScore(0)
    setIsFinished(false)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="apple-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl p-6">
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-sm">
            <Trophy className="size-6" />
          </div>
          <div>
            <h2 id="c2-st4-title" className="text-2xl font-extrabold tracking-tight text-slate-900">
              Trivia Final: ¿Cuánto Recuerdas del Taller?
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              5 preguntas rápidas sobre lo que vimos juntos en la Clase 1 y Clase 2.
            </p>
          </div>
        </div>

        <div className="font-mono text-base font-extrabold text-slate-800 bg-white/80 rounded-2xl px-4 py-2 border border-slate-200/80 shrink-0">
          Aciertos: <span className="text-emerald-600">{score}</span> / {TRIVIA_QUESTIONS.length}
        </div>
      </div>

      {!isFinished ? (
        <div className="apple-glass rounded-3xl p-6 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full bg-blue-600/10 border border-blue-600/20 px-3.5 py-1 text-xs sm:text-sm font-bold text-blue-800">
              {currentQ.yearTag}
            </span>
            <span className="text-sm text-slate-600 font-bold">
              Pregunta {currentIdx + 1} de {TRIVIA_QUESTIONS.length}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="grid gap-3 pt-1">
            {currentQ.options.map((opt, i) => {
              const isChosen = selectedOption === i
              const isCorrect = i === currentQ.correctIndex

              let btnStyle = 'border-slate-200 bg-white/80 text-slate-800 hover:bg-white hover:border-blue-400'

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                } else if (isChosen) {
                  btnStyle = 'border-red-400 bg-red-50 text-red-900'
                } else {
                  btnStyle = 'border-slate-100 bg-slate-50/60 text-slate-400'
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelectOption(i)}
                  disabled={selectedOption !== null}
                  className={`flex items-center justify-between rounded-2xl border p-4 text-left text-sm sm:text-base font-semibold transition-all ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {selectedOption !== null && isCorrect && (
                    <Check className="size-5 text-emerald-600 shrink-0 ml-3" />
                  )}
                  {selectedOption !== null && isChosen && !isCorrect && (
                    <X className="size-5 text-red-500 shrink-0 ml-3" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {selectedOption !== null && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white/90 p-5 space-y-4">
              <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed">
                {currentQ.explanation}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 rounded-2xl bg-blue-700 px-6 py-3 text-sm font-bold text-white hover:bg-blue-800 shadow-sm transition-colors"
                >
                  <span>{currentIdx < TRIVIA_QUESTIONS.length - 1 ? 'Siguiente Pregunta' : 'Ver Puntaje Final'}</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Final celebration card leading to DecisionGeogoStation */
        <div className="apple-glass rounded-3xl border border-emerald-400/50 p-8 text-center space-y-6">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 mx-auto">
            <Trophy className="size-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold text-slate-900">
              ¡Trivia Completada!
            </h3>
            <p className="text-lg text-emerald-700 font-bold">
              Lograste {score} de {TRIVIA_QUESTIONS.length} aciertos
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 text-sm sm:text-base text-slate-800 max-w-2xl mx-auto leading-relaxed text-left space-y-2.5 font-medium">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm uppercase tracking-wider">
              <GraduationCap className="size-5 text-blue-700" />
              <span>Lo que ya dominas hoy</span>
            </div>
            <p>
              Ya sabes por qué una resistencia cuida el LED, por qué soldamos placas PCB en 2° Medio, cómo el diseño 3D y el relleno panal hacen piezas livianas, cómo la IA te ayuda a programar un radar y cómo vuelan los drones del liceo.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              onClick={restartTrivia}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <RotateCcw className="size-4" />
              <span>Jugar de nuevo</span>
            </button>

            <button
              onClick={nextStation}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-500 shadow-md transition-all active:scale-[0.98]"
            >
              <span>Paso final: ¿Te vienes a Geogo en 1° Medio?</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
