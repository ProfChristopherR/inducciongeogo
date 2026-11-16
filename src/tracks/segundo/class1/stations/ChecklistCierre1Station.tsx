import React, { useState } from 'react'
import confetti from 'canvas-confetti'
import {
  ArrowRight,
  BatteryCharging,
  Check,
  CheckSquare,
  CloudSun,
  Compass,
  Fan,
  MapPin,
  ShieldCheck,
  Square
} from 'lucide-react'
import { usePlatformStore } from '../../../../store/usePlatformStore'
import { SafeMediaImage } from '../../components/SafeMediaImage'

const PREFLIGHT_CHECKS = [
  {
    id: 'lipo',
    title: 'Batería LiPo',
    detail: 'Celdas balanceadas (4.15–4.20 V/celda), sin deformación y conector XT60 firme.',
    icon: BatteryCharging
  },
  {
    id: 'props',
    title: 'Hélices y Motores',
    detail: 'Aspas sin fisuras ni muescas, tuercas apretadas y sentido CW/CCW verificado.',
    icon: Fan
  },
  {
    id: 'gnss',
    title: 'GNSS e IMU',
    detail: 'Fijación ≥ 16 satélites, brújula calibrada lejos de estructuras metálicas.',
    icon: Compass
  },
  {
    id: 'dgac',
    title: 'Zona Libre y DGAC',
    detail: 'Sin personas bajo trayectoria (DAN 151), sin NOTAM ni pista < 2 km (DAN 91).',
    icon: ShieldCheck
  },
  {
    id: 'clima',
    title: 'Clima / METAR SCCH',
    detail: 'Viento bajo límite de aeronave, cielo seco y visibilidad para mantener VLOS.',
    icon: CloudSun
  },
  {
    id: 'rth',
    title: 'Home Point (RTH)',
    detail: 'Punto de retorno grabado sobre la plataforma y altura RTH superior a obstáculos.',
    icon: MapPin
  }
]

const CLASS1_SUMMARY = [
  '6 subsistemas internos del RPAS (Chasis 3K, brazos, brushless, CW/CCW, stack FC/ESC, LiPo).',
  'Equilibrio de Empuje vs Peso (T/W) y maniobras Roll, Pitch y Yaw.',
  '7 aeronaves reales del liceo y operación segura en sala con DJI NEO / FPV Indoor.',
  'Control Modo 2 y verificación aeronáutica bajo DAN 91, DAN 151 y METAR SCCH.'
]

export const ChecklistCierre1Station: React.FC = () => {
  const { setActiveClass } = usePlatformStore()
  const [checkedIds, setCheckedIds] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setCheckedIds((prev) => {
      const exists = prev.includes(id)
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id]
      if (!exists && next.length === PREFLIGHT_CHECKS.length) {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.65 } })
      }
      return next
    })
  }

  const toggleAll = () => {
    if (checkedIds.length === PREFLIGHT_CHECKS.length) {
      setCheckedIds([])
    } else {
      setCheckedIds(PREFLIGHT_CHECKS.map((item) => item.id))
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.65 } })
    }
  }

  const allChecked = checkedIds.length === PREFLIGHT_CHECKS.length
  const progressPct = Math.round((checkedIds.length / PREFLIGHT_CHECKS.length) * 100)

  return (
    <section aria-labelledby="seg-st6-title" className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h2
            id="seg-st6-title"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900"
          >
            Checklist Pre-Vuelo y Cierre de Clase 1
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
            Antes de armar motores en plataforma, verifica cada punto de seguridad aeronáutica para autorizar el despegue hacia los sensores de 4° Medio.
          </p>
        </div>

        <button
          onClick={toggleAll}
          className="apple-glass hover:bg-white rounded-2xl px-4 py-2.5 text-sm font-semibold text-blue-700 transition-all active:scale-[0.98] shrink-0"
        >
          {allChecked ? 'Reiniciar Checklist' : 'Verificar Todos (6/6)'}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-12 items-start">
        {/* Left: Visual Staging + Class 1 Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="apple-glass-dark rounded-3xl overflow-hidden relative aspect-[16/10] shadow-lg">
            <SafeMediaImage mediaKey="preflightChecklist" fallbackKey="heroOverview" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />

            <div className="absolute top-3.5 left-3.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold shadow-sm ${
                  allChecked
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-900/80 border border-white/20 text-slate-200'
                }`}
              >
                {allChecked ? '¡Listo para volar ✓!' : `Progreso: ${checkedIds.length}/6 (${progressPct}%)`}
              </span>
            </div>

            <div className="absolute bottom-3.5 inset-x-4 text-white space-y-1">
              <h3 className="text-lg font-extrabold tracking-tight">
                Mesa de Despegue • Liceo San Nicolás
              </h3>
              <div className="h-2 w-full rounded-full bg-white/15 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    allChecked ? 'bg-emerald-400' : 'bg-sky-400'
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="apple-glass rounded-3xl p-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">
              Síntesis Clase 1 • 3° Medio
            </span>
            <ul className="space-y-2 text-sm text-slate-700">
              {CLASS1_SUMMARY.map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <Check className="size-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                  <span className="font-medium leading-snug">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: 6 Interactive Pre-Flight Cards + Ready Banner (7 cols) */}
        <div className="lg:col-span-7 apple-glass rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {PREFLIGHT_CHECKS.map((item) => {
              const Icon = item.icon
              const isChecked = checkedIds.includes(item.id)
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={`rounded-2xl border p-4 text-left transition-all active:scale-[0.985] flex flex-col justify-between gap-2.5 ${
                    isChecked
                      ? 'bg-emerald-500/12 border-emerald-500/40 text-slate-900 shadow-xs'
                      : 'bg-white/85 border-slate-200/80 text-slate-800 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`size-4 ${isChecked ? 'text-emerald-700' : 'text-blue-600'}`} />
                      <span className="text-sm font-extrabold">{item.title}</span>
                    </div>
                    {isChecked ? (
                      <CheckSquare className="size-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="size-5 text-slate-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-snug font-medium">
                    {item.detail}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Ready Banner & Transition to Class 2 */}
          <div
            className={`rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
              allChecked
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg'
                : 'bg-slate-900/[0.04] border-slate-200 text-slate-700'
            }`}
          >
            <div className="space-y-0.5">
              <div className="text-base sm:text-lg font-extrabold flex items-center gap-2">
                {allChecked ? (
                  <>
                    <Check className="size-5 stroke-[3]" />
                    <span>¡Listo para volar ✓ — Autorización de Despegue Completa!</span>
                  </>
                ) : (
                  <span>Faltan {PREFLIGHT_CHECKS.length - checkedIds.length} puntos por inspeccionar</span>
                )}
              </div>
              <p className={`text-xs sm:text-sm ${allChecked ? 'text-emerald-100' : 'text-slate-500'}`}>
                {allChecked
                  ? 'Ahora avanzamos a Clase 2 (4° Medio): cámaras térmicas, NDVI, fotogrametría y topografía RTK.'
                  : 'Marca cada tarjeta de inspección física sobre la mesa para habilitar el paso a Clase 2.'}
              </p>
            </div>

            <button
              onClick={() => setActiveClass('class-2')}
              className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all active:scale-[0.97] shrink-0 ${
                allChecked
                  ? 'bg-white text-emerald-900 hover:bg-emerald-50 shadow-sm'
                  : 'bg-blue-600 text-white hover:bg-blue-500 shadow-sm'
              }`}
            >
              <span>Ir a Clase 2 (4° Medio)</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
