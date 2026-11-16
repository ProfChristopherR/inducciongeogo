import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, ShieldCheck, AlertTriangle } from 'lucide-react'
import { MEDIA_CATALOG } from '../../../../data/media'
import { PassAroundCard } from '../../../../components/shared/PassAroundCard'

export const ProtoVsPcbStation: React.FC = () => {
  const [vibrationTestActive, setVibrationTestActive] = useState<boolean>(false)

  return (
    <section aria-labelledby="st2-title" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 id="st2-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            De la Protoboard a la Placa PCB Soldada (1° a 2° Medio)
          </h2>
          <p className="text-sm sm:text-base text-slate-700 mt-1 max-w-3xl leading-relaxed">
            La <strong>protoboard</strong> es un tablero blanco para ensayar rápido sin soldar, mientras que la <strong>placa PCB</strong> es la tarjeta definitiva con pistas de cobre soldadas para que nada se desconecte al moverse o volar.
          </p>
        </div>

        <button
          onClick={() => setVibrationTestActive(!vibrationTestActive)}
          className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all shrink-0 ${
            vibrationTestActive
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 animate-pulse'
              : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
          }`}
        >
          <Activity className="size-4" />
          <span>
            {vibrationTestActive ? 'Detener Prueba de Vibración' : 'Simular Vibración en Vivo'}
          </span>
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7 apple-glass-dark rounded-3xl overflow-hidden relative aspect-[16/10] flex items-center justify-center">
          <img
            src={MEDIA_CATALOG.protoVsPcb.src}
            alt={MEDIA_CATALOG.protoVsPcb.title}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              vibrationTestActive ? 'scale-[1.03]' : 'scale-100'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
          <div className="absolute bottom-4 inset-x-4 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-white">
            <span className="rounded-full bg-amber-500/25 border border-amber-400/40 backdrop-blur-md px-3.5 py-1 font-semibold text-amber-100">
              Izquierda: Protoboard (1° Medio)
            </span>
            <span className="rounded-full bg-emerald-500/25 border border-emerald-400/40 backdrop-blur-md px-3.5 py-1 font-semibold text-emerald-100">
              Derecha: Placa PCB Soldada (2° Medio)
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-rows-2 gap-4">
          <motion.div
            animate={
              vibrationTestActive
                ? { x: [-3, 3, -3, 3, 0], rotate: [-0.8, 0.8, -0.5, 0] }
                : { x: 0, rotate: 0 }
            }
            transition={{ repeat: vibrationTestActive ? Infinity : 0, duration: 0.35 }}
            className={`apple-glass rounded-3xl p-5 flex flex-col justify-between border ${
              vibrationTestActive ? 'border-red-400 bg-red-50/70' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-amber-500/12 border border-amber-500/25 px-3 py-0.5 text-xs font-bold text-amber-900">
                1° Medio • Protoboard sin soldadura
              </span>
              {vibrationTestActive ? (
                <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-red-600">
                  <AlertTriangle className="size-4" />
                  ¡Se soltó un cable!
                </span>
              ) : (
                <span className="text-xs font-semibold text-slate-500">Para probar en mesa</span>
              )}
            </div>

            <div className="my-2">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Ideal para aprender y cambiar piezas en segundos
              </h3>
              <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                Enchufas los cables a presión sin herramientas. Es genial para ensayar circuitos en clases, aunque los cables se salen si el proyecto vibra.
              </p>
            </div>

            <div className="rounded-xl bg-white/80 border border-slate-200/70 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 flex items-center justify-between">
              <span>Resistencia a vibraciones:</span>
              <span className="text-red-600 font-bold">Baja (Se desconecta)</span>
            </div>
          </motion.div>

          <div
            className={`apple-glass rounded-3xl p-5 flex flex-col justify-between border ${
              vibrationTestActive ? 'border-emerald-500 ring-2 ring-emerald-500/20' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-emerald-500/12 border border-emerald-500/25 px-3 py-0.5 text-xs font-bold text-emerald-900">
                2° Medio • Placa PCB Soldada
              </span>
              <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-emerald-700">
                <ShieldCheck className="size-4" />
                Firme al 100%
              </span>
            </div>

            <div className="my-2">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Pistas de cobre soldadas con estaño
              </h3>
              <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                Reemplazas todos los cables por caminos de cobre fijos en la placa. Nada se suelta aunque un robot choque o un dron vuele rápido.
              </p>
            </div>

            <div className="rounded-xl bg-white/80 border border-slate-200/70 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 flex items-center justify-between">
              <span>Resistencia a vibraciones:</span>
              <span className="text-emerald-700 font-bold">Nivel Profesional</span>
            </div>
          </div>
        </div>
      </div>

      <PassAroundCard
        trayNumber={1}
        trayTitle="Bandejas de Electrónica (Protoboard, Placas PCB y Sensores Arduino)"
        description="Mientras miras la comparación en la pantalla, pasa la bandeja por tu fila para que compares el peso, la firmeza y las soldaduras."
        whatToObserve={[
          'Bandeja 1: Mira las 4 bandas de color de cada resistencia y prueba cómo entran las patas en la protoboard.',
          'Bandeja 2: Da vuelta la placa PCB y toca las pistas de cobre y las gotitas brillantes de soldadura.',
          'Bandeja 3: Examina el sensor ultrasónico HC-SR04 (los dos cilindros metálicos que funcionan como ojos de sonido).'
        ]}
      />
    </section>
  )
}
