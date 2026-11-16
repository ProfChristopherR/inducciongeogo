import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Layers, RotateCw, Camera, Focus, CheckCircle2 } from 'lucide-react'
import { disposeObject3D } from '../utils/threeCleanup'

export type SubsystemId = 'chassis' | 'arms' | 'motors' | 'props' | 'stack' | 'battery'
type CameraPreset = 'perspective' | 'top' | 'motor' | 'stack'

interface SubsystemInfo {
  id: SubsystemId
  name: string
  shortLabel: string
  tag: string
  summary: string
  engineeringDetails: string[]
  geogoConnection: string
  cameraPreset: CameraPreset
}

const SUBSYSTEMS: SubsystemInfo[] = [
  {
    id: 'props',
    name: 'Hélices Perfiladas (2 CW + 2 CCW)',
    shortLabel: 'Hélices CW/CCW',
    tag: 'Propulsión Aerodinámica',
    summary:
      'Dos hélices giran en sentido horario (CW) y dos en sentido antihorario (CCW) con perfil alar invertido para generar empuje hacia abajo y cancelar el torque de giro.',
    engineeringDetails: [
      'Delantera Izq. (M4) y Trasera Der. (M2): giro horario (CW).',
      'Delantera Der. (M1) y Trasera Izq. (M3): giro antihorario (CCW).',
      'Tuercas M5 autoblocantes evitan que la hélice se suelte al acelerar.'
    ],
    geogoConnection: 'Perfil aerodinámico y tolerancias de balanceo heredadas de CAD 3D.',
    cameraPreset: 'top'
  },
  {
    id: 'motors',
    name: '4 Motores Brushless (Estator + Campana)',
    shortLabel: 'Motores Brushless',
    tag: 'Electromagnetismo Trifásico',
    summary:
      'Estator fijo con 12 bobinas de cobre esmaltado rodeado por una campana giratoria anodizada con imanes de neodimio, sin escobillas que generen roce.',
    engineeringDetails: [
      '3 cables trifásicos permiten invertir el giro cambiando dos fases o por software ESC.',
      'Clasificación KV indica revoluciones por voltio aplicado sin carga.',
      'Campana CNC ventilada disipa calor bajo altas corrientes (> 30 A por motor).'
    ],
    geogoConnection: 'Control de actuadores y electromagnetismo visto en Geogo I y II.',
    cameraPreset: 'motor'
  },
  {
    id: 'arms',
    name: '4 Brazos Estructurales Truss 3K',
    shortLabel: 'Brazos 3K',
    tag: 'Geometría X-Frame',
    summary:
      'Brazos en configuración True-X (45°) con cavidades de aligeramiento tipo celosía (truss) que maximizan la rigidez torsional con mínimo peso.',
    engineeringDetails: [
      'Fibra de carbono 3K de 5 mm absorbe vibraciones de alta frecuencia.',
      'Soportes de motor integrados protegen la campana ante aterrizajes exigentes.',
      'Anclaje doble con pernos M3 al sándwich central para mantenimiento modular.'
    ],
    geogoConnection: 'Igual al brazo paramétrico con celdas truss diseñado en Fusion 360.',
    cameraPreset: 'perspective'
  },
  {
    id: 'chassis',
    name: 'Chasis de Carbono 3K Biselado y Standoffs',
    shortLabel: 'Chasis 3K',
    tag: 'Célula Central Sándwich',
    summary:
      'Placa inferior y superior de fibra de carbono 3K unidas por separadores (standoffs) de aluminio anodizado y pernería M3 de acero.',
    engineeringDetails: [
      'Biselado CNC perimetral protege cables y correas contra bordes afilados.',
      'Jaula frontal aloja la cámara FPV / óptica sin obstruir el flujo de aire.',
      'Aislamiento rígido protege el stack electrónico frente a impactos.'
    ],
    geogoConnection: 'Corte láser/CNC y diseño de ensambles mecánicos de 2° Medio.',
    cameraPreset: 'perspective'
  },
  {
    id: 'stack',
    name: 'Stack Controladora (FC) + ESC 4-en-1 + Mástil GPS',
    shortLabel: 'Stack FC/ESC + GPS',
    tag: 'Cerebro y Potencia',
    summary:
      'Dos placas apiladas sobre amortiguadores de silicona: abajo el ESC 4-en-1 con MOSFETs de potencia; arriba la Controladora de Vuelo con giroscopio IMU, conectada al mástil GPS/brújula.',
    engineeringDetails: [
      'ESC 4-en-1 convierte la DC de la batería en pulsos trifásicos hacia los 4 motores.',
      'La FC lee giroscopio/acelerómetro miles de veces por segundo (lazo PID).',
      'Mástil elevado separa brújula y antena GNSS de la interferencia magnética de potencia.'
    ],
    geogoConnection: 'Evolución directa de la PCB propia y programación en C++ de Geogo.',
    cameraPreset: 'stack'
  },
  {
    id: 'battery',
    name: 'Batería LiPo Alta Descarga + Correa',
    shortLabel: 'Batería LiPo',
    tag: 'Sistema de Energía',
    summary:
      'Pack de Polímero de Litio (6S · 22.2 V nominal) asegurado al chasis superior con correa de velcro antideslizante, conector XT60 de alta corriente y cable de balanceo.',
    engineeringDetails: [
      'Celdas nominales a 3.7 V (4.20 V carga máxima, nunca descargar bajo 3.3 V/celda).',
      'Conector XT60 soporta descargas continuas elevadas sin caída térmica.',
      'Cable JST-XH blanco permite equilibrar el voltaje exacto de cada celda al cargar.'
    ],
    geogoConnection: 'Ley de Ohm, potencia eléctrica (P = V·I) y seguridad energética.',
    cameraPreset: 'stack'
  }
]

