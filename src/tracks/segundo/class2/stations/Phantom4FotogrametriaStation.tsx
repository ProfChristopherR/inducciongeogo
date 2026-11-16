import React, { useState } from 'react'
import { Box, Camera, Clock, Grid, Layers, Ruler } from 'lucide-react'
import { SafeMediaImage } from '../../components/SafeMediaImage'

interface AreaPreset {
  id: string
  label: string
  hectares: number
  widthM: number
  lengthM: number
}

const AREA_PRESETS: AreaPreset[] = [
  { id: 'cancha', label: 'Cancha Liceo (2 ha)', hectares: 2, widthM: 200, lengthM: 100 },
  { id: 'campus', label: 'Campus Liceo San Nicolás (12 ha)', hectares: 12, widthM: 400, lengthM: 300 },
  { id: 'predio', label: 'Predio Agrícola Ñuble (25 ha)', hectares: 25, widthM: 500, lengthM: 500 }
]

// Verified DJI Phantom 4 Pro 1" CMOS sensor parameters
const SENSOR_WIDTH_MM = 13.2
const SENSOR_HEIGHT_MM = 8.8
const IMAGE_WIDTH_PX = 5472
const FOCAL_LENGTH_MM = 8.8
const CRUISE_SPEED_MS = 8.0

