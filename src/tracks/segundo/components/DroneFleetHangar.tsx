import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ShieldCheck, Weight, Clock, Camera, Plane, GraduationCap } from 'lucide-react'
import { FLEET_DRONES } from '../../../data/curriculumData'
import { MEDIA_CATALOG } from '../../../data/media'

type FleetFilter = 'all' | '3-medio' | '4-medio' | 'indoor'

interface GradeAssignment {
  gradeTag: string
  gradeGroup: '3-medio' | '4-medio' | 'both'
  badgeCls: string
}

const DRONE_GRADE_MAP: Record<string, GradeAssignment> = {
  'dji-neo': {
    gradeTag: '3° Medio • Demo Sala',
    gradeGroup: '3-medio',
    badgeCls: 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30'
  },
  'fpv-indoor': {
    gradeTag: '3° Medio • Indoor',
    gradeGroup: '3-medio',
    badgeCls: 'bg-blue-500/15 text-blue-800 border-blue-500/30'
  },
  'fpv-outdoor': {
    gradeTag: '3° Medio • Ingeniería RPAS',
    gradeGroup: '3-medio',
    badgeCls: 'bg-blue-600/15 text-blue-900 border-blue-600/30'
  },
  'dji-mini-4k': {
    gradeTag: '3° Medio • Escuela <250g',
    gradeGroup: '3-medio',
    badgeCls: 'bg-sky-500/15 text-sky-800 border-sky-500/30'
  },
  'phantom-4': {
    gradeTag: '4° Medio • Fotogrametría/Topo',
    gradeGroup: '4-medio',
    badgeCls: 'bg-amber-500/15 text-amber-900 border-amber-500/30'
  },
  'mavic-3t': {
    gradeTag: '3° y 4° Medio • Térmico SAR',
    gradeGroup: 'both',
    badgeCls: 'bg-red-500/15 text-red-800 border-red-500/30'
  },
  'mavic-3m': {
    gradeTag: '4° Medio • Agrícola NDVI',
    gradeGroup: '4-medio',
    badgeCls: 'bg-emerald-600/15 text-emerald-900 border-emerald-600/30'
  }
}

const DRONE_VISUAL_MAP: Record<string, string> = {
  'dji-neo': MEDIA_CATALOG.grade3Drones.src,
  'fpv-indoor': MEDIA_CATALOG.grade3Drones.src,
  'fpv-outdoor': MEDIA_CATALOG.droneExplodedView.src,
  'dji-mini-4k': MEDIA_CATALOG.grade3Drones.src,
  'phantom-4': MEDIA_CATALOG.photogrammetry3D.src,
  'mavic-3m': MEDIA_CATALOG.ndviAgriculture.src,
  'mavic-3t': MEDIA_CATALOG.thermalSensorSar.src
}