interface ExplodeTarget {
  object: THREE.Object3D
  basePos: THREE.Vector3
  explodeOffset: THREE.Vector3
}

function createCarbonWeaveTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#141c2b'
    ctx.fillRect(0, 0, 64, 64)
    for (let y = 0; y < 64; y += 8) {
      for (let x = 0; x < 64; x += 8) {
        const even = ((x + y) / 8) % 2 === 0
        ctx.fillStyle = even ? '#1e293b' : '#0f172a'
        ctx.fillRect(x, y, 7, 7)
        ctx.fillStyle = even ? 'rgba(148,163,184,0.12)' : 'rgba(15,23,42,0.35)'
        ctx.fillRect(x + 1, y + 1, 5, 3)
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(8, 8)
  return tex
}

function createPropellerGeometry(clockwise: boolean): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape()
  const sign = clockwise ? 1 : -1
  // Symmetric two-blade airfoil planform
  shape.moveTo(0, -1.6)
  shape.bezierCurveTo(6, -2.8 * sign, 16, -2.6 * sign, 23, -0.7 * sign)
  shape.bezierCurveTo(24.2, 0, 24.2, 0.8 * sign, 23, 1.3 * sign)
  shape.bezierCurveTo(16, 2.3 * sign, 6, 2.1 * sign, 0, 1.6)
  shape.bezierCurveTo(-6, 2.8 * sign, -16, 2.6 * sign, -23, 0.7 * sign)
  shape.bezierCurveTo(-24.2, 0, -24.2, -0.8 * sign, -23, -1.3 * sign)
  shape.bezierCurveTo(-16, -2.3 * sign, -6, -2.1 * sign, 0, -1.6)

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.45,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.16,
    bevelThickness: 0.14
  })
  geom.rotateX(Math.PI / 2)
  geom.translate(0, 0.25, 0)
  return geom
}

function tagSubsystem(obj: THREE.Object3D, id: SubsystemId) {
  obj.traverse((child) => {
    child.userData.subsystemId = id
  })
}

