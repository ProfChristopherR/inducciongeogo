import React, { useState } from 'react'
import {
  AlertTriangle,
  Check,
  CheckSquare,
  CloudRain,
  Eye,
  FileText,
  ShieldAlert,
  ShieldCheck,
  Square,
  Wind
} from 'lucide-react'
import { CHILLAN_METAR } from '../../../data/curriculumData'

interface Props {
  showChecklist?: boolean
}

type RainCondition = 'dry' | 'drizzle' | 'rain'

const CHECKLIST_ITEMS = [
  { id: 'c1', label: 'Inspección física de hélices (sin fisuras, mellas o deformación térmica)' },
  { id: 'c2', label: 'Voltaje de celdas LiPo balanceadas (mínimo 4.15V por celda)' },
  { id: 'c3', label: 'Calibración de brújula magnética e IMU libre de interferencias' },
  { id: 'c4', label: 'Verificación de NOTAM y espacio aéreo en aeródromo de Chillán (SCCH)' },
  { id: 'c5', label: 'Calibración del Gimbal de cámara y limpieza de lentes ópticos/térmicos' },
  { id: 'c6', label: 'Fijación de Satélites GNSS RTK (> 16 satélites con punto Home Lock fijado)' }
]

const WEATHER_PRESETS: {
  id: string
  label: string
  windKt: number
  rain: RainCondition
  visKm: number
}[] = [
  { id: 'scch', label: 'METAR SCCH Actual', windKt: 8, rain: 'dry', visKm: 10 },
  { id: 'puelche', label: 'Ráfagas Puelche', windKt: 24, rain: 'dry', visKm: 10 },
  { id: 'neblina', label: 'Neblina Ñuble', windKt: 5, rain: 'dry', visKm: 1.5 },
  { id: 'lluvia', label: 'Frente de Lluvia', windKt: 17, rain: 'rain', visKm: 4 }
]

