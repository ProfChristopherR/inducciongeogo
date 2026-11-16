import React, { useState } from 'react'
import { Droplets, Sprout, Sun } from 'lucide-react'
import { SafeMediaImage } from '../../components/SafeMediaImage'

interface ZoneState {
  id: 'A' | 'B' | 'C'
  name: string
  subtitle: string
  red: number // 650 nm reflectance (0.02 - 0.60)
  nir: number // 860 nm reflectance (0.04 - 0.85)
}

const INITIAL_ZONES: ZoneState[] = [
  { id: 'A', name: 'Zona A · Cultivo Vigoroso', subtitle: 'Riego normal / alta clorofila', red: 0.08, nir: 0.62 },
  { id: 'B', name: 'Zona B · Estrés Hídrico', subtitle: 'Falta de agua moderada', red: 0.21, nir: 0.43 },
  { id: 'C', name: 'Zona C · Suelo / Plaga', subtitle: 'Baja cobertura foliar', red: 0.34, nir: 0.36 }
]

const PRESETS: { label: string; zones: ZoneState[] }[] = [
  { label: 'Predio San Nicolás', zones: INITIAL_ZONES },
  {
    label: 'Sequía Severa',
    zones: [
      { id: 'A', name: 'Zona A · Cultivo Vigoroso', subtitle: 'Borde canalizado', red: 0.14, nir: 0.48 },
      { id: 'B', name: 'Zona B · Estrés Hídrico', subtitle: 'Déficit crítico', red: 0.29, nir: 0.35 },
      { id: 'C', name: 'Zona C · Suelo / Plaga', subtitle: 'Suelo seco expuesto', red: 0.42, nir: 0.40 }
    ]
  },
  {
    label: 'Cultivo Óptimo',
    zones: [
      { id: 'A', name: 'Zona A · Cultivo Vigoroso', subtitle: 'Vigor pleno', red: 0.06, nir: 0.68 },
      { id: 'B', name: 'Zona B · Estrés Hídrico', subtitle: 'Recuperado post-riego', red: 0.09, nir: 0.60 },
      { id: 'C', name: 'Zona C · Suelo / Plaga', subtitle: 'Brote nuevo', red: 0.12, nir: 0.52 }
    ]
  }
]

function computeNdvi(red: number, nir: number): number {
  const denom = nir + red
  if (denom <= 0.0001) return 0
  return (nir - red) / denom
}

function getNdviVisual(ndvi: number) {
  if (ndvi >= 0.55) {
    return {
      status: 'Vigor Alto (Clorofila Activa)',
      hex: '#10b981',
      bgTint: 'rgba(16, 185, 129, 0.52)',
      prescription: '0% aspersión extra · Mantener riego base.'
    }
  }
  if (ndvi >= 0.30) {
    return {
      status: 'Estrés Moderado',
      hex: '#eab308',
      bgTint: 'rgba(234, 179, 8, 0.52)',
      prescription: 'Dosis focalizada (+riego / bioestimulante).'
    }
  }
  if (ndvi >= 0.12) {
    return {
      status: 'Estrés Alto / Baja Densidad',
      hex: '#f97316',
      bgTint: 'rgba(249, 115, 22, 0.56)',
      prescription: 'Inspección en terreno + dosis dirigida.'
    }
  }
  return {
    status: 'Suelo Desnudo / Daño Severo',
    hex: '#ef4444',
    bgTint: 'rgba(239, 68, 68, 0.56)',
    prescription: 'No asperjar foliar; evaluar resiembra o humedad.'
  }
}

