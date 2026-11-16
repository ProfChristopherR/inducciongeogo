import React, { useState } from 'react'
import confetti from 'canvas-confetti'
import { ArrowRight, Check, RotateCcw, Trophy, X } from 'lucide-react'

interface GeomaticaQuestion {
  id: number
  topic: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

const QUESTIONS: GeomaticaQuestion[] = [
  {
    id: 1,
    topic: 'Arquitectura RPAS • 3° Medio',
    question:
      '¿Por qué un cuadricóptero usa exactamente 2 hélices en sentido horario (CW) y 2 en sentido antihorario (CCW)?',
    options: [
      'Para ahorrar energía en las baterías LiPo durante el despegue',
      'Para cancelar el torque de reacción y evitar que el chasis gire sin control sobre su eje vertical',
      'Para que las cámaras térmicas no sufran interferencia electromagnética',
      'Porque la normativa DGAC prohíbe motores del mismo sentido'
    ],
    correctIndex: 1,
    explanation:
      'Por tercera ley de Newton, cada rotor genera un torque reactivo opuesto. Al equilibrar 2 pares CW con 2 pares CCW, el torque neto en hover es cero.'
  },
  {
    id: 2,
    topic: 'Física de Vuelo • 3° Medio',
    question:
      'En vuelo estacionario (hover), ¿qué par de motores debe acelerar para ejecutar un Cabeceo (Pitch) hacia adelante?',
    options: [
      'Los dos motores delanteros (M1 y M4)',
      'Los dos motores traseros (M2 y M3)',
      'Los dos motores izquierdos (M3 y M4)',
      'Los cuatro motores simultáneamente al 100%'
    ],
    correctIndex: 1,
    explanation:
      'Al acelerar los motores traseros y reducir los delanteros, la cola sube, la nariz baja y el vector de empuje se inclina hacia adelante.'
  },
  {
    id: 3,
    topic: 'Control Modo 2 • 3° Medio',
    question:
      'En una emisora configurada en Modo 2 estándar, ¿qué ejes controla el stick izquierdo?',
    options: [
      'Cabeceo (Pitch) y Alabeo (Roll)',
      'Solo inclinación de la cámara (Gimbal)',
      'Acelerador vertical (Throttle) y Guiñada rotacional (Yaw)',
      'Encendido de LEDs y modo RTK'
    ],
    correctIndex: 2,
    explanation:
      'En Modo 2: stick izquierdo = Throttle (arriba/abajo) + Yaw (izq/der). Stick derecho = Pitch (adelante/atrás) + Roll (izq/der).'
  },
  {
    id: 4,
    topic: 'Normativa DGAC & METAR • 3° Medio',
    question:
      'Según las reglas generales del aire en Chile (DAN 91 / DAN 151) para vuelos visuales estándar (VLOS), ¿cuál es el techo máximo general y la regla cerca de aeródromos?',
    options: [
      'Altura libre hasta 500 m y vuelo a 200 m de cualquier pista',
      'Límite general de 130 m (400 ft) AGL en VLOS, sin aglomeraciones y mínimo 2 km de prolongación / 1 km paralelo a pistas',
      'Solo se puede volar de noche con luces rojas',
      'No existe regulación si el dron pesa menos de 5 kilos'
    ],
    correctIndex: 1,
    explanation:
      'La DGAC establece como criterio general 130 m (400 ft) AGL bajo línea de vista directa (VLOS) y estrictas zonas de resguardo en torno a pistas como Chillán (SCCH).'
  },
  {
    id: 5,
    topic: 'Mavic 3T Térmico • 4° Medio',
    question:
      '¿Cómo logra la cámara del DJI Mavic 3T detectar a una persona perdida en un bosque en total oscuridad?',
    options: [
      'Emite un flash infrarrojo visible de largo alcance',
      'Amplifica la luz de las estrellas igual que un lente nocturno común',
      'Mide radiación térmica infrarroja de onda larga (LWIR, 8–14 µm) emitida por el propio calor corporal',
      'Utiliza ultrasonido de alta frecuencia'
    ],
    correctIndex: 2,
    explanation:
      'Todo cuerpo por sobre el cero absoluto emite radiación térmica. El microbolómetro LWIR distingue los ~36.8 °C del cuerpo humano frente al entorno frío.'
  },
  {
    id: 6,
    topic: 'Mavic 3M NDVI • 4° Medio',
    question:
      'Si una zona de cultivo tiene reflectancia Rojo = 0.10 y NIR = 0.70, ¿cuál es su NDVI y qué significa?',
    options: [
      'NDVI = +0.75 · Cultivo muy vigoroso con alta fotosíntesis',
      'NDVI = −0.75 · Suelo completamente inundado',
      'NDVI = +0.30 · Planta muerta sin clorofila',
      'NDVI = +1.40 · Saturación del sensor solar'
    ],
    correctIndex: 0,
    explanation:
      'NDVI = (0.70 − 0.10) / (0.70 + 0.10) = 0.60 / 0.80 = +0.75. Valores altos positivos indican plantas sanas que absorben Rojo y reflejan mucho NIR.'
  },
  {
    id: 7,
    topic: 'Phantom 4 Fotogrametría • 4° Medio',
    question:
      '¿Qué indica el parámetro GSD (Ground Sample Distance) al planificar una grilla fotogramétrica?',
    options: [
      'El porcentaje de batería restante al aterrizar',
      'La distancia real en terreno (cm) que representa cada píxel de la fotografía aérea',
      'La velocidad máxima del viento permitida en el METAR',
      'El peso total de la cámara con gimbal'
    ],
    correctIndex: 1,
    explanation:
      'Un GSD de 1.6 cm/px significa que cada píxel del ortomosaico cubre 1.6 cm reales en terreno: a menor altura de vuelo, menor GSD y mayor resolución métrica.'
  },
  {
    id: 8,
    topic: 'Topografía con Drones • 4° Medio',
    question:
      'En topografía con drones, ¿qué rol cumplen el GNSS RTK y los Puntos de Control (GCP) sobre el MDE y la cubicación de acopios?',
    options: [
      'Sirven únicamente para grabar videos cinematográficos en 4K',
      'Fijan el modelo digital de elevación con precisión centimétrica para trazar curvas de nivel y calcular volúmenes reales en m³',
      'Reemplazan la necesidad de hélices en el dron',
      'Aumentan la temperatura de la batería LiPo en invierno'
    ],
    correctIndex: 1,
    explanation:
      'Sin corrección RTK ni GCP, la elevación tendría errores métricos. Con ellos, el MDE permite generar curvas de nivel confiables y cubicar acopios con exactitud.'
  }
]

export const GeomaticaTrivia: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [score, setScore] = useState<number>(0)
  const [isFinished, setIsFinished] = useState<boolean>(false)

