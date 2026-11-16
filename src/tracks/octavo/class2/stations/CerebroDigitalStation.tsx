import React from 'react'
import { Cpu, Terminal, Sparkles } from 'lucide-react'
import { MEDIA_CATALOG } from '../../../../data/media'

export const CerebroDigitalStation: React.FC = () => {
  return (
    <section aria-labelledby="c2-st0-title" className="space-y-6">
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <h1 id="c2-st0-title" className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          El Cerebro Digital: C++, Python e Inteligencia Artificial
        </h1>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          En la Clase 1 viste la electrónica y las piezas 3D (el cuerpo). Hoy vas a conocer cómo les damos un <strong>cerebro digital</strong> con programación y cerraremos con un vistazo a los drones del liceo.
        </p>
      </div>

      <div className="apple-glass-dark rounded-3xl overflow-hidden relative aspect-[16/8] max-h-[420px] shadow-xl">
        <img
          src={MEDIA_CATALOG.heroOverview.src}
          alt={MEDIA_CATALOG.heroOverview.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
        <div className="absolute bottom-5 inset-x-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
          <div>
            <span className="rounded-full bg-white/15 backdrop-blur-md border border-white/20 px-3.5 py-1 text-xs sm:text-sm font-semibold">
              Taller Geogo &amp; Geomática • Liceo Bicentenario San Nicolás
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-2">
              De la Placa Electrónica al Código Inteligente
            </h2>
          </div>
          <span className="text-xs sm:text-sm font-mono text-slate-200">
            Clase 2 • 8° Básico
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="apple-glass rounded-3xl p-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
              <Cpu className="size-5" />
            </div>
            <span className="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-bold text-slate-700">
              1° Medio • Geogo I
            </span>
          </div>
          <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
            C++ en Arduino
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Es el lenguaje con que le das órdenes directas al chip Arduino: encender luces, leer sensores de distancia en milésimas de segundo y activar alarmas.
          </p>
        </div>

        <div className="apple-glass rounded-3xl p-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-600">
              <Terminal className="size-5" />
            </div>
            <span className="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-bold text-slate-700">
              2° Medio • Geogo II
            </span>
          </div>
          <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
            Python y Telemetría
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Lenguaje claro para analizar la <strong>telemetría</strong> (los datos que envían tus sensores en tiempo real) y hacer proyectos con cámaras y robótica.
          </p>
        </div>

        <div className="apple-glass rounded-3xl p-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-sky-600/10 text-sky-600">
              <Sparkles className="size-5" />
            </div>
            <span className="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-bold text-slate-700">
              Desde 1° Medio
            </span>
          </div>
          <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
            Inteligencia Artificial
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            La usas como tu copiloto de taller: si le das instrucciones claras y ordenadas (prompts), te ayuda a escribir y corregir el código en minutos.
          </p>
        </div>
      </div>
    </section>
  )
}
