import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, Check, ArrowRight, Cpu, Layers, Plane, ScanEye } from 'lucide-react'
import { usePlatformStore } from '../../../../store/usePlatformStore'
import { MEDIA_CATALOG } from '../../../../data/media'

interface YearShowcaseItem {
  id: string
  grade: string
  cycle: 'Ciclo Geogo' | 'Ciclo Geomática'
  title: string
  subtitle: string
  image: string
  badgeColor: string
  icon: React.ReactNode
  milestone: string
  tools: string[]
  classroomHardware: string
  highlights: string[]
}

const FOUR_YEAR_SHOWCASE: YearShowcaseItem[] = [
  {
    id: '1-medio',
    grade: '1° Medio',
    cycle: 'Ciclo Geogo',
    title: 'Electrónica, Sensores y Diseño 3D',
    subtitle: 'Tu primer paso en el taller: armas circuitos sin soldar en protoboard, escribes código en Arduino y dibujas piezas en 3D.',
    image: MEDIA_CATALOG.grade1Geogo.src,
    badgeColor: 'from-emerald-500 to-teal-600',
    icon: <Cpu className="size-4" />,
    milestone: 'Armar tu primer sistema con un sensor de distancia y fabricar su soporte en 3D.',
    tools: ['Arduino UNO (C++)', 'Protoboard (tablero sin soldar)', 'Autodesk Fusion 3D', 'Multímetro Digital'],
    classroomHardware: 'En la mesa del profesor: placa Arduino UNO, cables, resistencias y luces LED.',
    highlights: [
      'Aprenderás qué es el voltaje (la fuerza eléctrica), la corriente y la resistencia (la pieza que frena la electricidad para no quemar el LED).',
      'Programarás microcontroladores (pequeños chips cerebro) usando Inteligencia Artificial como copiloto.',
      'Dibujarás piezas en 3D con medidas exactas en milímetros listas para fabricar.'
    ]
  },
  {
    id: '2-medio',
    grade: '2° Medio',
    cycle: 'Ciclo Geogo',
    title: 'Placas PCB Soldadas, Impresión 3D y Láser',
    subtitle: 'Dejas atrás los cables sueltos y pasas a fabricar placas electrónicas PCB definitivas y chasis reales en impresora 3D y láser.',
    image: MEDIA_CATALOG.grade2Pcb3D.src,
    badgeColor: 'from-blue-600 to-indigo-600',
    icon: <Layers className="size-4" />,
    milestone: 'Diseñar y soldar con estaño tu propia placa electrónica PCB junto a un chasis impreso en 3D.',
    tools: ['Diseño de PCB (KiCad)', 'Soldadura con Estaño', 'Impresoras 3D', 'Cortadora Láser'],
    classroomHardware: 'En la mesa del profesor: placas PCB verdes con pistas de cobre, piezas 3D y madera/acrílico cortado con láser.',
    highlights: [
      'Pasas de cables temporales a una placa PCB (tarjeta electrónica definitiva con caminos de cobre que no se sueltan).',
      'Manufactura aditiva: imprimes piezas en 3D derritiendo filamento plástico capa por capa.',
      'Corte láser: cortas láminas planas con un rayo de luz de precisión milimétrica.'
    ]
  },
  {
    id: '3-medio',
    grade: '3° Medio',
    cycle: 'Ciclo Geomática',
    title: 'Drones, Motores Brushless y Vuelo Seguro',
    subtitle: 'Todo lo que aprendiste en Geogo ahora despega: física de vuelo, normas oficiales de Chile y manejo real de drones.',
    image: MEDIA_CATALOG.grade3Drones.src,
    badgeColor: 'from-indigo-600 to-sky-600',
    icon: <Plane className="size-4" />,
    milestone: 'Entender cómo vuela un dron, revisar el clima para volar seguro y hacer tus primeras maniobras.',
    tools: ['DJI NEO y FPV Indoor', 'Dron FPV de 5"', 'DJI Mini 4K', 'Reglas DGAC Chile'],
    classroomHardware: 'En la mesa del profesor: drones reales de entrenamiento con hélices protegidas.',
    highlights: [
      'Motores brushless (sin escobillas): giran rápido y sin roce usando imanes y electricidad.',
      'Seguridad aeronáutica bajo normas de la DGAC (la institución que regula los vuelos en Chile).',
      'Prácticas reales de despegue, vuelo quieto en el aire y aterrizaje preciso.'
    ]
  },
  {
    id: '4-medio',
    grade: '4° Medio',
    cycle: 'Ciclo Geomática',
    title: 'Sensores Térmicos, NDVI, Fotogrametría y Topografía con Drones',
    subtitle: 'Misiones reales en terreno: rescate con cámara de calor, mapas agrícolas NDVI, modelos 3D y topografía con drones (GNSS RTK, curvas de nivel y modelos digitales de elevación).',
    image: MEDIA_CATALOG.grade4Geomatica.src,
    badgeColor: 'from-sky-500 to-blue-700',
    icon: <ScanEye className="size-4" />,
    milestone: 'Operar drones industriales para rescate, agricultura inteligente y levantamientos topográficos de alta precisión.',
    tools: ['DJI Mavic 3T (Térmico)', 'DJI Mavic 3M (NDVI)', 'Topografía GNSS RTK', 'Curvas de Nivel y Mallas 3D'],
    classroomHardware: 'En la mesa del profesor: drones industriales DJI Mavic 3T, Mavic 3M y Phantom 4.',
    highlights: [
      'Cámara térmica (infrarroja): detecta el calor de personas perdidas incluso en plena oscuridad.',
      'Índice NDVI y fotogrametría: cámaras que miden la salud de los cultivos y reconstruyen edificios en 3D.',
      'Topografía con drones: mapas con GPS de precisión centimétrica (GNSS RTK), curvas de nivel y modelos digitales de elevación (mapas 3D de la altura del terreno).'
    ]
  }
]

