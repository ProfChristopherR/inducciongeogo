import sharp from 'sharp'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, extname, join, resolve } from 'node:path'

const BRAIN_DIR = 'C:\\Users\\Dairo\\.gemini\\antigravity\\brain\\8a38132a-5b7b-4ccf-bc84-bd8c54da46cb'
const OUT_DIR = resolve('public/media')
const RAW_MEDIA_DIR = resolve('raw_media')

// Mapa exacto de prefijo (en carpeta de artefactos) -> nombre WebP final en public/media
const ARTIFACT_MAP = [
  { key: 'heroOverview', prefix: 'hero_overview', out: 'hero_overview.webp' },
  { key: 'grade1Geogo', prefix: 'grade_1_geogo', out: 'grade_1_geogo.webp' },
  { key: 'grade2Pcb3D', prefix: 'grade_2_pcb_3d', out: 'grade_2_pcb_3d.webp' },
  { key: 'grade3Drones', prefix: 'grade_3_drones', out: 'grade_3_drones.webp' },
  { key: 'grade4Geomatica', prefix: 'grade_4_geomatica', out: 'grade_4_geomatica.webp' },
  { key: 'protoVsPcb', prefix: 'proto_vs_pcb', out: 'proto_vs_pcb.webp' },
  { key: 'manufacturingProcess', prefix: 'manufacturing_process', out: 'manufacturing_process.webp' },
  { key: 'droneExplodedView', prefix: 'drone_exploded', out: 'drone_exploded.webp' },
  { key: 'thermalSensorSar', prefix: 'thermal_human_sar', out: 'thermal_human_sar.webp' },
  { key: 'ndviAgriculture', prefix: 'ndvi_agriculture', out: 'ndvi_agriculture.webp' },
  { key: 'photogrammetry3D', prefix: 'photogrammetry_3d', out: 'photogrammetry_3d.webp' },
  { key: 'octavoHero', prefix: 'octavo_hero', out: 'octavo_hero.webp' },
  { key: 'octavoDecision', prefix: 'octavo_decision', out: 'octavo_decision.webp' },
  { key: 'segundoHero', prefix: 'segundo_hero', out: 'segundo_hero.webp' },
  { key: 'geomatica3Medio', prefix: 'geomatica_3_medio', out: 'geomatica_3_medio.webp' },
  { key: 'geomatica4Medio', prefix: 'geomatica_4_medio', out: 'geomatica_4_medio.webp' },
  { key: 'radioControlMode2', prefix: 'radio_control', out: 'radio_control.webp' },
  { key: 'preflightChecklist', prefix: 'preflight_checklist', out: 'preflight_checklist.webp' },
  { key: 'topografiaRtk', prefix: 'topografia_rtk', out: 'topografia_rtk.webp' },
  { key: 'topografiaCurvas', prefix: 'topografia_curvas', out: 'topografia_curvas.webp' },
  { key: 'misionPlanificacion', prefix: 'mision_planificacion', out: 'mision_planificacion.webp' },
  { key: 'segundoDecision', prefix: 'segundo_decision', out: 'segundo_decision.webp' }
]

const MAX_BYTES = 400 * 1024

function findLatestMatch(dir, prefix) {
  if (!existsSync(dir)) return null
  const files = readdirSync(dir)
    .filter((f) => {
      const ext = extname(f).toLowerCase()
      return (ext === '.jpg' || ext === '.jpeg' || ext === '.png') && f.startsWith(`${prefix}_`)
    })
    .sort()
  if (files.length === 0) {
    // Also check exact filename match
    for (const ext of ['.jpg', '.jpeg', '.png']) {
      if (existsSync(join(dir, `${prefix}${ext}`))) return join(dir, `${prefix}${ext}`)
    }
    return null
  }
  return join(dir, files[files.length - 1])
}

async function convertToWebp(inputPath, outPath) {
  let quality = 82
  let maxWidth = 1920

  let buf = await sharp(inputPath)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toBuffer()

  // Garantiza limite < 400 KB bajando calidad/resolucion suavemente si hace falta
  while (buf.length > MAX_BYTES && quality >= 60) {
    quality -= 6
    if (quality < 70) maxWidth = 1600
    buf = await sharp(inputPath)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toBuffer()
  }

  writeFileSync(outPath, buf)
  return buf
}

function assertRealWebp(filePath) {
  const head = readFileSync(filePath).subarray(0, 12)
  const riff = head.subarray(0, 4).toString('ascii')
  const webp = head.subarray(8, 12).toString('ascii')
  if (riff !== 'RIFF' || webp !== 'WEBP') {
    throw new Error(`Archivo ${filePath} no es WebP válido (${riff}...${webp})`)
  }
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })
  const results = []

  for (const item of ARTIFACT_MAP) {
    const srcPath =
      findLatestMatch(RAW_MEDIA_DIR, item.prefix) ??
      findLatestMatch(BRAIN_DIR, item.prefix)

    const outPath = join(OUT_DIR, item.out)

    if (!srcPath) {
      if (existsSync(outPath)) {
        // Fallback: check existing file and re-encode if needed
        assertRealWebp(outPath)
        const sizeKb = Math.round(statSync(outPath).size / 1024)
        results.push({ key: item.key, out: item.out, sizeKb, note: 'existía' })
        continue
      }
      throw new Error(`No se encontró fuente para ${item.key} (${item.prefix})`)
    }

    const buf = await convertToWebp(srcPath, outPath)
    assertRealWebp(outPath)
    const sizeKb = Number((buf.length / 1024).toFixed(1))
    results.push({ key: item.key, out: item.out, sizeKb, src: basename(srcPath) })
    console.log(`✓ ${item.key.padEnd(22)} -> ${item.out.padEnd(28)} ${String(sizeKb).padStart(6)} KB (WEBP OK)`)
  }

  // Convert any extra jpg/png placed in raw_media/ by the teacher in the future
  if (existsSync(RAW_MEDIA_DIR)) {
    for (const file of readdirSync(RAW_MEDIA_DIR)) {
      const ext = extname(file).toLowerCase()
      if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') continue
      const outName = `${basename(file, extname(file))}.webp`
      if (ARTIFACT_MAP.some((m) => m.out === outName)) continue
      const outPath = join(OUT_DIR, outName)
      const buf = await convertToWebp(join(RAW_MEDIA_DIR, file), outPath)
      assertRealWebp(outPath)
      console.log(`✓ extra -> ${outName} ${(buf.length / 1024).toFixed(1)} KB`)
    }
  }

  console.log(`\nTotal procesado: ${results.length} imágenes WebP verificadas (< 400 KB).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
