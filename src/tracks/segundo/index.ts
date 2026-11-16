import type { TrackDef } from '../types'
import { RutaGeomaticaStation } from './class1/stations/RutaGeomaticaStation'
import { Anatomia3DStation } from './class1/stations/Anatomia3DStation'
import { FisicaVueloStation } from './class1/stations/FisicaVueloStation'
import { HangarFlotaStation } from './class1/stations/HangarFlotaStation'
import { ControlModo2Station } from './class1/stations/ControlModo2Station'
import { NormativaDgacStation } from './class1/stations/NormativaDgacStation'
import { ChecklistCierre1Station } from './class1/stations/ChecklistCierre1Station'
import { PilotoAnalistaStation } from './class2/stations/PilotoAnalistaStation'
import { Mavic3TTermalStation } from './class2/stations/Mavic3TTermalStation'
import { Mavic3MNdviStation } from './class2/stations/Mavic3MNdviStation'
import { Phantom4FotogrametriaStation } from './class2/stations/Phantom4FotogrametriaStation'
import { TopografiaDronesStation } from './class2/stations/TopografiaDronesStation'
import { PlanificacionTelemetriaStation } from './class2/stations/PlanificacionTelemetriaStation'
import { GeomaticaTriviaStation } from './class2/stations/GeomaticaTriviaStation'
import { DecisionGeomaticaStation } from './class2/stations/DecisionGeomaticaStation'

export const segundoTrack: TrackDef = {
  id: 'segundo',
  label: 'Inducción 2° Medio',
  tagline: 'Especialización en drones RPAS, aerodinámica, normativa DGAC, teledetección y topografía.',
  decisionQuestion: '¿Sigues la senda de Geomática en 3° y 4° Medio?',
  heroMediaKey: 'segundoHero',
  classes: [
    {
      id: 'class-1',
      label: 'Clase 1: Ingeniería & Operación RPAS',
      durationMin: 90,
      stations: [
        {
          id: 'ruta-geomatica',
          title: 'Ruta Geomática: 3° y 4° Medio',
          minutes: "00' - 10' min",
          Component: RutaGeomaticaStation
        },
        {
          id: 'anatomia-3d',
          title: 'Anatomía 3D del Dron',
          minutes: "10' - 25' min",
          Component: Anatomia3DStation
        },
        {
          id: 'fisica-vuelo',
          title: 'Física del Vuelo',
          minutes: "25' - 40' min",
          Component: FisicaVueloStation
        },
        {
          id: 'hangar-flota',
          title: 'Hangar de la Flota',
          minutes: "40' - 55' min",
          Component: HangarFlotaStation
        },
        {
          id: 'control-modo-2',
          title: 'Control de Mando (Modo 2)',
          minutes: "55' - 68' min",
          Component: ControlModo2Station
        },
        {
          id: 'normativa-dgac',
          title: 'Normativa DGAC y Clima en Chillán',
          minutes: "68' - 80' min",
          Component: NormativaDgacStation
        },
        {
          id: 'checklist-prevuelo',
          title: 'Checklist Pre-Vuelo y Cierre',
          minutes: "80' - 90' min",
          Component: ChecklistCierre1Station
        }
      ]
    },
    {
      id: 'class-2',
      label: 'Clase 2: Sensores, Misiones & Topografía',
      durationMin: 90,
      stations: [
        {
          id: 'piloto-a-analista',
          title: 'De Piloto a Analista',
          minutes: "00' - 08' min",
          Component: PilotoAnalistaStation
        },
        {
          id: 'mavic-3t-termico',
          title: 'Mavic 3T: Térmico y Rescate',
          minutes: "08' - 20' min",
          Component: Mavic3TTermalStation
        },
        {
          id: 'mavic-3m-ndvi',
          title: 'Mavic 3M: NDVI y Agricultura',
          minutes: "20' - 32' min",
          Component: Mavic3MNdviStation
        },
        {
          id: 'phantom-4-fotogrametria',
          title: 'Phantom 4: Fotogrametría',
          minutes: "32' - 45' min",
          Component: Phantom4FotogrametriaStation
        },
        {
          id: 'topografia-drones',
          title: 'Topografía con Drones',
          minutes: "45' - 60' min",
          Component: TopografiaDronesStation
        },
        {
          id: 'planificacion-telemetria',
          title: 'Planificación de Misión y Telemetría',
          minutes: "60' - 72' min",
          Component: PlanificacionTelemetriaStation
        },
        {
          id: 'trivia-geomatica',
          title: 'Trivia de Geomática',
          minutes: "72' - 82' min",
          Component: GeomaticaTriviaStation
        },
        {
          id: 'decision-geomatica',
          title: '¿Sigues la senda en 3° y 4° Medio?',
          minutes: "82' - 90' min",
          Component: DecisionGeomaticaStation
        }
      ]
    }
  ]
}