export const RutaFormativaStation: React.FC = () => {
  const { goToStation, setActiveClass, setPremilitarModal } = usePlatformStore()
  const [selectedYearIdx, setSelectedYearIdx] = useState<number>(0)
  const activeYear = FOUR_YEAR_SHOWCASE[selectedYearIdx]

  return (
    <section aria-labelledby="st0-title" className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 id="st0-title" className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Cuatro Años Creando Tecnología Real (1° a 4° Medio)
          </h1>
          <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed">
            En nuestro liceo empiezas armando tu primer circuito en <strong>Geogo (1° y 2° Medio)</strong> y terminas operando drones industriales en <strong>Geomática (3° y 4° Medio)</strong>. Haz clic en cada curso para ver qué construirás:
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setPremilitarModal(true)}
            className="apple-glass hover:bg-white rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-800 inline-flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            <span>Portal premilitar.liceosannicolas.cl</span>
            <ExternalLink className="size-4 text-blue-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FOUR_YEAR_SHOWCASE.map((item, idx) => {
          const isSelected = idx === selectedYearIdx
          return (
            <motion.button
              key={item.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => setSelectedYearIdx(idx)}
              className={`group relative rounded-3xl p-4 text-left transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-[0_20px_50px_rgba(15,23,42,0.22)] ring-2 ring-blue-500'
                  : 'apple-glass hover:bg-white/90 text-slate-900'
              }`}
            >
              <div>
                <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-slate-950 mb-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent" />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span
                      className={`rounded-full bg-gradient-to-r ${item.badgeColor} px-3 py-0.5 text-xs font-bold text-white shadow-sm`}
                    >
                      {item.grade}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs font-semibold text-slate-100">
                    <span>{item.cycle}</span>
                    <span className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-white">
                      Ver →
                    </span>
                  </div>
                </div>

                <h2 className="text-base font-extrabold tracking-tight leading-snug">
                  {item.title}
                </h2>
                <p
                  className={`mt-1.5 text-sm line-clamp-3 leading-relaxed ${
                    isSelected ? 'text-slate-200' : 'text-slate-600'
                  }`}
                >
                  {item.subtitle}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeYear.id}
          initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="apple-glass rounded-3xl p-5 sm:p-6 grid gap-6 lg:grid-cols-12 items-center"
        >
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden bg-slate-950 aspect-video shadow-lg group">
            <img
              src={activeYear.image}
              alt={activeYear.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${activeYear.badgeColor} px-3.5 py-1 text-sm font-bold text-white shadow-md`}
              >
                {activeYear.icon}
                <span>
                  {activeYear.grade} • {activeYear.cycle}
                </span>
              </span>
            </div>

            <div className="absolute bottom-4 inset-x-4 space-y-2.5">
              <div className="flex flex-wrap gap-2">
                {activeYear.tools.map((tool, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-white/15 backdrop-blur-xl border border-white/25 px-3 py-1 text-xs sm:text-sm font-semibold text-white"
                  >
                    {tool}
                  </span>
                ))}
              </div>
              <p className="text-xs sm:text-sm font-mono text-slate-200">
                {activeYear.classroomHardware}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-700">
                {activeYear.grade} • {activeYear.cycle}
              </span>
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1 leading-tight">
                {activeYear.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-700 mt-2 leading-relaxed">
                {activeYear.subtitle}
              </p>
            </div>

            <div className="rounded-2xl bg-blue-600/[0.06] border border-blue-600/15 p-4 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800 block">
                Tu meta práctica en este curso
              </span>
              <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                {activeYear.milestone}
              </p>
            </div>

            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Lo que vas a aprender
              </span>
              {activeYear.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-slate-800 leading-relaxed">
                  <div className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700">
                    <Check className="size-3.5 stroke-[2.5]" />
                  </div>
                  <span className="font-medium">{h}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              {selectedYearIdx === 0 && (
                <button
                  onClick={() => goToStation(1)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 shadow-sm transition-all active:scale-[0.98]"
                >
                  <span>Probar Simulador 3D de Ley de Ohm</span>
                  <ArrowRight className="size-4" />
                </button>
              )}
              {selectedYearIdx === 1 && (
                <button
                  onClick={() => goToStation(3)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 shadow-sm transition-all active:scale-[0.98]"
                >
                  <span>Probar Diseño 3D en Vivo</span>
                  <ArrowRight className="size-4" />
                </button>
              )}
              {(selectedYearIdx === 2 || selectedYearIdx === 3) && (
                <button
                  onClick={() => setActiveClass('class-2')}
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 shadow-sm transition-all active:scale-[0.98]"
                >
                  <span>Ir a Clase 2 (8°): IA y Drones</span>
                  <ArrowRight className="size-4" />
                </button>
              )}

              {selectedYearIdx < 3 && (
                <button
                  onClick={() => setSelectedYearIdx(selectedYearIdx + 1)}
                  className="rounded-2xl bg-slate-900/5 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-900/10 transition-all active:scale-[0.98]"
                >
                  Siguiente: {FOUR_YEAR_SHOWCASE[selectedYearIdx + 1].grade} →
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
