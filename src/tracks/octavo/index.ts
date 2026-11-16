import type { TrackDef } from '../types'
import { RutaFormativaStation } from './class1/stations/RutaFormativaStation'
import { OhmLabStation } from './class1/stations/OhmLabStation'
import { ProtoVsPcbStation } from './class1/stations/ProtoVsPcbStation'
import { ParametricCadStation } from './class1/stations/ParametricCadStation'
import { ManufacturaStation } from './class1/stations/ManufacturaStation'
import { CierreClase1Station } from './class1/stations/CierreClase1Station'
import { CerebroDigitalStation } from './class2/stations/CerebroDigitalStation'
import { PromptEngineeringStation } from './class2/stations/PromptEngineeringStation'
import { AiRadarStation } from './class2/stations/AiRadarStation'
import { VistazoDronesStation } from './class2/stations/VistazoDronesStation'
import { TriviaFinalStation } from './class2/stations/TriviaFinalStation'
import { DecisionGeogoStation } from './class2/stations/DecisionGeogoStation'

export const octavoTrack: TrackDef = {
  id: 'octavo',
  label: 'Inducción 8° Básico',
  tagline: 'Electrónica, diseño 3D, programación con IA y un primer vistazo a los drones del liceo.',
  decisionQuestion: '¿Te vienes a Geogo en 1° Medio?',
  heroMediaKey: 'octavoHero',
  classes: [
    {
      id: 'class-1',
      label: 'Clase 1: Electrónica & 3D',
      durationMin: 90,
      stations: [
        {
          id: 'ruta-formativa',
          title: 'Ruta Formativa: 1° a 4° Medio',
          minutes: "00' - 20' min",
          Component: RutaFormativaStation
        },
        {
          id: 'ley-de-ohm',
          title: 'Laboratorio 3D: Ley de Ohm',
          minutes: "20' - 45' min",
          Component: OhmLabStation
        },
        {
          id: 'proto-vs-pcb',
          title: 'Protoboard vs. PCB + Bandeja 1',
          minutes: "45' - 58' min",
          Component: ProtoVsPcbStation
        },
        {
          id: 'cad-parametrico',
          title: 'Diseño CAD 3D Paramétrico',
          minutes: "58' - 73' min",
          Component: ParametricCadStation
        },
        {
          id: 'manufactura-digital',
          title: 'Manufactura 3D y Láser + Bandeja 2',
          minutes: "73' - 84' min",
          Component: ManufacturaStation
        },
        {
          id: 'cierre-clase-1',
          title: 'Síntesis y Cierre Clase 1',
          minutes: "84' - 90' min",
          Component: CierreClase1Station
        }
      ]
    },
    {
      id: 'class-2',
      label: 'Clase 2: IA & Drones',
      durationMin: 90,
      stations: [
        {
          id: 'cerebro-digital',
          title: 'El Cerebro Digital (C++, Python e IA)',
          minutes: "00' - 10' min",
          Component: CerebroDigitalStation
        },
        {
          id: 'prompt-engineering',
          title: 'Cómo Pedirle Código a la IA (Prompts)',
          minutes: "10' - 28' min",
          Component: PromptEngineeringStation
        },
        {
          id: 'radar-ultrasonico',
          title: 'Radar Ultrasónico en Vivo',
          minutes: "28' - 50' min",
          Component: AiRadarStation
        },
        {
          id: 'vistazo-drones',
          title: 'Un Vistazo a los Drones',
          minutes: "50' - 65' min",
          Component: VistazoDronesStation
        },
        {
          id: 'trivia-final',
          title: 'Trivia Final',
          minutes: "65' - 78' min",
          Component: TriviaFinalStation
        },
        {
          id: 'decision-geogo',
          title: '¿Te vienes a Geogo en 1° Medio?',
          minutes: "78' - 90' min",
          Component: DecisionGeogoStation
        }
      ]
    }
  ]
}
