# 05 · Agente Imágenes (Fase 2)

## Misión

1. Generar las imágenes nuevas que necesitan las dos inducciones.
2. Convertirlas a **WebP real**. Corregir además las 11 actuales, que hoy son **JPEG renombrados a `.webp`**.
3. Registrarlas en `src/data/media.ts` con su indicación de "foto real", para que el profesor pueda reemplazarlas después.

## Archivos de tu propiedad

`public/media/**`, `src/data/media.ts`, `scripts/convert-to-webp.mjs` (puedes reescribirlo).

## Paso 1 · Conversión WebP real

- Instala `sharp` como devDependency (`npm.cmd install -D sharp`, fuera del sandbox).
- Reescribe `scripts/convert-to-webp.mjs` para que use `sharp`, calidad 82, ancho máximo 1920 px, y procese todos los `.jpg` / `.png` de origen.
- Reconvierte las 11 imágenes actuales de `public/media/*.webp` (las fuentes JPEG originales están en `C:\Users\Dairo\.gemini\antigravity\brain\8a38132a-5b7b-4ccf-bc84-bd8c54da46cb\*.jpg`).
- Verifica que el resultado sea WebP real: los bytes 8–11 del archivo son `WEBP`.
- Borra de `public/media/` los `.svg` viejos y `hero_overview.jpg` si ya ningún archivo de `src/` los referencia (busca antes).
- Agrega a `package.json` el script `"media": "node scripts/convert-to-webp.mjs"`.

## Paso 2 · Imágenes nuevas (16:9, estilo fotografía de estudio / keynote Apple, sin texto incrustado)

| Clave en `MEDIA_CATALOG` | Archivo | Descripción para generar |
|---|---|---|
| `octavoHero` | `octavo_hero.webp` | Alumnos de 13–14 años en un taller tecnológico luminoso, armando un circuito con Arduino y mirando una pieza impresa en 3D. Ambiente inspirador, luz natural. |
| `octavoDecision` | `octavo_decision.webp` | Camino o puerta luminosa que conecta una mesa de electrónica con un taller de fabricación digital; simboliza dar el paso a 1° Medio. |
| `segundoHero` | `segundo_hero.webp` | Estudiantes de enseñanza media en un campo abierto del sur de Chile operando un dron DJI Mavic 3 Enterprise con control remoto, al atardecer. |
| `geomatica3Medio` | `geomatica_3_medio.webp` | Práctica de vuelo: dron FPV y DJI Mini sobre una cancha, con conos de entrenamiento y un estudiante con radio control. |
| `geomatica4Medio` | `geomatica_4_medio.webp` | Estación de análisis: pantallas con mapa térmico, NDVI, nube de puntos y curvas de nivel, con un dron industrial sobre la mesa. |
| `radioControlMode2` | `radio_control.webp` | Primer plano de un radio control de dron con dos sticks, sostenido por manos de estudiante, fondo desenfocado. |
| `preflightChecklist` | `preflight_checklist.webp` | Dron sobre una plataforma de aterrizaje naranja con baterías, hélices de repuesto y una tablet con checklist. |
| `topografiaRtk` | `topografia_rtk.webp` | Topografía en terreno: antena base GNSS RTK sobre trípode, un punto de control (GCP) en el suelo y un dron Phantom 4 volando sobre el terreno. |
| `topografiaCurvas` | `topografia_curvas.webp` | Visualización 3D de un modelo digital de elevación con curvas de nivel superpuestas y un acopio de material, estilo técnico limpio. |
| `misionPlanificacion` | `mision_planificacion.webp` | Tablet con software de planificación de vuelo mostrando una grilla sobre un mapa satelital agrícola. |
| `segundoDecision` | `segundo_decision.webp` | Un dron elevándose sobre un valle chileno al amanecer; simboliza seguir el camino en 3° y 4° Medio. |

Para cada imagen: genérala, guárdala como fuente, conviértela con `npm.cmd run media` y regístrala en `media.ts` con `id`, `title`, `description`, `src: media('<archivo>')` y `realPhotoSlot` (qué foto real debería ir ahí).

## Reglas

- Mantén la función `media()` que usa `import.meta.env.BASE_URL`: es necesaria en GitHub Pages.
- **No** cambies las claves existentes del catálogo; otros componentes las usan.
- Ninguna imagen pesa más de 400 KB.
- Al final, agrega a `ESTADO.md` la tabla `clave → archivo → peso KB`.

## Terminado cuando

- Las 11 imágenes antiguas y las 11 nuevas son WebP reales en `public/media/`.
- `media.ts` tiene las 22 claves.
- `npm.cmd run build` termina con 0 errores.