export const Phantom4FotogrametriaStation: React.FC = () => {
  const [areaId, setAreaId] = useState<string>('campus')
  const [altitudeM, setAltitudeM] = useState<number>(65)
  const [overlapPct, setOverlapPct] = useState<number>(75)
  const [viewMode, setViewMode] = useState<'grid' | 'model3d'>('grid')

  const area = AREA_PRESETS.find((a) => a.id === areaId) ?? AREA_PRESETS[1]

  // Real Photogrammetry Calculations
  const gsdCmPx = ((altitudeM * SENSOR_WIDTH_MM) / (FOCAL_LENGTH_MM * IMAGE_WIDTH_PX)) * 100
  const footprintW = (altitudeM * SENSOR_WIDTH_MM) / FOCAL_LENGTH_MM
  const footprintH = (altitudeM * SENSOR_HEIGHT_MM) / FOCAL_LENGTH_MM

  const overlapRatio = overlapPct / 100
  const lineSpacingM = footprintW * (1 - overlapRatio)
  const triggerStepM = footprintH * (1 - overlapRatio)

  const flightLinesCount = Math.max(2, Math.ceil(area.widthM / lineSpacingM) + 1)
  const photosPerLine = Math.max(2, Math.ceil(area.lengthM / triggerStepM) + 1)
  const totalPhotos = flightLinesCount * photosPerLine
  const totalFlightMeters = flightLinesCount * area.lengthM + (flightLinesCount - 1) * lineSpacingM
  const flightTimeMin = totalFlightMeters / CRUISE_SPEED_MS / 60 + flightLinesCount * 0.12
  const batteriesNeeded = Math.max(1, Math.ceil(flightTimeMin / 24)) // ~24 min safe effective mapping/pack

  // SVG Flight Grid Geometry (scaled inside 400x260 canvas)
  const maxBoxW = 344
  const maxBoxH = 212
  const scale = Math.min(maxBoxW / area.widthM, maxBoxH / area.lengthM)
  const drawW = area.widthM * scale
  const drawH = area.lengthM * scale
  const originX = (400 - drawW) / 2
  const originY = (260 - drawH) / 2

  const renderLines = Math.min(28, flightLinesCount)
  const linePoints: string[] = []
  const photoDots: { cx: number; cy: number }[] = []

  for (let i = 0; i < renderLines; i++) {
    const t = renderLines === 1 ? 0.5 : i / (renderLines - 1)
    const x = originX + t * drawW
    const yTop = originY
    const yBot = originY + drawH
    if (i % 2 === 0) {
      linePoints.push(`${x.toFixed(1)},${yTop.toFixed(1)}`, `${x.toFixed(1)},${yBot.toFixed(1)}`)
    } else {
      linePoints.push(`${x.toFixed(1)},${yBot.toFixed(1)}`, `${x.toFixed(1)},${yTop.toFixed(1)}`)
    }

    const dotsOnLine = Math.min(14, photosPerLine)
    for (let j = 0; j < dotsOnLine; j++) {
      const jt = dotsOnLine === 1 ? 0.5 : j / (dotsOnLine - 1)
      photoDots.push({ cx: x, cy: originY + jt * drawH })
    }
  }

  const fpDrawW = Math.min(drawW, footprintW * scale)
  const fpDrawH = Math.min(drawH, footprintH * scale)

  return (
    <section aria-labelledby="seg-c2-st3-title" className="space-y-6">
      {/* Header + View Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h2
            id="seg-c2-st3-title"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900"
          >
            Phantom 4 Pro: Planificador Fotogramétrico y GSD
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
            Ajusta la altura de vuelo y el traslape entre fotos para calcular en tiempo real el tamaño de píxel en terreno (<strong>GSD</strong>), las líneas de grilla y el modelo 3D resultante.
          </p>
        </div>

        <div className="flex rounded-2xl bg-slate-900/5 p-1.5 border border-slate-900/10 shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-semibold transition-all ${
              viewMode === 'grid' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            <Grid className="size-3.5" />
            <span>Grilla de Vuelo</span>
          </button>
          <button
            onClick={() => setViewMode('model3d')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-semibold transition-all ${
              viewMode === 'model3d' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            <Box className="size-3.5" />
            <span>Resultado Modelo 3D</span>
          </button>
        </div>
      </div>

      {/* Main Split: Grid/Model Visualizer + Parameters */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left: Interactive SVG Grid or 3D Model View (7 cols) */}
        <div className="lg:col-span-7 apple-glass-dark rounded-3xl p-4 sm:p-5 text-white flex flex-col justify-between gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="font-bold text-sky-400">
              {viewMode === 'grid'
                ? `GRILLA AUTÓNOMA • ${area.widthM}m × ${area.lengthM}m`
                : 'GEMELO DIGITAL 3D • NUBE DE PUNTOS DENSA'}
            </span>
            <span className="text-slate-300">
              Sensor 1&quot; (13.2 mm) · Focal 8.8 mm · Obturador Mecánico
            </span>
          </div>

          {viewMode === 'grid' ? (
            <div className="rounded-2xl bg-slate-950 border border-white/10 p-3">
              <svg viewBox="0 0 400 260" className="w-full h-auto">
                {/* Grid backdrop */}
                <defs>
                  <pattern id="photoGridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.7" />
                  </pattern>
                </defs>
                <rect x="0" y="0" width="400" height="260" fill="url(#photoGridPattern)" />

                {/* Survey Parcel Polygon */}
                <rect
                  x={originX}
                  y={originY}
                  width={drawW}
                  height={drawH}
                  rx="4"
                  fill="rgba(16, 185, 129, 0.12)"
                  stroke="#10b981"
                  strokeWidth="2"
                />

                {/* Serpentine Flight Path */}
                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                  points={linePoints.join(' ')}
                />

                {/* Sample Photo Footprint */}
                <rect
                  x={originX - fpDrawW / 2 + drawW * 0.25}
                  y={originY + drawH * 0.25 - fpDrawH / 2}
                  width={fpDrawW}
                  height={fpDrawH}
                  fill="rgba(245, 158, 11, 0.18)"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />

                {/* Trigger Waypoints */}
                {photoDots.map((d, idx) => (
                  <circle key={idx} cx={d.cx} cy={d.cy} r="2.1" fill="#e2e8f0" />
                ))}

                {/* Start Home H */}
                <circle cx={originX} cy={originY} r="7" fill="#10b981" />
                <text x={originX} y={originY + 3} textAnchor="middle" fill="#020617" fontSize="9" fontWeight="800">
                  H
                </text>
              </svg>
            </div>
          ) : (
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/10">
              <SafeMediaImage mediaKey="photogrammetry3D" fallbackKey="grade4Geomatica" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-3.5 inset-x-4 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-white">
                  Malla 3D georreferenciada con GSD {gsdCmPx.toFixed(2)} cm/px
                </span>
                <span className="rounded-full bg-sky-500/20 border border-sky-400/40 px-3 py-1 text-sky-200 font-mono">
                  {totalPhotos} fotos procesadas
                </span>
              </div>
            </div>
          )}

          {/* Live Calculated Output Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3 text-center">
              <Ruler className="size-4 text-sky-400 mx-auto" />
              <span className="text-xs text-slate-400 block mt-1">GSD en Terreno</span>
              <span className="font-mono text-lg font-extrabold text-sky-300">
                {gsdCmPx.toFixed(2)} cm/px
              </span>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3 text-center">
              <Camera className="size-4 text-emerald-400 mx-auto" />
              <span className="text-xs text-slate-400 block mt-1">Fotos Estimadas</span>
              <span className="font-mono text-lg font-extrabold text-emerald-300">
                {totalPhotos}
              </span>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3 text-center">
              <Layers className="size-4 text-amber-400 mx-auto" />
              <span className="text-xs text-slate-400 block mt-1">Líneas de Vuelo</span>
              <span className="font-mono text-lg font-extrabold text-amber-300">
                {flightLinesCount}
              </span>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3 text-center">
              <Clock className="size-4 text-slate-300 mx-auto" />
              <span className="text-xs text-slate-400 block mt-1">Tiempo ({batteriesNeeded} bat.)</span>
              <span className="font-mono text-lg font-extrabold text-white">
                {Math.round(flightTimeMin)} min
              </span>
            </div>
          </div>
        </div>

        {/* Right: Mission Parameters & Formula (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="apple-glass rounded-3xl p-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800 block">
              Parámetros de Misión
            </span>

            {/* Area Selector */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-600 block">Área de Levantamiento</span>
              <div className="flex flex-wrap gap-1.5">
                {AREA_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setAreaId(p.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                      areaId === p.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-900/5 text-slate-700 hover:bg-slate-900/10'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Altitude Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm font-semibold">
                <label htmlFor="p4-alt" className="text-slate-800">
                  Altura de Vuelo AGL (H)
                </label>
                <span className="font-mono font-bold text-blue-700">{altitudeM} m</span>
              </div>
              <input
                id="p4-alt"
                type="range"
                min={30}
                max={120}
                step={5}
                value={altitudeM}
                onChange={(e) => setAltitudeM(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-slate-500 block">
                Cobertura por foto: {footprintW.toFixed(1)} m × {footprintH.toFixed(1)} m (bajo techo DGAC 130 m).
              </span>
            </div>

            {/* Overlap Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm font-semibold">
                <label htmlFor="p4-overlap" className="text-slate-800">
                  Traslape Frontal / Lateral
                </label>
                <span className="font-mono font-bold text-emerald-700">{overlapPct}%</span>
              </div>
              <input
                id="p4-overlap"
                type="range"
                min={60}
                max={85}
                step={5}
                value={overlapPct}
                onChange={(e) => setOverlapPct(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-slate-500 block">
                Separación entre pasadas: {lineSpacingM.toFixed(1)} m (recomendado ≥ 75% para 3D).
              </span>
            </div>
          </div>

          {/* Real GSD Formula + Mechanical Shutter Note */}
          <div className="apple-glass rounded-3xl p-5 space-y-3">
            <div className="rounded-2xl bg-slate-900 text-slate-100 p-3.5 font-mono text-xs sm:text-sm">
              <span className="text-slate-400 block text-[11px] mb-1">Fórmula GSD (Phantom 4 Pro):</span>
              GSD = (H · 13.2 mm) / (8.8 mm · 5472 px) × 100 ={' '}
              <strong className="text-sky-400">{gsdCmPx.toFixed(2)} cm/px</strong>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              <strong className="text-slate-900">¿Por qué importa el obturador mecánico?</strong> A diferencia de cámaras electrónicas baratas, el obturador mecánico congela toda la escena al instante sin deformar edificios ni curvas mientras el dron avanza a {CRUISE_SPEED_MS} m/s.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
