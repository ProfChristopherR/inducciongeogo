import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Box, Compass, Layers, Mountain, Radio, Ruler } from 'lucide-react'
import { disposeObject3D } from '../utils/threeCleanup'
import { SafeMediaImage } from '../components/SafeMediaImage'

type Equidistance = 0.5 | 1 | 2 | 5
type ActiveTool = 'contours' | 'profile' | 'volume' | 'rtk'

interface Point2D {
  x: number
  z: number
}

const TERRAIN_SIZE = 80 // meters (-40 to +40)
const GRID_RES = 80 // 81x81 vertices => 1.0 m grid spacing
const DATUM_OFFSET = 100 // base elevation 100 m s.n.m.
const STOCKPILE_CENTER = { x: 16, z: 14 }
const STOCKPILE_RADIUS = 11.5
const PAD_BASE_RELATIVE = 2.5 // 102.5 m s.n.m.

/**
 * Analytical terrain elevation (meters above relative datum 0)
 * Combines a ridge/hill, a valley drainage channel, a secondary knoll,
 * and a graded work pad supporting a measurable stockpile mound.
 */
function evaluateTerrain(x: number, z: number, stockpilePeakM: number): number {
  const hill = 16.8 * Math.exp(-(((x + 19) ** 2) / 340 + ((z + 17) ** 2) / 280))
  const secondaryKnoll = 8.4 * Math.exp(-(((x - 22) ** 2) + ((z + 21) ** 2)) / 240)
  const valleyDist = z - 0.32 * x + 2
  const valley = -3.4 * Math.exp(-(valleyDist ** 2) / 110)

  const natural = 4.0 + hill + secondaryKnoll + valley

  // Blend smoothly into flat quarry pad around stockpile center
  const dPad = Math.hypot(x - STOCKPILE_CENTER.x, z - STOCKPILE_CENTER.z)
  const padBlend = Math.max(0, Math.min(1, 1 - (dPad - 12.5) / 6.0))
  const padSmooth = padBlend * padBlend * (3 - 2 * padBlend)
  const baseTerrain = natural * (1 - padSmooth) + PAD_BASE_RELATIVE * padSmooth

  // Stockpile mound rising cleanly above the flat pad
  let stockpile = 0
  if (dPad < STOCKPILE_RADIUS) {
    const norm = 1 - (dPad / STOCKPILE_RADIUS) ** 2
    // Subtle natural asymmetrical ridge along the pile
    const ridgeNoise = 1 + 0.08 * Math.sin(x * 0.45) * Math.cos(z * 0.4)
    stockpile = stockpilePeakM * Math.pow(norm, 1.35) * ridgeNoise
  }

  return baseTerrain + stockpile
}

function elevationToColor(relY: number): THREE.Color {
  // Smooth hypsometric elevation ramp (valley teal -> olive green -> ochre -> rock slate)
  const t = Math.max(0, Math.min(1, (relY - 0.5) / 20.5))
  const color = new THREE.Color()
  if (t < 0.25) {
    color.setRGB(0.08 + t * 0.4, 0.45 + t * 0.8, 0.42 - t * 0.3)
  } else if (t < 0.55) {
    const k = (t - 0.25) / 0.3
    color.setRGB(0.18 + k * 0.48, 0.65 - k * 0.08, 0.34 - k * 0.14)
  } else if (t < 0.82) {
    const k = (t - 0.55) / 0.27
    color.setRGB(0.66 + k * 0.16, 0.57 - k * 0.12, 0.20 + k * 0.14)
  } else {
    const k = (t - 0.82) / 0.18
    color.setRGB(0.82 + k * 0.12, 0.45 + k * 0.42, 0.34 + k * 0.54)
  }
  return color
}