  const currentQ = QUESTIONS[currentIdx]

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return
    setSelectedOption(idx)
    if (idx === currentQ.correctIndex) {
      setScore((s) => s + 1)
      confetti({ particleCount: 45, spread: 55, origin: { y: 0.7 } })
    }
  }

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx((i) => i + 1)
      setSelectedOption(null)
    } else {
      setIsFinished(true)
      confetti({ particleCount: 110, spread: 85, origin: { y: 0.55 } })
    }
  }

  const restart = () => {
    setCurrentIdx(0)
    setSelectedOption(null)
    setScore(0)
    setIsFinished(false)
  }

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="apple-glass rounded-3xl p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-900 text-sky-400 shadow-md">
            <Trophy className="size-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">
              Evaluación Técnica • Inducción 2° Medio
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Trivia de Geomática y Operación RPAS
            </h2>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 text-white px-4 py-2 font-mono text-sm font-bold">
          Aciertos: <span className="text-emerald-400">{score}</span> / {QUESTIONS.length}
        </div>
      </div>

      {!isFinished ? (
        <div className="apple-glass rounded-3xl p-6 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full bg-blue-600/10 border border-blue-600/20 px-3 py-1 text-xs font-bold text-blue-800">
              {currentQ.topic}
            </span>
            <span className="font-mono text-xs font-bold text-slate-500">
              Pregunta {currentIdx + 1} de {QUESTIONS.length}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-snug">
            {currentQ.question}
          </h3>

          <div className="grid gap-3">
            {currentQ.options.map((opt, idx) => {
              const isChosen = selectedOption === idx
              const isCorrect = idx === currentQ.correctIndex

              let cardCls =
                'bg-white/85 border-slate-200/90 text-slate-800 hover:bg-white hover:border-blue-400'
              if (selectedOption !== null) {
                if (isCorrect) {
                  cardCls = 'bg-emerald-500/15 border-emerald-500 text-emerald-950 font-bold'
                } else if (isChosen) {
                  cardCls = 'bg-red-500/15 border-red-400 text-red-950'
                } else {
                  cardCls = 'bg-slate-100/70 border-slate-200/50 text-slate-400'
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selectedOption !== null}
                  className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-left text-sm sm:text-base font-semibold transition-all ${cardCls}`}
                >
                  <span>{opt}</span>
                  {selectedOption !== null && isCorrect && (
                    <Check className="size-5 text-emerald-600 shrink-0" />
                  )}
                  {selectedOption !== null && isChosen && !isCorrect && (
                    <X className="size-5 text-red-600 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>

          {selectedOption !== null && (
            <div className="rounded-2xl bg-slate-900 text-white p-4 sm:p-5 space-y-3">
              <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium">
                {currentQ.explanation}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-sky-400 transition-colors"
                >
                  <span>
                    {currentIdx < QUESTIONS.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultado Final'}
                  </span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="apple-glass rounded-3xl p-8 text-center space-y-5">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-700 mx-auto">
            <Trophy className="size-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900">
              ¡Desafío de Geomática Completado!
            </h3>
            <p className="text-lg font-bold text-emerald-700">
              Puntaje Final: {score} de {QUESTIONS.length} respuestas correctas
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-700 max-w-2xl mx-auto leading-relaxed">
            {score >= 6
              ? 'Dominas los fundamentos clave de ingeniería RPAS, física de vuelo, sensores térmicos/NDVI, fotogrametría y topografía RTK. Estás listo para dar el paso en la siguiente estación.'
              : 'Buen recorrido técnico. Puedes repasar cualquier estación en el navegador inferior o avanzar al cierre para decidir tu senda en 3° y 4° Medio.'}
          </p>

          <button
            onClick={restart}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="size-4" />
            <span>Reintentar Trivia</span>
          </button>
        </div>
      )}
    </div>
  )
}