export const Mavic3MNdviStation: React.FC = () => {
  const [zones, setZones] = useState<ZoneState[]>(INITIAL_ZONES)
  const [activeZoneId, setActiveZoneId] = useState<'A' | 'B' | 'C'>('A')

  const activeZone = zones.find((z) => z.id === activeZoneId) ?? zones[0]

  const updateActiveZone = (field: 'red' | 'nir', val: number) => {
    setZones((prev) =>
      prev.map((z) => (z.id === activeZoneId ? { ...z, [field]: val } : z))
    )
  }

  const activeNdvi = computeNdvi(activeZone.red, activeZone.nir)
  const activeVisual = getNdviVisual(activeNdvi)

  // Estimate selective spraying savings (zones needing extra treatment vs uniform)
  const zonesHealthy = zones.filter((z) => computeNdvi(z.red, z.nir) >= 0.55).length
  const estimatedSavingPct = Math.round((zonesHealthy / zones.length) * 42)

  return (
    <section aria-labelledby="seg-c2-st2-title" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h2
            id="seg-c2-st2-title"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900"
          >
            Mavic 3M: Índice Multiespectral NDVI en Parcela
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
            Las plantas sanas absorben luz <strong>Roja (650 nm)</strong> para hacer fotosíntesis y reflejan fuertemente el <strong>Infrarrojo Cercano NIR (860 nm)</strong>. Ajusta cada zona para ver el mapa espectral y la prescripción agrícola.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 shrink-0">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setZones(p.zones)}
              className="apple-glass hover:bg-white rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-800 transition-all active:scale-[0.98]"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulator */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left: Live Spectral Parcel Map (7 cols) */}
        <div className="lg:col-span-7 apple-glass-dark rounded-3xl p-4 sm:p-5 text-white flex flex-col justify-between gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400">
              MAPA ESPECTRAL EN VIVO • 3 ZONAS DE CULTIVO
            </span>
            <span className="font-mono text-xs text-slate-300">
              NDVI = (NIR − Rojo) / (NIR + Rojo)
            </span>
          </div>

          {/* Aerial Parcel Image + Interactive 3-Zone Live NDVI Overlay */}
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/10">
            <SafeMediaImage
              mediaKey="ndviAgriculture"
              fallbackKey="grade4Geomatica"
              className="size-full object-cover opacity-55"
            />

            {/* 3 Clickable Spectral Zones */}
            <div className="absolute inset-3 grid grid-cols-3 gap-2.5">
              {zones.map((zone) => {
                const ndvi = computeNdvi(zone.red, zone.nir)
                const vis = getNdviVisual(ndvi)
                const isSelected = zone.id === activeZoneId

                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setActiveZoneId(zone.id)}
                    style={{ backgroundColor: vis.bgTint }}
                    className={`rounded-2xl p-3 sm:p-4 flex flex-col justify-between text-left backdrop-blur-[2px] border-2 transition-all ${
                      isSelected
                        ? 'border-white shadow-[0_0_24px_rgba(255,255,255,0.35)] scale-[1.01]'
                        : 'border-white/30 hover:border-white/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="rounded-full bg-slate-950/75 px-2.5 py-0.5 text-xs font-bold text-white">
                        Zona {zone.id}
                      </span>
                      <span className="font-mono text-xs font-bold text-white drop-shadow">
                        R:{zone.red.toFixed(2)} · NIR:{zone.nir.toFixed(2)}
                      </span>
                    </div>

                    <div className="space-y-1 bg-slate-950/75 rounded-xl p-2.5 border border-white/15">
                      <span className="text-[11px] text-slate-300 block font-medium">
                        Índice NDVI
                      </span>
                      <span
                        className="font-mono text-2xl sm:text-3xl font-extrabold block"
                        style={{ color: vis.hex }}
                      >
                        {ndvi >= 0 ? '+' : ''}
                        {ndvi.toFixed(2)}
                      </span>
                      <span className="text-xs font-semibold text-white block leading-tight">
                        {vis.status}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Spectral Legend Scale */}
          <div className="space-y-1.5">
            <div className="h-3 w-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 via-lime-400 to-emerald-500 border border-white/20" />
            <div className="flex justify-between text-[11px] font-mono text-slate-300">
              <span>−1.0 Agua / Roca</span>
              <span>0.0 Suelo Desnudo</span>
              <span>+0.35 Estrés</span>
              <span>+0.75+ Cultivo Sano</span>
            </div>
          </div>
        </div>

        {/* Right: Zone Reflectance Sliders & Drone Prescription (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="apple-glass rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Editando: {activeZone.name}
              </span>
              <span
                className="rounded-full px-3 py-0.5 font-mono text-xs font-extrabold text-white"
                style={{ backgroundColor: activeVisual.hex }}
              >
                NDVI {activeNdvi >= 0 ? '+' : ''}
                {activeNdvi.toFixed(2)}
              </span>
            </div>

            {/* Live Formula Substitution */}
            <div className="rounded-2xl bg-slate-900 text-slate-100 p-3.5 font-mono text-xs sm:text-sm text-center">
              NDVI = ({activeZone.nir.toFixed(2)} − {activeZone.red.toFixed(2)}) / (
              {activeZone.nir.toFixed(2)} + {activeZone.red.toFixed(2)}) ={' '}
              <strong className="text-emerald-400">
                {activeNdvi >= 0 ? '+' : ''}
                {activeNdvi.toFixed(2)}
              </strong>
            </div>

            {/* Red Band Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm font-semibold">
                <label htmlFor="red-band" className="flex items-center gap-1.5 text-slate-800">
                  <Sun className="size-4 text-red-600" />
                  Reflectancia Rojo (650 nm)
                </label>
                <span className="font-mono font-bold text-red-700">{activeZone.red.toFixed(2)}</span>
              </div>
              <input
                id="red-band"
                type="range"
                min={0.02}
                max={0.60}
                step={0.01}
                value={activeZone.red}
                onChange={(e) => updateActiveZone('red', Number(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-slate-500 block">
                Baja reflectancia = la clorofila absorbe luz roja para fotosíntesis.
              </span>
            </div>

            {/* NIR Band Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm font-semibold">
                <label htmlFor="nir-band" className="flex items-center gap-1.5 text-slate-800">
                  <Sprout className="size-4 text-emerald-600" />
                  Reflectancia NIR (860 nm)
                </label>
                <span className="font-mono font-bold text-emerald-700">{activeZone.nir.toFixed(2)}</span>
              </div>
              <input
                id="nir-band"
                type="range"
                min={0.04}
                max={0.85}
                step={0.01}
                value={activeZone.nir}
                onChange={(e) => updateActiveZone('nir', Number(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-slate-500 block">
                Alta reflectancia = estructura celular foliar intacta y bien hidratada.
              </span>
            </div>
          </div>

          {/* Agricultural Drone Prescription Output */}
          <div className="apple-glass rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-800">
                <Droplets className="size-4" />
                Prescripción Dron Agrícola (4° Medio)
              </span>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                Ahorro ref. ~{estimatedSavingPct}% insumos
              </span>
            </div>

            <div className="space-y-2">
              {zones.map((z) => {
                const n = computeNdvi(z.red, z.nir)
                const v = getNdviVisual(n)
                return (
                  <div
                    key={z.id}
                    className="rounded-2xl bg-white/85 border border-slate-200/75 p-3 flex items-start justify-between gap-3 text-xs sm:text-sm"
                  >
                    <div>
                      <strong className="text-slate-900">Zona {z.id}:</strong>{' '}
                      <span className="text-slate-700">{v.prescription}</span>
                    </div>
                    <span className="font-mono font-bold shrink-0" style={{ color: v.hex }}>
                      {n >= 0 ? '+' : ''}
                      {n.toFixed(2)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