export const DgacBriefing: React.FC<Props> = ({ showChecklist = true }) => {
  const [checkedIds, setCheckedIds] = useState<string[]>([])
  const [windKt, setWindKt] = useState<number>(8)
  const [rain, setRain] = useState<RainCondition>('dry')
  const [visKm, setVisKm] = useState<number>(10)

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const checkAll = () => {
    setCheckedIds((prev) =>
      prev.length === CHECKLIST_ITEMS.length ? [] : CHECKLIST_ITEMS.map((item) => item.id)
    )
  }

  // Go / No-Go Evaluation Logic
  const reasons: string[] = []
  let decision: 'GO' | 'CAUTION' | 'NOGO' = 'GO'

  if (rain !== 'dry') {
    decision = 'NOGO'
    reasons.push(
      rain === 'rain'
        ? 'Lluvia activa: riesgo eléctrico en ESC/motores sin sellado estanco y pérdida de visibilidad óptica.'
        : 'Llovizna presente: humedad condensa sobre sensores y cámara; abortar despegue.'
    )
  }
  if (windKt >= 22) {
    decision = 'NOGO'
    reasons.push(
      `Viento de ${windKt} kt (${Math.round(windKt * 1.852)} km/h) supera el margen seguro de aeronaves escuela (< 21 kt referencial DJI Mini 4K).`
    )
  } else if (windKt >= 15) {
    if (decision !== 'NOGO') decision = 'CAUTION'
    reasons.push(
      `Viento moderado-fuerte (${windKt} kt): restringir práctica a Mavic 3 / Phantom 4 con retorno anticipado de batería.`
    )
  }

  if (visKm < 3) {
    decision = 'NOGO'
    reasons.push(
      `Visibilidad de ${visKm.toFixed(1)} km impide mantener línea de vista directa (VLOS) exigida por DAN 91 / DAN 151.`
    )
  } else if (visKm < 5) {
    if (decision !== 'NOGO') decision = 'CAUTION'
    reasons.push(
      `Visibilidad reducida (${visKm.toFixed(1)} km): mantener radio corto (< 200 m) dentro de VLOS estricto.`
    )
  }

  if (reasons.length === 0) {
    reasons.push(
      `Condiciones VFR óptimas (${windKt} kt, cielo seco, ${visKm.toFixed(1)} km de visibilidad): operación segura para toda la flota.`
    )
  }

  const isReadyForTakeoff = checkedIds.length === CHECKLIST_ITEMS.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-800">
          <FileText className="size-3.5" />
          <span>Aeronáutica DGAC Chile • DAN 91 &amp; DAN 151</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Normativa DGAC y Meteorología Táctica en Chillán
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
          En el Liceo San Nicolás operamos bajo reglamentos aeronáuticos chilenos y lectura real de reportes METAR del aeródromo local.
        </p>
      </div>

      {/* DAN 91 & DAN 151 Regulatory Cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="apple-glass rounded-3xl p-5 space-y-3 border border-blue-500/20">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-extrabold text-slate-900">
              DAN 91 · Reglas Generales del Aire (RPAS)
            </h3>
            <span className="rounded-full bg-blue-600/10 px-3 py-0.5 text-xs font-bold text-blue-800">
              Regla Base
            </span>
          </div>

          <ul className="space-y-2 text-sm text-slate-700">
            <li className="rounded-2xl bg-white/80 border border-slate-200/75 p-3">
              <strong className="text-slate-900">Altura máxima general:</strong> 130 m (400 ft) AGL sobre la superficie en operación visual estándar sin autorización especial.
            </li>
            <li className="rounded-2xl bg-white/80 border border-slate-200/75 p-3">
              <strong className="text-slate-900">Línea de vista directa (VLOS):</strong> contacto visual permanente con la aeronave sin binoculares ni ayudas ópticas (salvo lentes correctivos).
            </li>
            <li className="rounded-2xl bg-white/80 border border-slate-200/75 p-3">
              <strong className="text-slate-900">Distancia a aeródromos:</strong> prohibido operar a menos de 2 km de la prolongación del eje de pista y a menos de 1 km paralelo al eje (incluye SCCH Chillán).
            </li>
            <li className="rounded-2xl bg-amber-500/10 border border-amber-500/25 p-3 text-slate-800">
              <strong>Excepción recreativa privada (Secc. 91.102):</strong> equipos frangibles &lt; 750 g en lugares privados hasta 50 m AGL <em>(referencial según autorización DGAC / edición vigente)</em>.
            </li>
          </ul>
        </article>

        <article className="apple-glass rounded-3xl p-5 space-y-3 border border-sky-500/20">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-extrabold text-slate-900">
              DAN 151 · Áreas Pobladas e Interés Público
            </h3>
            <span className="rounded-full bg-sky-600/10 px-3 py-0.5 text-xs font-bold text-sky-800">
              Uso Profesional
            </span>
          </div>

          <ul className="space-y-2 text-sm text-slate-700">
            <li className="rounded-2xl bg-white/80 border border-slate-200/75 p-3">
              <strong className="text-slate-900">Prohibición sobre aglomeraciones:</strong> prohibido sobrevolar concentraciones masivas o eventos con público sin permiso expreso DGAC.
            </li>
            <li className="rounded-2xl bg-white/80 border border-slate-200/75 p-3">
              <strong className="text-slate-900">Habilitación de piloto y aeronave:</strong> exige credencial de piloto a distancia, registro del RPAS y autorización operacional previa.
            </li>
            <li className="rounded-2xl bg-white/80 border border-slate-200/75 p-3">
              <strong className="text-slate-900">Espacio aéreo y emergencias:</strong> prohibido volar en zonas restringidas/NOTAM o interferir con aeronaves en combate de incendios forestales.
            </li>
            <li className="rounded-2xl bg-amber-500/10 border border-amber-500/25 p-3 text-slate-800">
              <strong>Peso máximo estandarizado y paracaídas:</strong> límite general de 9 kg, seguro de responsabilidad civil y paracaídas de recuperación según categoría <em>(referencial según autorización DGAC)</em>.
            </li>
          </ul>
        </article>
      </div>

      {/* METAR SCCH + Interactive Go/No-Go Decision Simulator */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* METAR Decoder Box (6 cols) */}
        <div className="lg:col-span-6 apple-glass rounded-3xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/70">
            <div className="flex items-center gap-2">
              <Wind className="size-5 text-blue-700" />
              <h3 className="text-base font-extrabold text-slate-900">
                METAR {CHILLAN_METAR.station} • Chillán
              </h3>
            </div>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold text-emerald-800">
              CONDICIÓN {CHILLAN_METAR.flightCategory} (Visual Segura)
            </span>
          </div>

          <div className="rounded-2xl bg-slate-900 p-4 font-mono text-xs sm:text-sm text-emerald-400">
            <span className="text-slate-400 select-none block text-[11px] mb-1 font-bold">
              TELEGRAMA AERONÁUTICO ORIGINAL:
            </span>
            {CHILLAN_METAR.raw}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-white/85 p-3.5 border border-slate-200/75">
              <span className="text-slate-500 font-semibold block text-xs">Viento Superficie (19008KT)</span>
              <span className="font-mono text-base font-extrabold text-blue-700 block mt-0.5">
                190° / 8 kt (~15 km/h)
              </span>
            </div>
            <div className="rounded-2xl bg-white/85 p-3.5 border border-slate-200/75">
              <span className="text-slate-500 font-semibold block text-xs">Visibilidad (9999)</span>
              <span className="font-mono text-base font-extrabold text-emerald-700 block mt-0.5">
                &gt; 10 km (Ilimitada)
              </span>
            </div>
            <div className="rounded-2xl bg-white/85 p-3.5 border border-slate-200/75">
              <span className="text-slate-500 font-semibold block text-xs">Temp / Punto Rocío</span>
              <span className="font-mono text-base font-extrabold text-slate-900 block mt-0.5">
                19°C / 11°C
              </span>
            </div>
            <div className="rounded-2xl bg-white/85 p-3.5 border border-slate-200/75">
              <span className="text-slate-500 font-semibold block text-xs">Presión QNH</span>
              <span className="font-mono text-base font-extrabold text-slate-900 block mt-0.5">
                1016 hPa (Estándar)
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            {CHILLAN_METAR.decodedSummary}
          </p>
        </div>

        {/* Interactive Go / No-Go Simulator (6 cols) */}
        <div className="lg:col-span-6 apple-glass-dark rounded-3xl p-5 text-white flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-extrabold tracking-tight">
                Simulador: ¿Vuelo o No Vuelo?
              </h3>
              <span className="text-xs font-mono text-sky-300">Decisión Meteorológica</span>
            </div>

            {/* Scenario Presets */}
            <div className="flex flex-wrap gap-1.5">
              {WEATHER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setWindKt(preset.windKt)
                    setRain(preset.rain)
                    setVisKm(preset.visKm)
                  }}
                  className="rounded-full bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1 text-xs font-semibold text-slate-100 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Wind Slider */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs sm:text-sm font-semibold">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <Wind className="size-4 text-sky-400" />
                  Viento en Superficie
                </span>
                <span className="font-mono font-bold text-sky-300">
                  {windKt} kt ({Math.round(windKt * 1.852)} km/h)
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={32}
                step={1}
                value={windKt}
                onChange={(e) => setWindKt(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Visibility Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-semibold">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <Eye className="size-4 text-emerald-400" />
                  Visibilidad Horizontal
                </span>
                <span className="font-mono font-bold text-emerald-300">
                  {visKm.toFixed(1)} km
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={12}
                step={0.5}
                value={visKm}
                onChange={(e) => setVisKm(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Rain Selector */}
            <div className="space-y-1.5">
              <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-200">
                <CloudRain className="size-4 text-amber-400" />
                Precipitación en Zona de Vuelo
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'dry', label: 'Seco' },
                    { id: 'drizzle', label: 'Llovizna' },
                    { id: 'rain', label: 'Lluvia' }
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setRain(opt.id)}
                    className={`rounded-xl py-2 text-xs font-bold border transition-all ${
                      rain === opt.id
                        ? 'bg-sky-500 text-slate-950 border-sky-400'
                        : 'bg-white/5 text-slate-300 border-white/15 hover:bg-white/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Decision Result Banner */}
          <div
            className={`rounded-2xl border p-4 space-y-2 transition-colors ${
              decision === 'GO'
                ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-100'
                : decision === 'CAUTION'
                ? 'bg-amber-500/15 border-amber-400/50 text-amber-100'
                : 'bg-red-500/20 border-red-400/60 text-red-100'
            }`}
          >
            <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold">
              {decision === 'GO' && <ShieldCheck className="size-5 text-emerald-400 shrink-0" />}
              {decision === 'CAUTION' && <AlertTriangle className="size-5 text-amber-400 shrink-0" />}
              {decision === 'NOGO' && <ShieldAlert className="size-5 text-red-400 shrink-0" />}
              <span>
                {decision === 'GO'
                  ? 'DECISIÓN: VUELO AUTORIZADO (GO)'
                  : decision === 'CAUTION'
                  ? 'DECISIÓN: VUELO CON RESTRICCIONES'
                  : 'DECISIÓN: NO VOLAR — MISIÓN CANCELADA (NO-GO)'}
              </span>
            </div>
            <ul className="space-y-1 text-xs sm:text-sm leading-snug">
              {reasons.map((r) => (
                <li key={r}>• {r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Optional Checklist (kept for 8° Básico compatibility) */}
      {showChecklist && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-blue-700" />
              <h4 className="text-base font-black text-slate-900">
                Checklist Pre-Vuelo Interactivo (Revisión Física en Mesa del Profesor)
              </h4>
            </div>

            <button
              onClick={checkAll}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors"
            >
              {isReadyForTakeoff ? 'Desmarcar Todo' : 'Marcar Todo'}
            </button>
          </div>

          <div className="space-y-2.5">
            {CHECKLIST_ITEMS.map((item) => {
              const isChecked = checkedIds.includes(item.id)
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleCheck(item.id)}
                  className={`w-full flex items-center justify-between rounded-2xl border p-3.5 text-left transition-all ${
                    isChecked
                      ? 'border-emerald-300 bg-emerald-50/70 text-slate-900'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    {isChecked ? (
                      <CheckSquare className="size-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="size-5 text-slate-400 shrink-0" />
                    )}
                    <span>{item.label}</span>
                  </div>
                  {isChecked && (
                    <span className="text-xs font-black text-emerald-700 font-mono">
                      VERIFICADO
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div
            className={`rounded-2xl border p-4 text-center transition-all ${
              isReadyForTakeoff
                ? 'border-emerald-400 bg-emerald-100 text-emerald-900 shadow-sm'
                : 'border-slate-200 bg-slate-50 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-sm font-black uppercase">
              {isReadyForTakeoff ? (
                <>
                  <Check className="size-5 text-emerald-700" />
                  <span>¡AUTORIZACIÓN DE VUELO DGAC APROBADA! AERONAVE LISTA PARA OPERAR</span>
                </>
              ) : (
                <span>Marca los {CHECKLIST_ITEMS.length - checkedIds.length} puntos pendientes para autorizar misión</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
