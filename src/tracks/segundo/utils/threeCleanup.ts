import * as THREE from 'three'

function disposeMaterial(mat: THREE.Material) {
  const matRecord = mat as unknown as Record<string, unknown>
  for (const value of Object.values(matRecord)) {
    if (value && typeof value === 'object' && 'isTexture' in value) {
      ;(value as THREE.Texture).dispose()
    }
  }
  mat.dispose()
}

/**
 * Recursively disposes geometries and materials inside a Three.js Object3D subtree.
 */
export function disposeObject3D(root: THREE.Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (mesh.geometry) {
      mesh.geometry.dispose()
    }
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(disposeMaterial)
      } else {
        disposeMaterial(mesh.material)
      }
    }
  })
}