export const DroneAnatomy3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [explodePct, setExplodePct] = useState<number>(0)
  const [spinEnabled, setSpinEnabled] = useState<boolean>(true)
  const [selectedId, setSelectedId] = useState<SubsystemId>('props')
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('perspective')

  const explodeTargetRef = useRef<number>(0)
  const smoothedExplodeRef = useRef<number>(0)
  const spinRef = useRef<boolean>(true)
  const selectedIdRef = useRef<SubsystemId>('props')
  const cameraTargetPosRef = useRef<THREE.Vector3>(new THREE.Vector3(82, 58, 96))
  const cameraLookAtTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 6, 0))
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 6, 0))
  const subsystemMaterialsRef = useRef<Record<SubsystemId, THREE.MeshStandardMaterial[]>>({
    chassis: [],
    arms: [],
    motors: [],
    props: [],
    stack: [],
    battery: []
  })

  useEffect(() => {
    explodeTargetRef.current = explodePct / 100
    spinRef.current = spinEnabled
    selectedIdRef.current = selectedId
  }, [explodePct, spinEnabled, selectedId])

  const applyCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset)
    if (preset === 'perspective') {
      cameraTargetPosRef.current.set(82, 58, 96)
      cameraLookAtTargetRef.current.set(0, 6, 0)
    } else if (preset === 'top') {
      cameraTargetPosRef.current.set(0, 128, 16)
      cameraLookAtTargetRef.current.set(0, 8, 0)
    } else if (preset === 'motor') {
      cameraTargetPosRef.current.set(60, 32, -52)
      cameraLookAtTargetRef.current.set(27, 8, -27)
    } else if (preset === 'stack') {
      cameraTargetPosRef.current.set(42, 34, 44)
      cameraLookAtTargetRef.current.set(0, 11, 0)
    }
  }

  const handleSelectSubsystem = (id: SubsystemId) => {
    setSelectedId(id)
    const info = SUBSYSTEMS.find((s) => s.id === id)
    if (info) {
      applyCameraPreset(info.cameraPreset)
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 720
    const height = container.clientHeight || 480

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0b1120)
    scene.fog = new THREE.FogExp2(0x0b1120, 0.0022)

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.5, 800)
    camera.position.copy(cameraTargetPosRef.current)
    camera.lookAt(cameraLookAtTargetRef.current)

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.18
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // Studio Lighting
    const ambient = new THREE.AmbientLight(0xdbeafe, 1.35)
    scene.add(ambient)

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.35)
    keyLight.position.set(60, 115, 75)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 1024
    keyLight.shadow.mapSize.height = 1024
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.15)
    fillLight.position.set(-75, 55, -60)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0x60a5fa, 0.85)
    rimLight.position.set(10, -35, 85)
    scene.add(rimLight)

    // Workbench Floor Mat & Reference Grid
    const floorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(320, 260),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.78, metalness: 0.14 })
    )
    floorMesh.rotation.x = -Math.PI / 2
    floorMesh.position.y = -16
    floorMesh.receiveShadow = true
    scene.add(floorMesh)

    const grid = new THREE.GridHelper(220, 22, 0x334155, 0x1e293b)
    grid.position.y = -15.9
    scene.add(grid)

    const carbonTex = createCarbonWeaveTexture()

    // Dedicated materials per subsystem so emissive highlights stay isolated
    const chassisCarbonMat = new THREE.MeshStandardMaterial({
      map: carbonTex,
      color: 0x2a3444,
      roughness: 0.42,
      metalness: 0.35
    })
    const chassisStandoffMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.22,
      metalness: 0.85
    })
    const boltMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.2,
      metalness: 0.92
    })
    const armCarbonMat = new THREE.MeshStandardMaterial({
      map: carbonTex,
      color: 0x263142,
      roughness: 0.4,
      metalness: 0.35
    })
    const motorStatorMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.32,
      metalness: 0.78
    })
    const copperCoilMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.25,
      metalness: 0.88
    })
    const motorBellMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.2,
      metalness: 0.85
    })
    const propCwMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.26,
      metalness: 0.18
    })
    const propCcwMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.26,
      metalness: 0.18
    })
    const escPcbMat = new THREE.MeshStandardMaterial({
      color: 0x065f46,
      roughness: 0.38,
      metalness: 0.25
    })
    const fcPcbMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.35,
      metalness: 0.25
    })
    const gpsMastMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.28,
      metalness: 0.2
    })
    const chipMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.45
    })
    const lipoWrapMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.32,
      metalness: 0.12
    })
    const lipoAccentMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.35,
      metalness: 0.15
    })

    subsystemMaterialsRef.current = {
      chassis: [chassisCarbonMat, chassisStandoffMat],
      arms: [armCarbonMat],
      motors: [motorStatorMat, copperCoilMat, motorBellMat],
      props: [propCwMat, propCcwMat],
      stack: [escPcbMat, fcPcbMat, gpsMastMat],
      battery: [lipoWrapMat, lipoAccentMat]
    }

    const droneRoot = new THREE.Group()
    scene.add(droneRoot)

    const explodeTargets: ExplodeTarget[] = []
    const registerExplode = (object: THREE.Object3D, offset: THREE.Vector3) => {
      explodeTargets.push({
        object,
        basePos: object.position.clone(),
        explodeOffset: offset
      })
    }

    // ================= 1. CHASSIS (BOTTOM PLATE, STANDOFFS, TOP PLATE, CAMERA CAGE) =================
    const plateShape = new THREE.Shape()
    plateShape.moveTo(-12, -24)
    plateShape.lineTo(12, -24)
    plateShape.lineTo(17, -14)
    plateShape.lineTo(14, 0)
    plateShape.lineTo(17, 14)
    plateShape.lineTo(12, 24)
    plateShape.lineTo(-12, 24)
    plateShape.lineTo(-17, 14)
    plateShape.lineTo(-14, 0)
    plateShape.lineTo(-17, -14)
    plateShape.closePath()

    const plateGeom = new THREE.ExtrudeGeometry(plateShape, {
      depth: 2.2,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.6,
      bevelThickness: 0.5
    })
    plateGeom.rotateX(Math.PI / 2)

    const bottomPlateGroup = new THREE.Group()
    bottomPlateGroup.position.set(0, -1, 0)
    const bottomPlate = new THREE.Mesh(plateGeom, chassisCarbonMat)
    bottomPlate.castShadow = true
    bottomPlateGroup.add(bottomPlate)
    tagSubsystem(bottomPlateGroup, 'chassis')
    droneRoot.add(bottomPlateGroup)
    registerExplode(bottomPlateGroup, new THREE.Vector3(0, -14, 0))

    const topPlateGroup = new THREE.Group()
    topPlateGroup.position.set(0, 12.5, 0)
    const topPlate = new THREE.Mesh(plateGeom, chassisCarbonMat)
    topPlate.castShadow = true
    topPlateGroup.add(topPlate)

    // Front FPV Camera Cage Brackets + Lens
    ;[-7.5, 7.5].forEach((cx) => {
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(1.6, 9, 7), chassisCarbonMat)
      bracket.position.set(cx, -5.5, -21)
      topPlateGroup.add(bracket)
    })
    const camBody = new THREE.Mesh(new THREE.BoxGeometry(12, 8.5, 7), chipMat)
    camBody.position.set(0, -5.5, -21.5)
    topPlateGroup.add(camBody)
    const camLens = new THREE.Mesh(
      new THREE.CylinderGeometry(3.2, 3.6, 3.2, 20),
      chassisStandoffMat
    )
    camLens.rotation.x = Math.PI / 2
    camLens.position.set(0, -5.5, -25.5)
    topPlateGroup.add(camLens)

    tagSubsystem(topPlateGroup, 'chassis')
    droneRoot.add(topPlateGroup)
    registerExplode(topPlateGroup, new THREE.Vector3(0, 16, 0))

    // 4 Anodized Standoffs + Instanced M3 Bolts
    const standoffsGroup = new THREE.Group()
    const standoffCoords: [number, number][] = [
      [-10, -19],
      [10, -19],
      [-10, 19],
      [10, 19]
    ]
    const standoffGeom = new THREE.CylinderGeometry(1.7, 1.7, 11.5, 16)
    standoffCoords.forEach(([sx, sz]) => {
      const s = new THREE.Mesh(standoffGeom, chassisStandoffMat)
      s.position.set(sx, 5.2, sz)
      s.castShadow = true
      standoffsGroup.add(s)
    })
    tagSubsystem(standoffsGroup, 'chassis')
    droneRoot.add(standoffsGroup)
    registerExplode(standoffsGroup, new THREE.Vector3(0, 4, 0))

    // Instanced M3 Bolts (8 frame bolts + 16 motor bolts = 24 bolts)
    const boltGeom = new THREE.CylinderGeometry(1.1, 1.1, 1.4, 6)
    const boltInstanced = new THREE.InstancedMesh(boltGeom, boltMat, 8)
    const dummy = new THREE.Object3D()
    standoffCoords.forEach(([sx, sz], idx) => {
      dummy.position.set(sx, 13.4, sz)
      dummy.updateMatrix()
      boltInstanced.setMatrixAt(idx * 2, dummy.matrix)
      dummy.position.set(sx, -3.5, sz)
      dummy.updateMatrix()
      boltInstanced.setMatrixAt(idx * 2 + 1, dummy.matrix)
    })
    tagSubsystem(boltInstanced, 'chassis')
    droneRoot.add(boltInstanced)
    registerExplode(boltInstanced, new THREE.Vector3(0, 18, 0))

    // ================= 2. FOUR TRUSS ARMS + 3. FOUR BRUSHLESS MOTORS + 4. PROPELLERS =================
    const armConfigs: { xSign: number; zSign: number; cw: boolean; label: string }[] = [
      { xSign: 1, zSign: -1, cw: false, label: 'M1' }, // Front-Right CCW
      { xSign: 1, zSign: 1, cw: true, label: 'M2' },   // Rear-Right CW
      { xSign: -1, zSign: 1, cw: false, label: 'M3' }, // Rear-Left CCW
      { xSign: -1, zSign: -1, cw: true, label: 'M4' }  // Front-Left CW
    ]

    const armShape = new THREE.Shape()
    armShape.moveTo(11, -4.4)
    armShape.lineTo(39, -3.1)
    armShape.lineTo(39, 3.1)
    armShape.lineTo(11, 4.4)
    armShape.closePath()
    ;[18, 27].forEach((px) => {
      const hole = new THREE.Path()
      hole.moveTo(px - 3, -1.6)
      hole.lineTo(px + 3, -1.6)
      hole.lineTo(px + 3, 1.6)
      hole.lineTo(px - 3, 1.6)
      hole.closePath()
      armShape.holes.push(hole)
    })

    const armGeom = new THREE.ExtrudeGeometry(armShape, {
      depth: 3.6,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.45,
      bevelThickness: 0.45
    })
    armGeom.rotateX(Math.PI / 2)

    const motorPodGeom = new THREE.CylinderGeometry(8.2, 8.6, 3.6, 24)
    const statorBaseGeom = new THREE.CylinderGeometry(6.8, 7.0, 2.2, 24)
    const bellWallGeom = new THREE.CylinderGeometry(7.6, 7.6, 6.2, 28, 1, true)
    const bellCapGeom = new THREE.RingGeometry(2.1, 7.6, 28)
    const shaftGeom = new THREE.CylinderGeometry(1.2, 1.2, 7.5, 14)
    const locknutGeom = new THREE.CylinderGeometry(2.0, 2.5, 2.4, 6)
    const propCwGeom = createPropellerGeometry(true)
    const propCcwGeom = createPropellerGeometry(false)

    // InstancedMesh for 48 Copper Motor Coils (4 motors × 12 coils)
    const coilGeom = new THREE.BoxGeometry(2.3, 4.2, 1.5)
    const coilsInstanced = new THREE.InstancedMesh(coilGeom, copperCoilMat, 48)
    coilsInstanced.castShadow = true
    tagSubsystem(coilsInstanced, 'motors')
    droneRoot.add(coilsInstanced)

    const rotorSpinners: { mesh: THREE.Object3D; cw: boolean }[] = []
    const motorArmDist = 39
    const angle45 = Math.PI / 4
    let coilInstanceIdx = 0

    // Keep track of stator groups so coils track with motors when exploded
    const motorCoilAnchors: { basePos: THREE.Vector3; explodeOffset: THREE.Vector3 }[] = []

    armConfigs.forEach((cfg) => {
      const dirX = cfg.xSign * Math.cos(angle45)
      const dirZ = cfg.zSign * Math.sin(angle45)
      const mx = dirX * motorArmDist
      const mz = dirZ * motorArmDist
      const armRotY = -Math.atan2(dirZ, dirX)

      // Arm group
      const armGroup = new THREE.Group()
      armGroup.position.set(0, 1.2, 0)
      armGroup.rotation.y = armRotY
      const armMesh = new THREE.Mesh(armGeom, armCarbonMat)
      armMesh.castShadow = true
      armGroup.add(armMesh)

      const pod = new THREE.Mesh(motorPodGeom, armCarbonMat)
      pod.position.set(motorArmDist, -1.7, 0)
      pod.castShadow = true
      armGroup.add(pod)

      tagSubsystem(armGroup, 'arms')
      droneRoot.add(armGroup)
      registerExplode(armGroup, new THREE.Vector3(dirX * 10, -5, dirZ * 10))

      // Stator group
      const statorGroup = new THREE.Group()
      statorGroup.position.set(mx, 2.2, mz)
      const statorBase = new THREE.Mesh(statorBaseGeom, motorStatorMat)
      statorBase.castShadow = true
      statorGroup.add(statorBase)
      tagSubsystem(statorGroup, 'motors')
      droneRoot.add(statorGroup)
      const statorExplode = new THREE.Vector3(dirX * 10, 6, dirZ * 10)
      registerExplode(statorGroup, statorExplode)

      // Record 12 coil anchors for this motor
      for (let c = 0; c < 12; c++) {
        const cAng = (c * Math.PI * 2) / 12
        const cr = 4.9
        const basePos = new THREE.Vector3(mx + Math.cos(cAng) * cr, 5.1, mz + Math.sin(cAng) * cr)
        motorCoilAnchors.push({ basePos, explodeOffset: statorExplode })
        dummy.position.copy(basePos)
        dummy.rotation.set(0, -cAng, 0)
        dummy.updateMatrix()
        coilsInstanced.setMatrixAt(coilInstanceIdx++, dummy.matrix)
      }

      // Motor Bell + Shaft
      const bellGroup = new THREE.Group()
      bellGroup.position.set(mx, 6.4, mz)
      const bellWall = new THREE.Mesh(bellWallGeom, motorBellMat)
      bellWall.castShadow = true
      bellGroup.add(bellWall)
      const bellCap = new THREE.Mesh(bellCapGeom, motorBellMat)
      bellCap.rotation.x = -Math.PI / 2
      bellCap.position.y = 3.1
      bellGroup.add(bellCap)
      const shaft = new THREE.Mesh(shaftGeom, boltMat)
      shaft.position.y = 5.4
      bellGroup.add(shaft)
      tagSubsystem(bellGroup, 'motors')
      droneRoot.add(bellGroup)
      registerExplode(bellGroup, new THREE.Vector3(dirX * 10, 17, dirZ * 10))

      // Propeller + Locknut
      const propGroup = new THREE.Group()
      propGroup.position.set(mx, 11.2, mz)
      const propMat = cfg.cw ? propCwMat : propCcwMat
      const propMesh = new THREE.Mesh(cfg.cw ? propCwGeom : propCcwGeom, propMat)
      propMesh.castShadow = true
      propGroup.add(propMesh)

      const locknut = new THREE.Mesh(locknutGeom, boltMat)
      locknut.position.y = 1.4
      propGroup.add(locknut)

      tagSubsystem(propGroup, 'props')
      droneRoot.add(propGroup)
      registerExplode(propGroup, new THREE.Vector3(dirX * 10, 32, dirZ * 10))

      rotorSpinners.push({ mesh: propGroup, cw: cfg.cw })
      rotorSpinners.push({ mesh: bellGroup, cw: cfg.cw })
    })

    // ================= 5. CENTRAL STACK (ESC 4-IN-1 + FLIGHT CONTROLLER + GPS MAST) =================
    // ESC 4-in-1
    const escGroup = new THREE.Group()
    escGroup.position.set(0, 3.2, 0)
    const escBoard = new THREE.Mesh(new THREE.BoxGeometry(20, 1.4, 20), escPcbMat)
    escBoard.castShadow = true
    escGroup.add(escBoard)

    // 4 MOSFET bank InstancedMesh on ESC
    const mosfetInst = new THREE.InstancedMesh(new THREE.BoxGeometry(3.2, 0.8, 3.2), chipMat, 8)
    for (let i = 0; i < 8; i++) {
      const side = i < 4 ? -6.8 : 6.8
      const zOff = -6 + (i % 4) * 4
      dummy.position.set(side, 1.0, zOff)
      dummy.rotation.set(0, 0, 0)
      dummy.updateMatrix()
      mosfetInst.setMatrixAt(i, dummy.matrix)
    }
    escGroup.add(mosfetInst)

    // Filter capacitor at rear of ESC
    const capMesh = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 5.4, 16), chipMat)
    capMesh.rotation.x = Math.PI / 2
    capMesh.position.set(0, 1.6, 13)
    escGroup.add(capMesh)
    tagSubsystem(escGroup, 'stack')
    droneRoot.add(escGroup)
    registerExplode(escGroup, new THREE.Vector3(0, 2, 0))

    // Flight Controller PCB + MCU + IMU + USB-C
    const fcGroup = new THREE.Group()
    fcGroup.position.set(0, 7.6, 0)
    const fcBoard = new THREE.Mesh(new THREE.BoxGeometry(19, 1.4, 19), fcPcbMat)
    fcBoard.castShadow = true
    fcGroup.add(fcBoard)

    const mcu = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.9, 6.5), chipMat)
    mcu.position.set(0, 1.1, 0)
    fcGroup.add(mcu)

    const imuChip = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.8, 2.6), chipMat)
    imuChip.position.set(-5.2, 1.1, -4.5)
    fcGroup.add(imuChip)

    const usbPort = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.6, 3.2), boltMat)
    usbPort.position.set(8.8, 1.1, 0)
    fcGroup.add(usbPort)

    // GPS & Compass Mast mounted at rear
    const mastPole = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 18, 12), chipMat)
    mastPole.position.set(0, 14, 15.5)
    fcGroup.add(mastPole)

    const gpsPuck = new THREE.Mesh(new THREE.CylinderGeometry(6.8, 7.2, 3.0, 24), gpsMastMat)
    gpsPuck.position.set(0, 23, 15.5)
    gpsPuck.castShadow = true
    fcGroup.add(gpsPuck)

    const gpsNoseMarker = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 4.4), propCwMat)
    gpsNoseMarker.position.set(0, 24.6, 13.5)
    fcGroup.add(gpsNoseMarker)

    tagSubsystem(fcGroup, 'stack')
    droneRoot.add(fcGroup)
    registerExplode(fcGroup, new THREE.Vector3(0, 10, 0))

    // ================= 6. LIPO BATTERY PACK + VELCRO STRAP + XT60 =================
    const battGroup = new THREE.Group()
    battGroup.position.set(0, 19.2, -1)

    const battBody = new THREE.Mesh(new THREE.BoxGeometry(16.5, 10.5, 31), lipoWrapMat)
    battBody.castShadow = true
    battGroup.add(battBody)

    const battLabelBand = new THREE.Mesh(new THREE.BoxGeometry(16.8, 5.2, 14), lipoAccentMat)
    battLabelBand.position.set(0, 1.2, 0)
    battGroup.add(battLabelBand)

    const strap = new THREE.Mesh(new THREE.BoxGeometry(18.0, 12.6, 6.2), chipMat)
    strap.position.set(0, -0.8, 0)
    battGroup.add(strap)

    const xt60Plug = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.2, 5.2), lipoAccentMat)
    xt60Plug.position.set(4.5, -1.5, 17.5)
    battGroup.add(xt60Plug)

    tagSubsystem(battGroup, 'battery')
    droneRoot.add(battGroup)
    registerExplode(battGroup, new THREE.Vector3(0, 33, 0))

    // ================= INTERACTION (ORBIT DRAG + RAYCASTER CLICK) =================
    const raycaster = new THREE.Raycaster()
    const pointerNdc = new THREE.Vector2()
    let isDragging = false
    let downX = 0
    let downY = 0
    let prevX = 0
    let prevY = 0

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true
      downX = e.clientX
      downY = e.clientY
      prevX = e.clientX
      prevY = e.clientY
      renderer.domElement.setPointerCapture(e.pointerId)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return
      const dx = e.clientX - prevX
      const dy = e.clientY - prevY
      droneRoot.rotation.y += dx * 0.0085
      droneRoot.rotation.x = Math.max(-0.55, Math.min(0.65, droneRoot.rotation.x + dy * 0.006))
      prevX = e.clientX
      prevY = e.clientY
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return
      isDragging = false
      if (renderer.domElement.hasPointerCapture(e.pointerId)) {
        renderer.domElement.releasePointerCapture(e.pointerId)
      }

      // Click detection if pointer moved < 6px
      const dist = Math.hypot(e.clientX - downX, e.clientY - downY)
      if (dist < 6) {
        const rect = renderer.domElement.getBoundingClientRect()
        pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(pointerNdc, camera)
        const hits = raycaster.intersectObjects(droneRoot.children, true)
        const hitWithTag = hits.find((h) => h.object.userData?.subsystemId)
        if (hitWithTag) {
          const picked = hitWithTag.object.userData.subsystemId as SubsystemId
          setSelectedId(picked)
        }
      }
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerup', onPointerUp)
    renderer.domElement.addEventListener('pointercancel', onPointerUp)

    // ================= ANIMATION LOOP (60 FPS) =================
    let animId = 0
    let clock = 0

    const animate = () => {
      animId = requestAnimationFrame(animate)
      clock += 0.016

      // Smooth damped camera transition
      camera.position.lerp(cameraTargetPosRef.current, 0.08)
      currentLookAtRef.current.lerp(cameraLookAtTargetRef.current, 0.08)
      camera.lookAt(currentLookAtRef.current)

      // Smooth damped explode interpolation
      smoothedExplodeRef.current += (explodeTargetRef.current - smoothedExplodeRef.current) * 0.14
      const exp = smoothedExplodeRef.current

      explodeTargets.forEach((item) => {
        item.object.position.copy(item.basePos).addScaledVector(item.explodeOffset, exp)
      })

      // Update instanced motor coils positions smoothly during explode
      for (let i = 0; i < motorCoilAnchors.length; i++) {
        const anchor = motorCoilAnchors[i]
        const cAng = ((i % 12) * Math.PI * 2) / 12
        dummy.position.copy(anchor.basePos).addScaledVector(anchor.explodeOffset, exp)
        dummy.rotation.set(0, -cAng, 0)
        dummy.updateMatrix()
        coilsInstanced.setMatrixAt(i, dummy.matrix)
      }
      coilsInstanced.instanceMatrix.needsUpdate = true

      // Correct CW (-Y) vs CCW (+Y) rotation
      if (spinRef.current) {
        rotorSpinners.forEach((spinner) => {
          spinner.mesh.rotation.y += spinner.cw ? -0.16 : 0.16
        })
      }

      // Gentle idle turntable when not dragging
      if (!isDragging) {
        droneRoot.rotation.y += 0.0022
      }

      // Subtle emissive highlight on selected subsystem
      const activeKey = selectedIdRef.current
      const pulse = 0.28 + Math.sin(clock * 4) * 0.1
      ;(Object.keys(subsystemMaterialsRef.current) as SubsystemId[]).forEach((key) => {
        const mats = subsystemMaterialsRef.current[key]
        mats.forEach((m) => {
          if (key === activeKey) {
            m.emissive.setHex(0x0284c7)
            m.emissiveIntensity = pulse
          } else {
            m.emissive.setHex(0x000000)
            m.emissiveIntensity = 0
          }
        })
      })

      renderer.render(scene, camera)
    }

    animate()

    const onResize = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth || 720
      const h = containerRef.current.clientHeight || 480
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerup', onPointerUp)
      renderer.domElement.removeEventListener('pointercancel', onPointerUp)
      disposeObject3D(scene)
      carbonTex.dispose()
      renderer.dispose()
    }
  }, [])

  const activeInfo = SUBSYSTEMS.find((s) => s.id === selectedId) ?? SUBSYSTEMS[0]

  return (
    <div className="space-y-5">
      {/* Subsystem Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {SUBSYSTEMS.map((sub) => {
          const isSelected = sub.id === selectedId
          return (
            <button
              key={sub.id}
              onClick={() => handleSelectSubsystem(sub.id)}
              className={`rounded-2xl p-3 text-left transition-all active:scale-[0.98] ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-lg ring-2 ring-sky-500/60'
                  : 'apple-glass hover:bg-white/95 text-slate-800'
              }`}
            >
              <span
                className={`text-[11px] font-bold uppercase tracking-wider block ${
                  isSelected ? 'text-sky-400' : 'text-blue-600'
                }`}
              >
                {sub.tag.split(' ')[0]}
              </span>
              <span className="mt-1 block text-xs sm:text-sm font-extrabold leading-tight">
                {sub.shortLabel}
              </span>
            </button>
          )
        })}
      </div>

      {/* Main 3D Workbench + Engineering Inspector */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left: 3D Viewport (7 cols) */}
        <div className="lg:col-span-7 apple-glass-dark rounded-3xl overflow-hidden relative flex flex-col justify-between min-h-[480px]">
          {/* Top Floating Controls */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 p-4 pointer-events-none">
            <div className="pointer-events-auto flex flex-wrap items-center gap-2">
              <button
                onClick={() => setExplodePct(explodePct > 15 ? 0 : 100)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border backdrop-blur-xl transition-all active:scale-[0.97] ${
                  explodePct > 15
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-900/85 text-slate-100 border-white/15 hover:bg-white/10'
                }`}
              >
                <Layers className="size-3.5" />
                <span>{explodePct > 15 ? 'Ensamblar Todo' : 'Vista Explotada'}</span>
              </button>

              <button
                onClick={() => setSpinEnabled((v) => !v)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-xl transition-all active:scale-[0.97] ${
                  spinEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-900/85 text-slate-300 border-white/15'
                }`}
              >
                <RotateCw className={`size-3.5 ${spinEnabled ? 'animate-spin' : ''}`} />
                <span>Hélices {spinEnabled ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Camera Presets */}
            <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-slate-900/85 border border-white/15 p-1 backdrop-blur-xl">
              {(
                [
                  { id: 'perspective', label: '3D' },
                  { id: 'top', label: 'CW/CCW' },
                  { id: 'motor', label: 'Motor' },
                  { id: 'stack', label: 'Stack' }
                ] as const
              ).map((cam) => (
                <button
                  key={cam.id}
                  onClick={() => applyCameraPreset(cam.id)}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                    cameraPreset === cam.id
                      ? 'bg-sky-500 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {cam.label}
                </button>
              ))}
            </div>
          </div>

          {/* Three.js Canvas */}
          <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none"
          />

          {/* Bottom Floating Explode Slider & Legend */}
          <div className="relative z-20 p-4 mt-auto pointer-events-none">
            <div className="pointer-events-auto rounded-2xl bg-slate-900/90 border border-white/15 p-3.5 backdrop-blur-2xl flex flex-wrap items-center justify-between gap-4 text-xs text-slate-200">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-sky-400" />
                  <span>2× Hélices CW</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-amber-400" />
                  <span>2× Hélices CCW</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-slate-400">
                  <Camera className="size-3.5" />
                  <span>Arrastra para rotar · Clic en pieza para inspeccionar</span>
                </span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <label htmlFor="explode-slider" className="text-xs font-semibold text-slate-300 shrink-0">
                  Despiece ({explodePct}%):
                </label>
                <input
                  id="explode-slider"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={explodePct}
                  onChange={(e) => setExplodePct(Number(e.target.value))}
                  className="w-full sm:w-32 accent-sky-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Selected Subsystem Detail Card (5 cols) */}
        <div className="lg:col-span-5 apple-glass rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 px-3 py-1 text-xs font-bold text-blue-800">
                <Focus className="size-3.5" />
                <span>{activeInfo.tag}</span>
              </span>
              <span className="font-mono text-xs font-bold text-slate-500">
                6 Subsistemas
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                {activeInfo.name}
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                {activeInfo.summary}
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Detalles de Ingeniería
              </span>
              {activeInfo.engineeringDetails.map((detail) => (
                <div
                  key={detail}
                  className="flex items-start gap-2.5 rounded-2xl bg-white/80 border border-slate-200/75 p-3 text-sm text-slate-800"
                >
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug font-medium">{detail}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-blue-600/[0.06] border border-blue-600/15 p-3.5">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800 block mb-0.5">
              Puente desde 1° y 2° Medio
            </span>
            <p className="text-sm font-semibold text-slate-900 leading-snug">
              {activeInfo.geogoConnection}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DroneAnatomy3D
