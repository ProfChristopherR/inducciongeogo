import React from 'react'
import { SafeMediaImage } from '../../components/SafeMediaImage'
import { TelemetryHud } from '../../components/TelemetryHud'

export const PlanificacionTelemetriaStation: React.FC = () => {
  return (
    <section aria-labelledby="seg-c2-st5-title" className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h2
            id="seg-c2-st5-title"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900"
          >
            Planificación de Misión y Telemetría OSD
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
            En campo real no improvisas el vuelo: el software planifica la ruta autónoma y supervisas cada parámetro crítico en la pantalla de telemetría.
          </p>
        </div>

        <div className="apple-glass rounded-2xl p-2 flex items-center gap-3 shrink-0">
          <div className="w-24 aspect-[16/9] rounded-xl overflow-hidden bg-slate-950">
            <SafeMediaImage mediaKey="misionPlanificacion" fallbackKey="grade4Geomatica" />
          </div>
          <div className="pr-2 text-xs">
            <span className="font-extrabold text-slate-900 block">Estación de Control</span>
            <span className="text-slate-600">DJI Pilot 2 / Ground Station</span>
          </div>
        </div>
      </div>

      <TelemetryHud />
    </section>
  )
}
