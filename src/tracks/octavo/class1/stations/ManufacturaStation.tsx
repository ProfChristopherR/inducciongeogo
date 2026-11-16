import React, { useState } from 'react'
import { Box, Flame } from 'lucide-react'
import { MEDIA_CATALOG } from '../../../../data/media'
import { PassAroundCard } from '../../../../components/shared/PassAroundCard'

export const ManufacturaStation: React.FC = () => {
  const [mfgTab, setMfgTab] = useState<'fdm' | 'laser'>('fdm')
  const [infillDensity, setInfillDensity] = useState<number>(20)

  return (
    <section aria-labelledby="st4-title" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 id="st4-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Manufactura Digital: Impresión 3D y Corte Láser (2° Medio)
          </h2>
          <p className="text-sm sm:text-base text-slate-700 mt-1 max-w-3xl leading-relaxed">
            Cuando terminas tu diseño 3D en el computador, eliges la máquina del taller para hacerlo realidad en plástico o madera/acrílico.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-2xl bg-slate-900/5 p-1 border border-slate-900/10 shrink-0">
          <button
            onClick={() => setMfgTab('fdm')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
              mfgTab === 'fdm' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Box className="size-4" />
            <span>Impresión 3D (Agrega capas)</span>
          </button>
          <button
            onClick={() => setMfgTab('laser')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
              mfgTab === 'laser' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Flame className="size-4" />
            <span>Corte Láser (Corta planchas)</span>
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7 apple-glass-dark rounded-3xl overflow-hidden relative aspect-[16/10]">
          <img
            src={MEDIA_CATALOG.manufacturingProcess.src}
            alt={MEDIA_CATALOG.manufacturingProcess.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
          <div className="absolute bottom-4 inset-x-4 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-white">
            <span className="rounded-full bg-blue-500/30 border border-blue-400/40 backdrop-blur-md px-3.5 py-1 font-semibold">
              Izquierda: Boquilla a 210 °C creando capas
            </span>
            <span className="rounded-full bg-orange-500/30 border border-orange-400/40 backdrop-blur-md px-3.5 py-1 font-semibold">
              Derecha: Rayo láser cortando planchas
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 apple-glass rounded-3xl p-6 flex flex-col justify-between space-y-4">
          {mfgTab === 'fdm' ? (
            <>
              <div className="space-y-2">
                <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-0.5 text-xs font-bold text-blue-800">
                  Truco de Ingeniería • Relleno tipo panal (Infill)
                </span>
                <h3 className="text-xl font-extrabold tracking-tight text-slate-900">
                  ¿Por qué una pieza 3D no se imprime 100% maciza?
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Si fuera plástico sólido pesaría demasiado y gastaría batería al volar. Por dentro la impresora dibuja un <strong>panal de abeja</strong> liviano y firme:
                </p>
              </div>

              <div className="rounded-2xl bg-white/80 border border-slate-200/80 p-4 space-y-3">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-800">Cantidad de relleno interno:</span>
                  <span className="font-mono font-bold text-blue-700">{infillDensity}%</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={100}
                  step={5}
                  value={infillDensity}
                  onChange={(e) => setInfillDensity(Number(e.target.value))}
                  className="w-full"
                />
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200/60">
                    <span className="text-xs text-slate-500 block font-semibold">Peso pieza</span>
                    <span className="font-mono text-sm font-bold text-slate-900">
                      {Math.round(14 + infillDensity * 0.32)} g
                    </span>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200/60">
                    <span className="text-xs text-slate-500 block font-semibold">Tiempo</span>
                    <span className="font-mono text-sm font-bold text-blue-700">
                      {Math.round(22 + infillDensity * 0.65)} min
                    </span>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200/60">
                    <span className="text-xs text-slate-500 block font-semibold">Resultado</span>
                    <span
                      className={`font-mono text-sm font-bold ${
                        infillDensity <= 35 ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {infillDensity <= 35 ? 'Liviano' : 'Pesado'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                Con <strong>20% a 25% de relleno panal</strong> consigues casi toda la fuerza usando menos de la mitad del peso.
              </p>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <span className="rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-0.5 text-xs font-bold text-orange-900">
                  Velocidad y Precisión • Corte Láser CNC
                </span>
                <h3 className="text-xl font-extrabold tracking-tight text-slate-900">
                  Placas listas en menos de 2 minutos
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Mientras una impresora 3D tarda varios minutos derritiendo plástico capa por capa, la cortadora láser recorta planchas de madera o acrílico con un rayo de luz preciso al <strong>0.1 mm</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white/80 border border-slate-200/70 p-4">
                  <span className="font-bold text-slate-900 block">¿Cuándo usar Impresión 3D?</span>
                  <span className="text-slate-700 text-sm mt-1 block leading-relaxed">
                    Para piezas con volumen y curvas: soportes de cámaras, protectores de hélices y carcasas.
                  </span>
                </div>
                <div className="rounded-2xl bg-white/80 border border-slate-200/70 p-4">
                  <span className="font-bold text-slate-900 block">¿Cuándo usar Corte Láser?</span>
                  <span className="text-slate-700 text-sm mt-1 block leading-relaxed">
                    Para piezas planas rápidas: bases de robots, cajas de proyectos y tapas de drones.
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <PassAroundCard
        trayNumber={2}
        trayTitle="Muestras de Manufactura (Piezas Impresas en 3D y Corte Láser)"
        description="Toca las piezas con tus manos para notar la diferencia entre el plástico impreso capa por capa y el corte limpio del rayo láser."
        whatToObserve={[
          'Pasa la uña por el costado de la pieza 3D: vas a sentir las líneas finas de cada capa.',
          'Mira la pieza abierta por la mitad para descubrir el relleno de panal por dentro.',
          'Compara lo firme y liso que queda el borde cortado con láser.'
        ]}
      />
    </section>
  )
}
