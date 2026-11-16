import React, { Suspense, lazy } from 'react'
import { PassAroundCard } from '../../../../components/shared/PassAroundCard'
import { ViewportSuspenseFallback } from '../../components/ViewportSuspenseFallback'

const LazyDroneAnatomy3D = lazy(() => import('../DroneAnatomy3D'))

export const Anatomia3DStation: React.FC = () => {
  return (
    <section aria-labelledby="seg-st1-title" className="space-y-6">
      <div className="space-y-1.5">
        <h2
          id="seg-st1-title"
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900"
        >
          Anatomía 3D de un Cuadricóptero RPAS
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
          Desliza la vista explotada y haz clic sobre cualquier pieza del dron en 3D mientras examinas los componentes reales de la Bandeja 3.
        </p>
      </div>

      <Suspense fallback={<ViewportSuspenseFallback label="Cargando modelo 3D de cuadricóptero..." />}>
        <LazyDroneAnatomy3D />
      </Suspense>

      <PassAroundCard
        trayNumber={3}
        trayTitle="Bandeja 3: Motores Brushless, Hélices CW/CCW y Chasis Carbono 3K"
        description="Manipula los componentes aeronáuticos reales que hacen volar la flota del liceo y compáralos con cada capa del modelo 3D."
        whatToObserve={[
          'Gira la campana del motor brushless con tus dedos: siente el par magnético (cogging) de los imanes de neodimio frente a las 12 bobinas de cobre.',
          'Compara dos hélices opuestas (CW y CCW): observa cómo el ángulo de ataque de sus palas está invertido en espejo.',
          'Evalúa la rigidez de la fibra de carbono 3K biselada: peso mínimo para máxima resistencia a vibraciones.'
        ]}
      />
    </section>
  )
}
