import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { disposeObject3D } from '../utils/threeCleanup'

export interface DroneFlightState {
  x: number
  y: number
  z: number
  yawDeg: number
  pitchDeg: number
  rollDeg: number
  throttlePct: number
}

interface Props {
  flightStateRef: React.MutableRefObject<DroneFlightState>
}

export const MiniFlightArena3D: React.FC<Props> = ({ flightStateRef }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 520
    const height = container.clientHeight || 360

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0b1120)
    scene.fog = new THREE.FogExp2(0x0b1120, 0.018)

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.2, 200)
    camera.position.set(0, 11.5, 16.5)
    camera.lookAt(0, 1.5, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xdbeafe, 1.3))
    const sun = new THREE.DirectionalLight(0xffffff, 2.0)
    sun.position.set(12, 24, 14)
    sun.castShadow = true
    scene.add(sun)

    const rim = new THREE.DirectionalLight(0x38bdf8, 0.9)
    rim.position.set(-14, 10, -12)
    scene.add(rim)

    // Ground & Grid
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(48, 48),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85, metalness: 0.1 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    const grid = new THREE.GridHelper(32, 16, 0x334155, 0x1e293b)
    grid.position.y = 0.02
    scene.add(grid)

    // Helipad Ring at Origin
    const padRing = new THREE.Mesh(
      new THREE.RingGeometry(1.5, 1.75, 36),
      new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide })
    )
    padRing.rotation.x = -Math.PI / 2
    padRing.position.y = 0.04
    scene.add(padRing)

    const padDisc = new THREE.Mesh(
      new THREE.CircleGeometry(1.45, 36),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 })
    )
    padDisc.rotation.x = -Math.PI / 2
    padDisc.position.y = 0.03
    scene.add(padDisc)

    // Soft Shadow Marker directly below drone
    const shadowMarker = new THREE.Mesh(
      new THREE.CircleGeometry(0.95, 24),
      new THREE.MeshBasicMaterial({ color: 0x020617, transparent: true, opacity: 0.55 })
    )
    shadowMarker.rotation.x = -Math.PI / 2
    shadowMarker.position.y = 0.05
    scene.add(shadowMarker)

    // 3D Mini Quadcopter Group
    const droneGroup = new THREE.Group()
    scene.add(droneGroup)

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.28, metalness: 0.35 })
    const carbonMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.4 })
    const accentMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.25, metalness: 0.6 })

    const hull = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.32, 1.45), bodyMat)
    hull.castShadow = true
    droneGroup.add(hull)

    const canopy = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.2, 0.85), accentMat)
    canopy.position.set(0, 0.24, -0.08)
    droneGroup.add(canopy)

    // Forward nose LED strip (-Z is drone forward!)
    const noseLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.1, 0.12),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    )
    noseLed.position.set(0, 0.05, -0.74)
    droneGroup.add(noseLed)

    // Rear amber status LED (+Z)
    const rearLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.1, 0.1),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b })
    )
    rearLed.position.set(0, 0.05, 0.74)
    droneGroup.add(rearLed)

    const rotors: { mesh: THREE.Mesh; cw: boolean }[] = []
    const armOffsets: [number, number, boolean][] = [
      [1.05, -0.95, false],
      [1.05, 0.95, true],
      [-1.05, 0.95, false],
      [-1.05, -0.95, true]
    ]

    armOffsets.forEach(([ax, az, cw]) => {
      const armCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(ax * 0.25, 0, az * 0.25),
        new THREE.Vector3(ax, 0.06, az)
      ])
      const arm = new THREE.Mesh(
        new THREE.TubeGeometry(armCurve, 4, 0.09, 8, false),
        carbonMat
      )
      droneGroup.add(arm)

      const motor = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.22, 14),
        accentMat
      )
      motor.position.set(ax, 0.16, az)
      droneGroup.add(motor)

      const rotor = new THREE.Mesh(
        new THREE.BoxGeometry(1.25, 0.03, 0.14),
        new THREE.MeshStandardMaterial({
          color: cw ? 0x38bdf8 : 0xf59e0b,
          roughness: 0.3
        })
      )
      rotor.position.set(ax, 0.3, az)
      droneGroup.add(rotor)
      rotors.push({ mesh: rotor, cw })
    })

    let animId = 0
    const animate = () => {
      animId = requestAnimationFrame(animate)
      const st = flightStateRef.current

      droneGroup.position.set(st.x, st.y + 0.28, st.z)
      droneGroup.rotation.order = 'YXZ'
      droneGroup.rotation.y = -(st.yawDeg * Math.PI) / 180
      droneGroup.rotation.x = -(st.pitchDeg * Math.PI) / 180
      droneGroup.rotation.z = -(st.rollDeg * Math.PI) / 180

      shadowMarker.position.set(st.x, 0.05, st.z)
      const shadowScale = Math.max(0.45, 1.0 - st.y * 0.05)
      shadowMarker.scale.set(shadowScale, shadowScale, 1)

      const spinSpeed = 0.04 + (st.throttlePct / 100) * 0.42
      if (st.throttlePct > 2 || st.y > 0.05) {
        rotors.forEach((r) => {
          r.mesh.rotation.y += r.cw ? -spinSpeed : spinSpeed
        })
      }

      // Camera gently tracks drone position
      const camTargetX = st.x * 0.35
      const camTargetZ = st.z * 0.35 + 14.5
      camera.position.x += (camTargetX - camera.position.x) * 0.08
      camera.position.z += (camTargetZ - camera.position.z) * 0.08
      camera.lookAt(st.x * 0.6, Math.max(1.2, st.y * 0.6 + 0.8), st.z * 0.6)

      renderer.render(scene, camera)
    }

    animate()

    const onResize = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth || 520
      const h = containerRef.current.clientHeight || 360
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      disposeObject3D(scene)
      renderer.dispose()
    }
  }, [flightStateRef])

  return <div ref={containerRef} className="w-full h-full min-h-[340px]" />
}

export default MiniFlightArena3D
