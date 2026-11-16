# 03 · Agente Inducción 8° Básico (Fase 2)

## Misión

Dejar la inducción de 8° Básico completa: todo el contenido actual adaptado a alumnos de 8°, los drones **solo como resumen motivador**, y una estación final donde decidan entrar a **Geogo en 1° Medio**.

Lee `SKILLS_INSTALADAS.md` y aplica **taste-skill** e **impeccable** en las estaciones que toques.

## Archivos de tu propiedad

Solo `src/tracks/octavo/**`. Para cambiar algo de `media.ts` o de `shared/`, usa "Pedidos" en `ESTADO.md`. Si necesitas una imagen nueva, usa las claves `octavoHero` y `octavoDecision` que crea el agente 05. Si aún no existen, usa una imagen existente de respaldo.

## Estructura final

### Clase 1 · Electrónica, diseño 3D y fabricación (90 min) — se mantiene

| # | Estación | Min | Cambios |
|---|---|---|---|
| 0 | Ruta formativa 1° a 4° Medio | 00–20 | En la tarjeta de **4° Medio**, agrega **Topografía con drones** (GNSS RTK, curvas de nivel, modelos de elevación) junto a térmico, NDVI y fotogrametría. Corrige el error `MEDIA_CATALOG.grade2Pcb3d?.realPhotoSlot` (clave mal escrita). |
| 1 | Laboratorio 3D Ley de Ohm | 20–45 | Sin cambios de contenido. Revisa que el texto se lea bien en proyector. |
| 2 | Protoboard vs PCB + Bandeja 1 | 45–58 | Igual. |
| 3 | Diseño CAD paramétrico | 58–73 | Igual. |
| 4 | Manufactura 3D y láser + Bandeja 2 | 73–84 | Igual. |
| 5 | Síntesis y cierre Clase 1 | 84–90 | El botón final lleva a la Clase 2 **de 8°**. |

### Clase 2 · Programación, IA y un vistazo a los drones (90 min)

| # | Estación | Min | Origen |
|---|---|---|---|
| 0 | El cerebro digital (C++, Python e IA) | 00–10 | Existente |
| 1 | Cómo pedirle código a la IA (prompts) | 10–28 | Existente (`PromptEngineeringLab`) |
| 2 | Radar ultrasónico en vivo | 28–50 | Existente (`AiRadarLab`) |
| 3 | **Un vistazo a los drones** | 50–65 | **Nueva**, ver abajo |
| 4 | Trivia final | 65–78 | `TacticalTrivia` con preguntas **solo** de lo visto en 8° (electrónica, 3D, IA y lo básico de drones). Quita las preguntas de DGAC y sensores a fondo. |
| 5 | **¿Te vienes a Geogo en 1° Medio?** | 78–90 | **Nueva**, ver abajo |

**Se quitan de 8°** (pasan a 2° Medio): las estaciones de Anatomía a fondo, Hangar completo, Normativa DGAC y Sensores (térmico, NDVI, 3D). No las borres del disco: `DroneFleetHangar`, `DgacBriefing` y `TelemetryHud` ya viven en `segundo/components` y son del agente 04. Solo las desregistras de `octavoTrack`.

### Estación nueva: "Un vistazo a los drones"

Objetivo: entusiasmar, no enseñar normativa. Muy visual, poco texto.

- Bloque principal: imagen grande `grade3Drones` / `drone_exploded` con 4 "hotspots" clicables (hélices, motores, controladora, batería), cada uno con 1 frase.
- Tira con los 7 drones del liceo (nombre + foto pequeña + 1 línea), sin fichas técnicas.
- Tarjeta "Demo en sala": vuelo corto del **DJI NEO** o del **FPV Indoor**, con hélices protegidas.
- Cierre: "Todo esto lo aprenderás a fondo en 3° y 4° Medio, si sigues en la especialidad."

### Estación nueva: "¿Te vienes a Geogo en 1° Medio?"

- Resumen visual de lo que harán en **1° Medio** (electrónica, Arduino, CAD) y **2° Medio** (PCB, impresión 3D, láser), con una línea de tiempo animada.
- 3 razones concretas para elegir Geogo (proyectos reales, laboratorio, drones al final del camino).
- Botón al portal `premilitar.liceosannicolas.cl` y bloque "¿Dudas? Habla con el profesor".
- Confeti sobrio al final. Debe sentirse como la conclusión de la experiencia.

## Lenguaje para 8°

Frases cortas, tuteo y ejemplos cotidianos. Los términos técnicos se mantienen, pero se explican la primera vez (ej.: "resistencia: la pieza que frena la corriente").

## Terminado cuando

- `octavoTrack` tiene Clase 1 (6 estaciones) y Clase 2 (6 estaciones) funcionando.
- `npm.cmd run build` termina con 0 errores.
- `ESTADO.md` actualizado.