function buildContourVertices(
  elevMatrix: Float32Array,
  gridSize: number,
  equidistance: Equidistance,
  masterOnly: boolean
): number[] {
  const vertices: number[] = []
  const half = TERRAIN_SIZE / 2
  const step = TERRAIN_SIZE / gridSize
  const masterStep = equidistance >= 2 ? equidistance * 2 : 5

  let minZ = Infinity
  let maxZ = -Infinity
  for (let i = 0; i < elevMatrix.length; i++) {
    if (elevMatrix[i] < minZ) minZ = elevMatrix[i]
    if (elevMatrix[i] > maxZ) maxZ = elevMatrix[i]
  }

  const startLevel = Math.ceil(minZ / equidistance) * equidistance
  const levels: number[] = []
  for (let lvl = startLevel; lvl <= maxZ; lvl += equidistance) {
    const rounded = Math.round(lvl * 100) / 100
    const isMaster = Math.abs(rounded % masterStep) < 0.001 || Math.abs((rounded % masterStep) - masterStep) < 0.001
    if (masterOnly === isMaster) {
      levels.push(rounded)
    }
  }

  const interp = (
    x1: number,
    y1: number,
    z1: number,
    v1: number,
    x2: number,
    y2: number,
    z2: number,
    v2: number,
    level: number
  ): [number, number, number] => {
    const denom = v2 - v1
    const t = Math.abs(denom) < 1e-6 ? 0.5 : (level - v1) / denom
    return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t + 0.12, z1 + (z2 - z1) * t]
  }

  const stride = gridSize + 1
  for (let l = 0; l < levels.length; l++) {
    const level = levels[l]
    for (let r = 0; r < gridSize; r++) {
      const z0 = -half + r * step
      const z1 = z0 + step
      for (let c = 0; c < gridSize; c++) {
        const x0 = -half + c * step
        const x1 = x0 + step

        const v00 = elevMatrix[r * stride + c]
        const v10 = elevMatrix[r * stride + (c + 1)]
        const v11 = elevMatrix[(r + 1) * stride + (c + 1)]
        const v01 = elevMatrix[(r + 1) * stride + c]

        const crossings: [number, number, number][] = []
        if ((v00 < level) !== (v10 < level)) {
          crossings.push(interp(x0, v00, z0, v00, x1, v10, z0, v10, level))
        }
        if ((v10 < level) !== (v11 < level)) {
          crossings.push(interp(x1, v10, z0, v10, x1, v11, z1, v11, level))
        }
        if ((v11 < level) !== (v01 < level)) {
          crossings.push(interp(x1, v11, z1, v11, x0, v01, z1, v01, level))
        }
        if ((v01 < level) !== (v00 < level)) {
          crossings.push(interp(x0, v01, z1, v01, x0, v00, z0, v00, level))
        }

        if (crossings.length >= 2) {
          vertices.push(...crossings[0], ...crossings[1])
          if (crossings.length === 4) {
            vertices.push(...crossings[2], ...crossings[3])
          }
        }
      }
    }
  }

  return vertices
}

const PROFILE_PRESETS: { id: string; label: string; a: Point2D; b: Point2D }[] = [
  { id: 'ridge-pile', label: 'Cerro → Valle → Acopio', a: { x: -24, z: -20 }, b: { x: 24, z: 20 } },
  { id: 'pile-cross', label: 'Corte Transversal Acopio', a: { x: 2, z: 14 }, b: { x: 30, z: 14 } },
  { id: 'valley', label: 'Quebrada Longitudinal', a: { x: -30, z: -12 }, b: { x: 30, z: 7 } }
]

const GCP_COORDS: Point2D[] = [
  { x: -28, z: -26 },
  { x: 28, z: -26 },
  { x: -26, z: 24 },
  { x: 30, z: 26 }
]