export const DroneFleetHangar: React.FC = () => {
  const [selectedDroneId, setSelectedDroneId] = useState<string>('dji-neo')
  const [filter, setFilter] = useState<FleetFilter>('all')

  const filteredDrones = FLEET_DRONES.filter((drone) => {
    const assign = DRONE_GRADE_MAP[drone.id]
    if (filter === 'indoor') return drone.inFlightDemoSafe
    if (filter === '3-medio') return assign?.gradeGroup === '3-medio' || assign?.gradeGroup === 'both'
    if (filter === '4-medio') return assign?.gradeGroup === '4-medio' || assign?.gradeGroup === 'both'
    return true
  })

  const activeDrone =
    filteredDrones.find((d) => d.id === selectedDroneId) ??
    FLEET_DRONES.find((d) => d.id === selectedDroneId) ??
    FLEET_DRONES[0]

  const activeVisual = DRONE_VISUAL_MAP[activeDrone.id] || MEDIA_CATALOG.grade3Drones.src
  const activeGrade = DRONE_GRADE_MAP[activeDrone.id] ?? {
    gradeTag: '3° y 4° Medio',
    gradeGroup: 'both',
    badgeCls: 'bg-blue-500/15 text-blue-800 border-blue-500/30'
  }

  const handleFilterChange = (nextFilter: FleetFilter) => {
    setFilter(nextFilter)
    const nextList = FLEET_DRONES.filter((drone) => {
      const assign = DRONE_GRADE_MAP[drone.id]
      if (nextFilter === 'indoor') return drone.inFlightDemoSafe
      if (nextFilter === '3-medio') return assign?.gradeGroup === '3-medio' || assign?.gradeGroup === 'both'
      if (nextFilter === '4-medio') return assign?.gradeGroup === '4-medio' || assign?.gradeGroup === 'both'
      return true
    })
    if (nextList.length > 0 && !nextList.some((d) => d.id === selectedDroneId)) {
      setSelectedDroneId(nextList[0].id)
    }
  }

  return (
    <div className="space-y-5">
      {/* Header + Grade Filter */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-800">
            <Plane className="size-3.5" />
            <span>Hangar Real • 7 Aeronaves del Liceo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Flota RPAS: Entrenamiento 3° Medio e Industria 4° Medio
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Explora cada aeronave, su ficha técnica y en qué año de la especialidad la operarás en terreno.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-slate-900/5 p-1.5 border border-slate-900/10 shrink-0">
          {(
            [
              { id: 'all', label: 'Todos (7)' },
              { id: '3-medio', label: '3° Medio' },
              { id: '4-medio', label: '4° Medio' },
              { id: 'indoor', label: 'Aptos Sala' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleFilterChange(tab.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                filter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white/80 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Drone Selector Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7">
        {filteredDrones.map((drone) => {
          const isSelected = activeDrone.id === drone.id
          const gradeInfo = DRONE_GRADE_MAP[drone.id]
          return (
            <button
              key={drone.id}
              onClick={() => setSelectedDroneId(drone.id)}
              className={`flex flex-col justify-between rounded-2xl p-3 text-left transition-all duration-200 active:scale-[0.98] ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-lg ring-2 ring-blue-500/60 -translate-y-0.5'
                  : 'apple-glass hover:bg-white/95 text-slate-800 hover:-translate-y-0.5'
              }`}
            >
              <div className="space-y-1">
                <span
                  className={`text-[11px] font-bold block truncate ${
                    isSelected ? 'text-sky-300' : 'text-blue-700'
                  }`}
                >
                  {gradeInfo?.gradeGroup === '4-medio'
                    ? '4° Medio'
                    : gradeInfo?.gradeGroup === 'both'
                    ? '3° y 4° Medio'
                    : '3° Medio'}
                </span>
                <h3 className="text-xs sm:text-sm font-extrabold leading-tight line-clamp-2">
                  {drone.name}
                </h3>
              </div>

              <div
                className={`mt-3 flex items-center justify-between text-xs font-mono font-semibold ${
                  isSelected ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                <span>{drone.weight.split(' ')[0]} g</span>
                {drone.inFlightDemoSafe && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-sans font-bold text-emerald-500"
                    title="Apto para demostración segura en sala"
                  >
                    Sala
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected Drone Detail Inspection */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDrone.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="apple-glass rounded-3xl p-5 sm:p-6 grid gap-6 lg:grid-cols-12 items-center"
        >
          {/* Left Visual & Metrics (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[16/9] shadow-md">
              <img
                src={activeVisual}
                alt={activeDrone.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-3 py-1 text-xs font-bold text-white">
                  {activeDrone.category}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-white">
                  <GraduationCap className="size-3.5" />
                  <span>{activeGrade.gradeTag}</span>
                </span>
                {activeDrone.inFlightDemoSafe && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/95 px-3 py-1 text-xs font-bold text-white">
                    <ShieldCheck className="size-3.5" />
                    <span>Vuelo Indoor Seguro</span>
                  </span>
                )}
              </div>
              <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between text-white">
                <div>
                  <h4 className="text-2xl font-extrabold tracking-tight">{activeDrone.name}</h4>
                  <p className="text-xs sm:text-sm text-slate-200">{activeDrone.classMoment}</p>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white/85 p-3.5 border border-slate-200/75 text-center">
                <Weight className="size-4 text-slate-600 mx-auto" />
                <span className="text-xs text-slate-600 block mt-1 font-medium">Peso Despegue</span>
                <span className="font-mono text-sm font-extrabold text-slate-900">{activeDrone.weight}</span>
              </div>
              <div className="rounded-2xl bg-white/85 p-3.5 border border-slate-200/75 text-center">
                <Clock className="size-4 text-blue-600 mx-auto" />
                <span className="text-xs text-slate-600 block mt-1 font-medium">Autonomía</span>
                <span className="font-mono text-sm font-extrabold text-blue-700">{activeDrone.flightTime}</span>
              </div>
              <div className="rounded-2xl bg-white/85 p-3.5 border border-slate-200/75 text-center">
                <Camera className="size-4 text-emerald-600 mx-auto" />
                <span className="text-xs text-slate-600 block mt-1 font-medium">Alcance Radio</span>
                <span className="font-mono text-sm font-extrabold text-emerald-700">{activeDrone.specs.range}</span>
              </div>
            </div>
          </div>

          {/* Right Technical Specs & Pedagogical Role (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`rounded-2xl border px-3.5 py-2.5 flex items-center justify-between text-xs font-bold ${activeGrade.badgeCls}`}>
              <span>Nivel de Operación</span>
              <span>{activeGrade.gradeTag}</span>
            </div>

            <div className="rounded-2xl bg-blue-600/[0.06] border border-blue-600/15 p-4 text-sm text-slate-800 leading-relaxed">
              <strong className="text-blue-900 font-bold block mb-1 text-xs uppercase tracking-wider">
                Rol Formativo en el Liceo
              </strong>
              {activeDrone.pedagogicalRole}
            </div>

            <div className="rounded-2xl bg-white/85 border border-slate-200/75 p-4 space-y-2.5 text-sm">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Especificaciones Técnicas
              </span>

              <div className="border-b border-slate-200/70 pb-2">
                <span className="text-slate-500 font-medium block text-xs">Cámara y Sensores</span>
                <span className="font-bold text-slate-900">{activeDrone.specs.camera}</span>
              </div>
              <div className="border-b border-slate-200/70 pb-2">
                <span className="text-slate-500 font-medium block text-xs">Sistema de Energía</span>
                <span className="font-bold text-slate-900">{activeDrone.specs.battery}</span>
              </div>
              <div className="border-b border-slate-200/70 pb-2">
                <span className="text-slate-500 font-medium block text-xs">Propulsión</span>
                <span className="font-bold text-slate-900">{activeDrone.specs.propellers}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block text-xs">Chasis / Carga Útil</span>
                <span className="font-bold text-slate-900">{activeDrone.specs.payload}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
