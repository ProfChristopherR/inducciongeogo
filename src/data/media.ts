/**
 * CATÁLOGO CENTRAL DE RECURSOS MULTIMEDIA (.WEBP OPTIMIZADOS)
 * -------------------------------------------------------------------------
 * Todas las imágenes están optimizadas en formato WebP real (< 400 KB) dentro
 * de 'public/media/' para carga instantánea en proyector y GitHub Pages.
 *
 * ¿CÓMO REEMPLAZAR POR UNA FOTO REAL DE TU LICEO?
 * Opción A: Guarda tu foto .webp en 'public/media/<nombre>.webp' con el mismo nombre.
 * Opción B: Guarda tu .jpg o .png en 'raw_media/<nombre>.jpg' y ejecuta 'npm.cmd run media'.
 */

export interface MediaItem {
  id: string
  title: string
  description: string
  src: string
  type: 'image' | 'video' | 'interactive'
  aspectRatio?: string
  realPhotoSlot: string
}

const baseUrl = import.meta.env.BASE_URL || '/'
const media = (filename: string) => `${baseUrl}media/${filename}`

export const MEDIA_CATALOG: Record<string, MediaItem> = {
  heroOverview: {
    id: 'heroOverview',
    title: 'Laboratorio de Especialidad: De la Electrónica a los Sistemas RPAS',
    description: 'Mesa técnica con Arduino Uno, placa PCB soldada, brazo impreso en 3D y dron DJI Mavic 3 Enterprise.',
    src: media('hero_overview.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/hero_overview.webp — Foto panorámica real de la mesa del taller con tus equipos.'
  },
  grade1Geogo: {
    id: 'grade1Geogo',
    title: '1° Medio • Geogo I: Fundamentos de Electrónica, Ley de Ohm y Diseño 3D',
    description: 'Arduino Uno, protoboard con diodos LED, resistencias axiales y sensor ultrasónico HC-SR04.',
    src: media('grade_1_geogo.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/grade_1_geogo.webp — Foto de un proyecto de 1° Medio en protoboard con Arduino.'
  },
  grade2Pcb3D: {
    id: 'grade2Pcb3D',
    title: '2° Medio • Geogo II: Placas PCB Soldadas, Manufactura 3D y Corte Láser',
    description: 'Placa PCB personalizada con pistas de cobre y oro junto a brazo de dron impreso en fibra de carbono.',
    src: media('grade_2_pcb_3d.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/grade_2_pcb_3d.webp — Foto de una placa PCB soldada e impresa por alumnos de 2° Medio.'
  },
  grade3Drones: {
    id: 'grade3Drones',
    title: '3° Medio • Geomática I: Aerodinámica RPAS, Normativa DGAC y Vuelo Seguro',
    description: 'Flota de entrenamiento con DJI NEO, FPV Whoop, cuadricóptero de carbono y DJI Phantom 4 Pro.',
    src: media('grade_3_drones.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/grade_3_drones.webp — Foto de práctica de vuelo en patio con los drones de 3° Medio.'
  },
  grade4Geomatica: {
    id: 'grade4Geomatica',
    title: '4° Medio • Geomática II: Sensores Térmicos (SAR), NDVI, Fotogrametría y Topografía',
    description: 'Dron DJI Mavic 3 Enterprise desplegando mapas térmicos, índices NDVI y levantamientos topográficos.',
    src: media('grade_4_geomatica.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/grade_4_geomatica.webp — Foto del Mavic 3T / 3M operando en terreno en 4° Medio.'
  },
  protoVsPcb: {
    id: 'protoVsPcb',
    title: 'Evolución del Hardware: Protoboard de Pruebas (1° Medio) vs. Placa PCB Definitiva (2° Medio)',
    description: 'Comparación macro entre conexiones temporales en protoboard y pistas de cobre soldadas con estaño.',
    src: media('proto_vs_pcb.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/proto_vs_pcb.webp — Foto comparativa lado a lado de tu protoboard y tu placa PCB.'
  },
  manufacturingProcess: {
    id: 'manufacturingProcess',
    title: 'Fabricación Digital: Impresión 3D FDM (Relleno Panal) y Corte Láser de Precisión',
    description: 'Boquilla de bronce extruyendo filamento en estructura de panal y láser cortando fibra de carbono.',
    src: media('manufacturing_process.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/manufacturing_process.webp — Foto de la impresora 3D y cortadora láser del liceo.'
  },
  droneExplodedView: {
    id: 'droneExplodedView',
    title: 'Ingeniería Aeronáutica: Despiece Táctico de un Cuadricóptero RPAS',
    description: 'Hélices contra-rotativas, motores brushless 2207, controladora de vuelo, chasis 3K y batería LiPo.',
    src: media('drone_exploded.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/drone_exploded.webp — Foto real del dron FPV desarmado sobre la mesa del taller.'
  },
  thermalSensorSar: {
    id: 'thermalSensorSar',
    title: 'Cámara Térmica Radiométrica (DJI Mavic 3T) • Búsqueda y Rescate (SAR)',
    description: 'Espectro infrarrojo Ironbow detectando firmas de calor humano en zonas boscosas de baja visibilidad.',
    src: media('thermal_human_sar.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/thermal_human_sar.webp — Captura térmica real tomada con el Mavic 3T del liceo.'
  },
  ndviAgriculture: {
    id: 'ndviAgriculture',
    title: 'Cámara Multiespectral (DJI Mavic 3M) • Agricultura de Precisión e Índice NDVI',
    description: 'Ortomosaico multiespectral que mide el vigor fotosintético de los cultivos para guiar drones agrícolas.',
    src: media('ndvi_agriculture.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/ndvi_agriculture.webp — Mapa NDVI real procesado por tus estudiantes.'
  },
  photogrammetry3D: {
    id: 'photogrammetry3D',
    title: 'Fotogrametría Aérea (DJI Phantom 4 Pro) • Gemelo Digital 3D del Campus',
    description: 'Nube de puntos densa y malla tridimensional georreferenciada mediante grilla de vuelo autónomo.',
    src: media('photogrammetry_3d.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/photogrammetry_3d.webp — Captura del modelo 3D del Liceo San Nicolás.'
  },
  octavoHero: {
    id: 'octavoHero',
    title: 'Inducción 8° Básico: Taller Tecnológico Geogo',
    description: 'Estudiantes construyendo circuitos con Arduino Uno junto a impresoras 3D en un taller luminoso.',
    src: media('octavo_hero.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/octavo_hero.webp — Foto real de alumnos de 1°/2° Medio trabajando en el taller de electrónica e impresión 3D.'
  },
  octavoDecision: {
    id: 'octavoDecision',
    title: 'Paso a 1° Medio: De Explorador a Constructor en Geogo',
    description: 'Transición desde circuitos experimentales hacia fabricación digital avanzada y robótica.',
    src: media('octavo_decision.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/octavo_decision.webp — Foto del laboratorio donde cursarán 1° y 2° Medio.'
  },
  segundoHero: {
    id: 'segundoHero',
    title: 'Inducción 2° Medio: Operación Aérea y Geomática en Ñuble',
    description: 'Estudiantes operando un DJI Mavic 3 Enterprise en terreno abierto del sur de Chile.',
    src: media('segundo_hero.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/segundo_hero.webp — Foto real de estudiantes operando drones del liceo en salida a terreno.'
  },
  geomatica3Medio: {
    id: 'geomatica3Medio',
    title: '3° Medio • Práctica de Vuelo RPAS y Entrenamiento Seguro',
    description: 'Cancha de entrenamiento con conos, helipuerto portátil, dron FPV y DJI Mini 4K con radiocontrol.',
    src: media('geomatica_3_medio.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/geomatica_3_medio.webp — Foto de práctica de vuelo de 3° Medio en la cancha del liceo.'
  },
  geomatica4Medio: {
    id: 'geomatica4Medio',
    title: '4° Medio • Estación de Procesamiento Térmico, NDVI y Topográfico',
    description: 'Estación de trabajo analizando mapas térmicos, índices multiespectrales NDVI y curvas de nivel 3D.',
    src: media('geomatica_4_medio.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/geomatica_4_medio.webp — Foto de alumnos procesando mapas e imágenes aéreas en el laboratorio.'
  },
  radioControlMode2: {
    id: 'radioControlMode2',
    title: 'Radio Control Modo 2: Precisión de Dos Sticks',
    description: 'Primer plano de mando profesional con dos gimbals de control de vuelo sobre terreno abierto.',
    src: media('radio_control.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/radio_control.webp — Foto real en primer plano de las manos de un estudiante operando el radiocontrol.'
  },
  preflightChecklist: {
    id: 'preflightChecklist',
    title: 'Protocolo Pre-Vuelo y Seguridad Aeronáutica',
    description: 'Dron preparado sobre helipuerto de despegue junto a baterías LiPo, hélices de repuesto y tablet de chequeo.',
    src: media('preflight_checklist.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/preflight_checklist.webp — Foto real del kit de vuelo desplegado sobre el landing pad antes del despegue.'
  },
  topografiaRtk: {
    id: 'topografiaRtk',
    title: 'Topografía de Precisión: Estación Base GNSS RTK y Puntos de Control (GCP)',
    description: 'Antena geodésica GNSS RTK en trípode junto a diana GCP y dron Phantom 4 RTK mapeando en terreno.',
    src: media('topografia_rtk.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/topografia_rtk.webp — Foto real del trípode RTK/diana fotogramétrica en terreno.'
  },
  topografiaCurvas: {
    id: 'topografiaCurvas',
    title: 'Topografía 3D: Modelo Digital de Elevación (MDE) y Curvas de Nivel',
    description: 'Representación técnica 3D de relieve, acopio de material y curvas de nivel georreferenciadas.',
    src: media('topografia_curvas.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/topografia_curvas.webp — Captura real de curvas de nivel o MDE generado en QGIS/Metashape.'
  },
  misionPlanificacion: {
    id: 'misionPlanificacion',
    title: 'Planificación Autónoma de Vuelo en Grilla',
    description: 'Tablet de campo mostrando grilla paralela de captura aérea sobre predio agrícola.',
    src: media('mision_planificacion.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/mision_planificacion.webp — Captura de pantalla real de DJI Pilot 2 / Pix4Dcapture en terreno.'
  },
  segundoDecision: {
    id: 'segundoDecision',
    title: 'Proyección 3° y 4° Medio: Tu Futuro en Geomática',
    description: 'Dron industrial elevándose sobre el valle agrícola y cordillera de Ñuble al amanecer.',
    src: media('segundo_decision.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/segundo_decision.webp — Foto aérea real del entorno de San Nicolás / Ñuble tomada con dron del liceo.'
  },
  droneDjiNeo: {
    id: 'droneDjiNeo',
    title: 'DJI NEO • Micro-Dron Caged para Vuelo Seguro en Sala',
    description: 'Dron DJI NEO de 135 g con protectores integrales de hélices 360°.',
    src: media('drone_dji_neo.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/drone_dji_neo.webp — Foto del DJI NEO del liceo.'
  },
  droneFpvIndoor: {
    id: 'droneFpvIndoor',
    title: 'Dron FPV Indoor (BetaFPV Aquila16)',
    description: 'Micro-dron FPV CineWhoop con ductos protectores para vuelo ágil en interiores.',
    src: media('drone_fpv_indoor.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/drone_fpv_indoor.webp — Foto del FPV Indoor Aquila16 del liceo.'
  },
  droneFpvOutdoor: {
    id: 'droneFpvOutdoor',
    title: 'Dron FPV Outdoor Táctico (Manta 3.6 / Carbono)',
    description: 'Cuadricóptero FPV de fibra de carbono 3K con electrónica y motores brushless al descubierto.',
    src: media('drone_fpv_outdoor.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/drone_fpv_outdoor.webp — Foto del FPV Outdoor Manta 3.6 del liceo.'
  },
  droneDjiMini4k: {
    id: 'droneDjiMini4k',
    title: 'DJI Mini 4K • Aeronave Escuela Sub-249g',
    description: 'Dron plegable ultraligero DJI Mini 4K con cámara estabilizada en gimbal de 3 ejes.',
    src: media('drone_dji_mini_4k.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/drone_dji_mini_4k.webp — Foto del DJI Mini 4K del liceo.'
  },
  dronePhantom4: {
    id: 'dronePhantom4',
    title: 'DJI Phantom 4 Pro / RTK • Fotogrametría y Topografía',
    description: 'Dron DJI Phantom 4 Pro con obturador mecánico de 1 pulgada para levantamientos cartográficos.',
    src: media('drone_phantom_4.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/drone_phantom_4.webp — Foto del DJI Phantom 4 Pro del liceo.'
  },
  droneMavic3t: {
    id: 'droneMavic3t',
    title: 'DJI Mavic 3 Enterprise Thermal (3T) • Búsqueda y Rescate SAR',
    description: 'Dron industrial DJI Mavic 3T con cámara térmica radiométrica y zoom óptico híbrido 56x.',
    src: media('drone_mavic_3t.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/drone_mavic_3t.webp — Foto del DJI Mavic 3T del liceo.'
  },
  droneMavic3m: {
    id: 'droneMavic3m',
    title: 'DJI Mavic 3 Multispectral (3M) • Agricultura de Precisión NDVI',
    description: 'Dron industrial DJI Mavic 3M con cámara multiespectral de 4 bandas y módulo RTK.',
    src: media('drone_mavic_3m.webp'),
    type: 'image',
    realPhotoSlot: 'public/media/drone_mavic_3m.webp — Foto del DJI Mavic 3M del liceo.'
  }
}
