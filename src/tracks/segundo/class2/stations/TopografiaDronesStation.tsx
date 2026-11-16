import React, { Suspense, lazy } from 'react'
import { ViewportSuspenseFallback } from '../../components/ViewportSuspenseFallback'

const LazyTopography3DLab = lazy(() => import('../Topography3DLab'))

export const TopografiaDronesStation: React.FC = () => {
  return (
    <section aria-labelledby="seg-c2-st4-title" className="space-y-6">
      <div className="space-y-1.5">
        <h2
          id="seg-c2-st4-title"
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900"
        >
          Topografía con Drones: GNSS RTK, Curvas de Nivel y Cubicación
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
          Interactúa con un Modelo Digital de Elevación (MDE) en 3D: cambia la equidistancia para regenerar curvas de nivel en vivo, traza perfiles topográficos y cubica un acopio de material en metros cúbicos.
        </p>
      </div>

      <Suspense fallback={<ViewportSuspenseFallback label="Cargando terreno 3D y curvas de nivel..." />}>
        <LazyTopography3DLab />
      </Suspense>
    </section>
  )
}