export const Topography3DLab: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const terrainMeshRef = useRef<THREE.Mesh | null>(null)
  const dynamicOverlayRef = useRef<THREE.Group | null>(null)
  const droneRef = useRef<THREE.Group | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const worldGroupRef = useRef<THREE.Group | null>(null)

  const [equidistance, setEquidistance] = useState<Equidistance>(1)
  const [activeTool, setActiveTool] = useState<ActiveTool>('contours')
  const [stockpilePeakM, setStockpilePeakM] = useState<number>(6.8)
  const [showWireframe, setShowWireframe] = useState<boolean>(false)
  const [showGcpRtk, setShowGcpRtk] = useState<boolean>(true)
  const [pickingProfile, setPickingProfile] = useState<boolean>(false)
  const [pointA, setPointA] = useState<Point2D>(PROFILE_PRESETS[0].a)
  const [pointB, setPointB] = useState<Point2D>(PROFILE_PRESETS[0].b)
  const nextClickIsARef = useRef<boolean>(true)
  const pickingRef = useRef<boolean>(false)
  useEffect(() => {
    pickingRef.current = pickingProfile
  }, [pickingProfile])

  // Compute exact stockpile volume via fine 0.5m numerical surface integration
  const stockpileMetrics = useMemo(() => {
    const step = 0.5
    const cellArea = step * step
    let volumeM3 = 0
    let areaM2 = 0
    let maxHeightM = 0

    for (let x = STOCKPILE_CENTER.x - STOCKPILE_RADIUS; x <= STOCKPILE_CENTER.x + STOCKPILE_RADIUS; x += step) {
      for (let z = STOCKPILE_CENTER.z - STOCKPILE_RADIUS; z <= STOCKPILE_CENTER.z + STOCKPILE_RADIUS; z += step) {
        const elev = evaluateTerrain(x, z, stockpilePeakM)
        const diff = elev - PAD_BASE_RELATIVE
        if (diff > 0.05) {
          volumeM3 += diff * cellArea
          areaM2 += cellArea
          if (diff > maxHeightM) maxHeightM = diff
        }
      }
    }

    return {
      volumeM3,
      areaM2,
      maxHeightM,
      truckLoadsRef: Math.round(volumeM3 / 14)
    }
  }, [stockpilePeakM])

  // Compute Elevation Profile Samples between pointA and pointB
  const profileData = useMemo(() => {
    const samplesCount = 64
    const totalDist = Math.hypot(pointB.x - pointA.x, pointB.z - pointA.z)
    const points: { dist: number; elevAbs: number; relY: number }[] = []
    let minE = Infinity
    let maxE = -Infinity

    for (let i = 0; i <= samplesCount; i++) {
      const t = i / samplesCount
      const x = pointA.x + (pointB.x - pointA.x) * t
      const z = pointA.z + (pointB.z - pointA.z) * t
      const relY = evaluateTerrain(x, z, stockpilePeakM)
      const elevAbs = DATUM_OFFSET + relY
      if (elevAbs < minE) minE = elevAbs
      if (elevAbs > maxE) maxE = elevAbs
      points.push({ dist: totalDist * t, elevAbs, relY })
    }

    const deltaH = maxE - minE
    let maxSlopePct = 0
    for (let i = 1; i < points.length; i++) {
      const dDist = points[i].dist - points[i - 1].dist
      if (dDist > 0.01) {
        const slope = (Math.abs(points[i].elevAbs - points[i - 1].elevAbs) / dDist) * 100
        if (slope > maxSlopePct) maxSlopePct = slope
      }
    }

    return { points, totalDist, minE, maxE, deltaH, maxSlopePct }
  }, [pointA, pointB, stockpilePeakM])

  // 1. Setup Three.js Topography Scene
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 720
    const height = container.clientHeight || 470

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0b1120)
    scene.fog = new THREE.FogExp2(0x0b1120, 0.0045)

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 500)
    camera.position.set(56, 48, 68)
    camera.lookAt(0, 6, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xdbeafe, 1.35))
    const sun = new THREE.DirectionalLight(0xffffff, 2.2)
    sun.position.set(45, 78, 42)
    sun.castShadow = true
    sun.shadow.mapSize.width = 1024
    sun.shadow.mapSize.height = 1024
    scene.add(sun)

    const fill = new THREE.DirectionalLight(0x38bdf8, 0.85)
    fill.position.set(-50, 36, -40)
    scene.add(fill)

    const worldGroup = new THREE.Group()
    scene.add(worldGroup)
    worldGroupRef.current = worldGroup

    // Base plinth grid around terrain
    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(TERRAIN_SIZE + 2, 1.5, TERRAIN_SIZE + 2),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 })
    )
    plinth.position.y = -0.8
    worldGroup.add(plinth)

    // Terrain Mesh (vertices updated whenever stockpilePeakM changes)
    const terrainGeom = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, GRID_RES, GRID_RES)
    terrainGeom.rotateX(-Math.PI / 2)
    const colorAttr = new THREE.BufferAttribute(new Float32Array((GRID_RES + 1) * (GRID_RES + 1) * 3), 3)
    terrainGeom.setAttribute('color', colorAttr)

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.78,
      metalness: 0.08,
      flatShading: false
    })
    const terrainMesh = new THREE.Mesh(terrainGeom, terrainMat)
    terrainMesh.receiveShadow = true
    terrainMesh.castShadow = true
    worldGroup.add(terrainMesh)
    terrainMeshRef.current = terrainMesh

    // Dynamic overlay group (contours, GCPs, RTK base, profile transect, stockpile base plane)
    const overlayGroup = new THREE.Group()
    worldGroup.add(overlayGroup)
    dynamicOverlayRef.current = overlayGroup

    // Animated Mapping Drone flying survey grid above terrain
    const droneGroup = new THREE.Group()
    const droneBody = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.7, 2.6),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.3 })
    )
    droneGroup.add(droneBody)
    const rtkDome = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.75, 0.6, 16),
      new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.2 })
    )
    rtkDome.position.y = 0.65
    droneGroup.add(rtkDome)

    const scanCone = new THREE.Mesh(
      new THREE.ConeGeometry(4.5, 11, 20, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.14,
        side: THREE.DoubleSide
      })
    )
    scanCone.position.y = -5.8
    droneGroup.add(scanCone)

    worldGroup.add(droneGroup)
    droneRef.current = droneGroup

    // Orbit Drag + Raycaster Click for 2-Point Elevation Profile
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
      worldGroup.rotation.y += dx * 0.008
      worldGroup.rotation.x = Math.max(-0.35, Math.min(0.45, worldGroup.rotation.x + dy * 0.005))
      prevX = e.clientX
      prevY = e.clientY
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return
      isDragging = false
      if (renderer.domElement.hasPointerCapture(e.pointerId)) {
        renderer.domElement.releasePointerCapture(e.pointerId)
      }

      if (pickingRef.current && Math.hypot(e.clientX - downX, e.clientY - downY) < 6) {
        const rect = renderer.domElement.getBoundingClientRect()
        pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(pointerNdc, camera)
        const hits = raycaster.intersectObject(terrainMesh, false)
        if (hits.length > 0) {
          const localPt = worldGroup.worldToLocal(hits[0].point.clone())
          const picked = {
            x: Math.max(-36, Math.min(36, Number(localPt.x.toFixed(1)))),
            z: Math.max(-36, Math.min(36, Number(localPt.z.toFixed(1))))
          }
          if (nextClickIsARef.current) {
            setPointA(picked)
            nextClickIsARef.current = false
          } else {
            setPointB(picked)
            nextClickIsARef.current = true
          }
        }
      }
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerup', onPointerUp)
    renderer.domElement.addEventListener('pointercancel', onPointerUp)

    let animId = 0
    let t = 0
    const animate = () => {
      animId = requestAnimationFrame(animate)
      t += 0.015

      if (!isDragging && !pickingRef.current) {
        worldGroup.rotation.y += 0.0016
      }

      if (droneRef.current) {
        droneRef.current.position.set(
          Math.sin(t * 0.7) * 22,
          26 + Math.sin(t * 1.4) * 0.6,
          Math.cos(t * 0.45) * 22
        )
        droneRef.current.rotation.y = Math.atan2(Math.cos(t * 0.7) * 22, -Math.sin(t * 0.45) * 22)
      }

      renderer.render(scene, camera)
    }

    animate()

    const onResize = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth || 720
      const h = containerRef.current.clientHeight || 470
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
      renderer.dispose()
    }
  }, [])

  // 2. Rebuild Terrain Heights, Contour Lines, GCPs, Profile Ribbon & Volume Base Plane
  useEffect(() => {
    const terrainMesh = terrainMeshRef.current
    const overlay = dynamicOverlayRef.current
    if (!terrainMesh || !overlay) return

    // Update terrain wireframe toggle
    ;(terrainMesh.material as THREE.MeshStandardMaterial).wireframe = showWireframe

    // Update terrain vertex Y and colors + fill elevation matrix for Marching Squares
    const pos = terrainMesh.geometry.attributes.position as THREE.BufferAttribute
    const col = terrainMesh.geometry.attributes.color as THREE.BufferAttribute
    const stride = GRID_RES + 1
    const elevMatrix = new Float32Array(stride * stride)

    for (let r = 0; r < stride; r++) {
      for (let c = 0; c < stride; c++) {
        const idx = r * stride + c
        const vx = pos.getX(idx)
        const vz = pos.getZ(idx)
        const relY = evaluateTerrain(vx, vz, stockpilePeakM)
        elevMatrix[idx] = relY
        pos.setY(idx, relY)
        const color = elevationToColor(relY)
        col.setXYZ(idx, color.r, color.g, color.b)
      }
    }
    pos.needsUpdate = true
    col.needsUpdate = true
    terrainMesh.geometry.computeVertexNormals()

    // Clear previous dynamic overlay geometry safely
    while (overlay.children.length > 0) {
      const child = overlay.children[0]
      overlay.remove(child)
      disposeObject3D(child)
    }

    // A. Minor & Major Contour Lines (Curvas de Nivel)
    const minorVerts = buildContourVertices(elevMatrix, GRID_RES, equidistance, false)
    if (minorVerts.length > 0) {
      const minorGeom = new THREE.BufferGeometry()
      minorGeom.setAttribute('position', new THREE.Float32BufferAttribute(minorVerts, 3))
      overlay.add(
        new THREE.LineSegments(
          minorGeom,
          new THREE.LineBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.78 })
        )
      )
    }

    const majorVerts = buildContourVertices(elevMatrix, GRID_RES, equidistance, true)
    if (majorVerts.length > 0) {
      const majorGeom = new THREE.BufferGeometry()
      majorGeom.setAttribute('position', new THREE.Float32BufferAttribute(majorVerts, 3))
      overlay.add(
        new THREE.LineSegments(
          majorGeom,
          new THREE.LineBasicMaterial({ color: 0xfbbf24 })
        )
      )
    }

    // B. GCP Targets & GNSS RTK Base Station
    if (showGcpRtk) {
      const gcpBaseGeom = new THREE.BoxGeometry(2.6, 0.25, 2.6)
      const gcpQuadGeom = new THREE.BoxGeometry(1.25, 0.3, 1.25)
      const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
      const blackMat = new THREE.MeshBasicMaterial({ color: 0x020617 })

      GCP_COORDS.forEach((pt) => {
        const y = evaluateTerrain(pt.x, pt.z, stockpilePeakM)
        const gcpGroup = new THREE.Group()
        gcpGroup.position.set(pt.x, y + 0.18, pt.z)
        gcpGroup.add(new THREE.Mesh(gcpBaseGeom, whiteMat))

        const q1 = new THREE.Mesh(gcpQuadGeom, blackMat)
        q1.position.set(-0.62, 0.04, -0.62)
        gcpGroup.add(q1)

        const q2 = new THREE.Mesh(gcpQuadGeom, blackMat)
        q2.position.set(0.62, 0.04, 0.62)
        gcpGroup.add(q2)

        overlay.add(gcpGroup)
      })

      // GNSS RTK Base Station Tripod at (-6, 18)
      const bx = -6
      const bz = 18
      const by = evaluateTerrain(bx, bz, stockpilePeakM)
      const rtkGroup = new THREE.Group()
      rtkGroup.position.set(bx, by, bz)

      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.22, 4.2, 10),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 })
      )
      pole.position.y = 2.1
      rtkGroup.add(pole)

      const receiver = new THREE.Mesh(
        new THREE.CylinderGeometry(1.0, 1.0, 0.7, 18),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.25 })
      )
      receiver.position.y = 4.4
      rtkGroup.add(receiver)

      const rtkRing = new THREE.Mesh(
        new THREE.RingGeometry(1.6, 1.85, 24),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide })
      )
      rtkRing.rotation.x = -Math.PI / 2
      rtkRing.position.y = 4.6
      rtkGroup.add(rtkRing)

      overlay.add(rtkGroup)
    }

    // C. Profile Transect Ribbon + Pin Markers
    const segs = 40
    const linePts: THREE.Vector3[] = []
    for (let i = 0; i <= segs; i++) {
      const t = i / segs
      const px = pointA.x + (pointB.x - pointA.x) * t
      const pz = pointA.z + (pointB.z - pointA.z) * t
      const py = evaluateTerrain(px, pz, stockpilePeakM) + 0.35
      linePts.push(new THREE.Vector3(px, py, pz))
    }
    const profileLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(linePts),
      new THREE.LineBasicMaterial({ color: 0x10b981 })
    )
    overlay.add(profileLine)

    ;[pointA, pointB].forEach((pt, idx) => {
      const py = evaluateTerrain(pt.x, pt.z, stockpilePeakM)
      const pin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.45, 3.2, 12),
        new THREE.MeshBasicMaterial({ color: idx === 0 ? 0x10b981 : 0xf43f5e })
      )
      pin.position.set(pt.x, py + 1.6, pt.z)
      overlay.add(pin)
    })

    // D. Stockpile Reference Datum Ring / Plane
    const baseRing = new THREE.Mesh(
      new THREE.RingGeometry(STOCKPILE_RADIUS - 0.35, STOCKPILE_RADIUS + 0.15, 40),
      new THREE.MeshBasicMaterial({
        color: activeTool === 'volume' ? 0x34d399 : 0x38bdf8,
        side: THREE.DoubleSide
      })
    )
    baseRing.rotation.x = -Math.PI / 2
    baseRing.position.set(STOCKPILE_CENTER.x, PAD_BASE_RELATIVE + 0.15, STOCKPILE_CENTER.z)
    overlay.add(baseRing)

    if (activeTool === 'volume') {
      const datumDisc = new THREE.Mesh(
        new THREE.CircleGeometry(STOCKPILE_RADIUS, 36),
        new THREE.MeshBasicMaterial({
          color: 0x10b981,
          transparent: true,
          opacity: 0.28,
          side: THREE.DoubleSide
        })
      )
      datumDisc.rotation.x = -Math.PI / 2
      datumDisc.position.set(STOCKPILE_CENTER.x, PAD_BASE_RELATIVE + 0.08, STOCKPILE_CENTER.z)
      overlay.add(datumDisc)
    }
  }, [equidistance, stockpilePeakM, showWireframe, showGcpRtk, pointA, pointB, activeTool])

  // Build SVG Path for Elevation Profile
  const svgW = 460
  const svgH = 165
  const padL = 42
  const padR = 16
  const padT = 16
  const padB = 28
  const plotW = svgW - padL - padR
  const plotH = svgH - padT - padB

  const yMinChart = Math.floor(profileData.minE - 1)
  const yMaxChart = Math.ceil(profileData.maxE + 1)
  const ySpan = Math.max(2, yMaxChart - yMinChart)

  const profileCoords = profileData.points.map((pt, i) => {
    const x = padL + (i / (profileData.points.length - 1)) * plotW
    const y = padT + plotH - ((pt.elevAbs - yMinChart) / ySpan) * plotH
    return { x, y }
  })

  const linePath = profileCoords.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L${(padL + plotW).toFixed(1)},${(padT + plotH).toFixed(1)} L${padL},${(padT + plotH).toFixed(1)} Z`

  return (
    <div className="space-y-5">
      {/* Tool Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 rounded-2xl bg-slate-900/5 p-1.5 border border-slate-900/10">
          {(
            [
              { id: 'contours', label: 'Curvas de Nivel & MDE', icon: Layers },
              { id: 'profile', label: 'Perfil de Elevación', icon: Ruler },
              { id: 'volume', label: 'Cubicación de Acopio (m³)', icon: Box },
              { id: 'rtk', label: 'GNSS RTK & GCP', icon: Radio }
            ] as const
          ).map((tab) => {
            const Icon = tab.icon
            const active = activeTool === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTool(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  active ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:bg-white/80'
                }`}
              >
                <Icon className="size-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Equidistance Controls */}
        <div className="flex items-center gap-2 apple-glass rounded-2xl px-3.5 py-2">
          <span className="text-xs font-bold text-slate-600">Equidistancia:</span>
          {([0.5, 1, 2, 5] as Equidistance[]).map((eq) => (
            <button
              key={eq}
              onClick={() => setEquidistance(eq)}
              className={`rounded-xl px-2.5 py-1 font-mono text-xs font-bold transition-colors ${
                equidistance === eq
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900/5 text-slate-700 hover:bg-slate-900/10'
              }`}
            >
              {eq} m
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: 3D Terrain Viewport + Active Geomatics Tool */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left: Three.js 3D Terrain (7 cols) */}
        <div className="lg:col-span-7 apple-glass-dark rounded-3xl overflow-hidden relative flex flex-col justify-between min-h-[470px]">
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 p-4 pointer-events-none">
            <div className="pointer-events-auto flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowWireframe((w) => !w)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-xl transition-all ${
                  showWireframe
                    ? 'bg-sky-500 text-slate-950 border-sky-400'
                    : 'bg-slate-900/85 text-slate-200 border-white/15 hover:bg-white/10'
                }`}
              >
                {showWireframe ? 'Ver MDE Sólido' : 'Ver Malla Triangulada'}
              </button>
              <button
                onClick={() => setShowGcpRtk((v) => !v)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold border backdrop-blur-xl transition-all ${
                  showGcpRtk
                    ? 'bg-amber-500/25 text-amber-300 border-amber-400/50'
                    : 'bg-slate-900/85 text-slate-300 border-white/15'
                }`}
              >
                {showGcpRtk ? 'GCP + RTK Visibles' : 'Mostrar GCP + RTK'}
              </button>
            </div>

            {activeTool === 'profile' && (
              <button
                onClick={() => {
                  nextClickIsARef.current = true
                  setPickingProfile((p) => !p)
                }}
                className={`pointer-events-auto rounded-full px-3.5 py-1.5 text-xs font-bold border transition-all ${
                  pickingProfile
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 animate-pulse'
                    : 'bg-slate-900/85 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/20'
                }`}
              >
                {pickingProfile ? 'Haz clic en 2 puntos del 3D...' : 'Medir Perfil 2 Clics en 3D'}
              </button>
            )}
          </div>

          <div
            ref={containerRef}
            className={`absolute inset-0 w-full h-full touch-none ${
              pickingProfile ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
            }`}
          />

          <div className="relative z-20 p-4 mt-auto pointer-events-none">
            <div className="pointer-events-auto rounded-2xl bg-slate-900/90 border border-white/15 p-3 backdrop-blur-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-slate-200">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-amber-400" />
                  <span>Curvas Maestras</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-sky-300" />
                  <span>Secundarias ({equidistance} m)</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-emerald-400" />
                  <span>Línea de Perfil</span>
                </span>
              </div>
              <span className="font-mono text-slate-400">Área 80m × 80m · Datum 100m s.n.m.</span>
            </div>
          </div>
        </div>

        {/* Right: Tool Inspector Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* TOOL: CONTOURS & MDE */}
          {activeTool === 'contours' && (
            <div className="apple-glass rounded-3xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-blue-800">
                <Mountain className="size-5" />
                <h3 className="text-lg font-extrabold text-slate-900">
                  Relación entre MDE y Curvas de Nivel
                </h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                A partir de la nube de puntos fotogramétrica, se construye primero el{' '}
                <strong>Modelo Digital de Elevación (MDE)</strong>: una grilla continua donde cada celda guarda su cota Z exacta.
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                Luego, el algoritmo corta el MDE con planos horizontales separados por la{' '}
                <strong>equidistancia ({equidistance} m)</strong> para trazar las <strong>curvas de nivel</strong>: líneas que unen puntos de igual altitud.
              </p>
              <div className="rounded-2xl bg-white/85 border border-slate-200/75 p-4 space-y-2 text-sm">
                <strong className="text-slate-900 block">Cómo leer las curvas en el 3D:</strong>
                <p className="text-slate-700">• <strong>Curvas muy juntas</strong> = pendiente fuerte (ladera del cerro o borde del acopio).</p>
                <p className="text-slate-700">• <strong>Curvas separadas</strong> = terreno plano o valle abierto.</p>
                <p className="text-slate-700">• <strong>Menor equidistancia (0.5 m)</strong> = mayor detalle altimétrico para drenajes u obras.</p>
              </div>
            </div>
          )}

          {/* TOOL: ELEVATION PROFILE */}
          {activeTool === 'profile' && (
            <div className="apple-glass rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-slate-900">Perfil de Elevación</h3>
                <span className="font-mono text-xs font-bold text-emerald-700">
                  L = {profileData.totalDist.toFixed(1)} m · ΔH = {profileData.deltaH.toFixed(1)} m
                </span>
              </div>

              {/* Preset Transects */}
              <div className="flex flex-wrap gap-1.5">
                {PROFILE_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPickingProfile(false)
                      setPointA(p.a)
                      setPointB(p.b)
                    }}
                    className="rounded-full bg-slate-900/5 hover:bg-slate-900/10 px-3 py-1 text-xs font-semibold text-slate-800 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* SVG Profile Chart */}
              <div className="rounded-2xl bg-slate-950 p-3 border border-slate-800">
                <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto">
                  {/* Horizontal elevation grid lines */}
                  {[0, 0.5, 1].map((frac) => {
                    const y = padT + plotH * (1 - frac)
                    const elevVal = yMinChart + ySpan * frac
                    return (
                      <g key={frac}>
                        <line x1={padL} y1={y} x2={padL + plotW} y2={y} stroke="#1e293b" strokeWidth="1" />
                        <text x={padL - 6} y={y + 3} textAnchor="end" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                          {elevVal.toFixed(0)}m
                        </text>
                      </g>
                    )
                  })}

                  <path d={areaPath} fill="rgba(16, 185, 129, 0.25)" />
                  <path d={linePath} fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinejoin="round" />

                  <circle cx={profileCoords[0].x} cy={profileCoords[0].y} r="4.5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                  <circle
                    cx={profileCoords[profileCoords.length - 1].x}
                    cy={profileCoords[profileCoords.length - 1].y}
                    r="4.5"
                    fill="#f43f5e"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />

                  <text x={padL} y={svgH - 8} fill="#94a3b8" fontSize="10" fontFamily="monospace">
                    0 m (A)
                  </text>
                  <text x={padL + plotW} y={svgH - 8} textAnchor="end" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                    {profileData.totalDist.toFixed(1)} m (B)
                  </text>
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="rounded-2xl bg-white/85 border border-slate-200/75 p-2.5">
                  <span className="text-[11px] text-slate-500 block">Cota Mín</span>
                  <strong className="font-mono text-sm text-slate-900">{profileData.minE.toFixed(1)} m</strong>
                </div>
                <div className="rounded-2xl bg-white/85 border border-slate-200/75 p-2.5">
                  <span className="text-[11px] text-slate-500 block">Cota Máx</span>
                  <strong className="font-mono text-sm text-slate-900">{profileData.maxE.toFixed(1)} m</strong>
                </div>
                <div className="rounded-2xl bg-white/85 border border-slate-200/75 p-2.5">
                  <span className="text-[11px] text-slate-500 block">Pendiente Máx</span>
                  <strong className="font-mono text-sm text-emerald-700">{Math.round(profileData.maxSlopePct)}%</strong>
                </div>
              </div>
            </div>
          )}

          {/* TOOL: VOLUME CALCULATION */}
          {activeTool === 'volume' && (
            <div className="apple-glass rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Cubicación de Acopio (Volumen en m³)
                </h3>
                <span className="rounded-full bg-emerald-500/15 px-3 py-0.5 font-mono text-xs font-bold text-emerald-800">
                  Cota Base {DATUM_OFFSET + PAD_BASE_RELATIVE} m
                </span>
              </div>

              <div className="rounded-2xl bg-slate-900 text-white p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Volumen Calculado (Integración MDE)</span>
                  <strong className="font-mono text-3xl font-extrabold text-emerald-400">
                    {stockpileMetrics.volumeM3.toFixed(1)} m³
                  </strong>
                </div>
                <div className="text-right font-mono text-xs text-slate-300">
                  <div>Área: {Math.round(stockpileMetrics.areaM2)} m²</div>
                  <div>Altura máx: {stockpileMetrics.maxHeightM.toFixed(1)} m</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-sm font-semibold">
                  <label htmlFor="pile-height" className="text-slate-800">
                    Altura del Acopio Simulado
                  </label>
                  <span className="font-mono font-bold text-blue-700">{stockpilePeakM.toFixed(1)} m</span>
                </div>
                <input
                  id="pile-height"
                  type="range"
                  min={2.5}
                  max={10.5}
                  step={0.5}
                  value={stockpilePeakM}
                  onChange={(e) => setStockpilePeakM(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="rounded-2xl bg-white/85 border border-slate-200/75 p-3.5 text-sm text-slate-700 space-y-1.5">
                <div className="font-mono text-xs text-slate-900 font-bold">
                  V = Σ max(0, Z_MDE − Z_base) × Δx × Δz
                </div>
                <p>
                  Cada celda de la grilla (0.5 m × 0.5 m) aporta un prisma vertical entre el MDE y el plano base verde. Equivale aprox. a{' '}
                  <strong>{stockpileMetrics.truckLoadsRef} camiones tolva</strong> <em>(referencial 14 m³/camión)</em>.
                </p>
              </div>
            </div>
          )}

          {/* TOOL: GNSS RTK & GCP */}
          {activeTool === 'rtk' && (
            <div className="apple-glass rounded-3xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-blue-800">
                <Compass className="size-5" />
                <h3 className="text-lg font-extrabold text-slate-900">
                  GNSS RTK y Puntos de Control (GCP)
                </h3>
              </div>

              <div className="space-y-2.5 text-sm text-slate-700">
                <div className="rounded-2xl bg-white/85 border border-slate-200/75 p-3.5">
                  <strong className="text-slate-900 block">¿Por qué no basta el GPS común?</strong>
                  Un GPS estándar tiene error atmosférico de ±3 a 5 m. En topografía de ingeniería ese error arruinaría pendientes y cubicaciones.
                </div>
                <div className="rounded-2xl bg-blue-600/[0.07] border border-blue-600/20 p-3.5">
                  <strong className="text-blue-900 block">GNSS RTK (Cinemática en Tiempo Real):</strong>
                  Una antena base fija sobre un punto conocido envía correcciones de fase portadora al dron en vuelo, alcanzando precisión centimétrica (~1–3 cm referencial en condiciones óptimas RTK FIX).
                </div>
                <div className="rounded-2xl bg-white/85 border border-slate-200/75 p-3.5">
                  <strong className="text-slate-900 block">Puntos de Control Terrestre (GCP):</strong>
                  Dianas ajedrezadas blancas y negras medidas en tierra con rover GNSS para amarrar y validar la geometría exacta del modelo 3D.
                </div>
              </div>
            </div>
          )}

          {/* Compact Visual Reference Card (topografiaRtk / topografiaCurvas) */}
          <div className="apple-glass rounded-3xl p-3.5 grid grid-cols-2 gap-3">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950">
              <SafeMediaImage mediaKey="topografiaRtk" fallbackKey="photogrammetry3D" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
              <span className="absolute bottom-2 left-2.5 text-[11px] font-bold text-white">
                Base GNSS RTK + GCP
              </span>
            </div>
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950">
              <SafeMediaImage mediaKey="topografiaCurvas" fallbackKey="photogrammetry3D" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
              <span className="absolute bottom-2 left-2.5 text-[11px] font-bold text-white">
                MDE y Curvas de Nivel
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topography3DLab
