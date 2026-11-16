import React from 'react'
import { Plane, ShieldCheck } from 'lucide-react'
import { DroneFleetHangar } from '../../components/DroneFleetHangar'

export const HangarFlotaStation: React.FC = () => {
  return (
    <section aria-labelledby="seg-st3-title" className="space-y-6">
      <div id="seg-st3-title">
        <DroneFleetHangar />
      </div>

      {/* Safe Classroom Demo Highlight: DJI NEO & FPV Indoor */}
      <div className="apple-glass rounded-3xl p-5 sm:p-6 border border-emerald-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
            <Plane className="size-6" />
          </div>
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <ShieldCheck className="size-3.5" />
              <span>Demo Segura en Sala • 3° Medio</span>
            </span>
            <h3 className="text-xl font-extrabold tracking-tight text-slate-900">
              Vuelo Estacionario Controlado con DJI NEO y FPV Indoor
            </h3>
            <p className="text-sm text-slate-700 max-w-3xl leading-relaxed">
              Ambos equipos cuentan con <strong>ductos protectores integrales de 360°</strong> alrededor de sus hélices y masa ultraligera (<strong>135 g</strong> el DJI NEO y <strong>110 g</strong> el FPV Whoop). Gracias a sus sensores ópticos inferiores, el profesor puede despegar frente al curso para demostrar sustentación y estabilidad sin riesgo de corte.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/25 px-4 py-3 text-center">
            <span className="text-xs font-bold text-emerald-900 block">DJI NEO</span>
            <span className="font-mono text-base font-extrabold text-emerald-700">135 g · 18 min</span>
            <span className="text-xs text-slate-600 block">Despegue en palma</span>
          </div>
          <div className="rounded-2xl bg-blue-500/10 border border-blue-500/25 px-4 py-3 text-center">
            <span className="text-xs font-bold text-blue-900 block">FPV Indoor</span>
            <span className="font-mono text-base font-extrabold text-blue-700">110 g · 6 min</span>
            <span className="text-xs text-slate-600 block">Ductos anti-impacto</span>
          </div>
        </div>
      </div>
    </section>
  )
}
