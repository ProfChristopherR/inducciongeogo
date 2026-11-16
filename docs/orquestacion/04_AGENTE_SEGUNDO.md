# 04 · Agente Inducción 2° Medio (Fase 2)

## Misión

Construir la inducción de **2° Medio**, dedicada **solo a drones y Geomática** (lo que se ve en 3° y 4° Medio), **a fondo**, con simuladores interactivos de alta calidad, más una estación final para decidir si siguen la senda en 3° y 4° Medio.

Es el bloque más grande del proyecto. Lee `SKILLS_INSTALADAS.md` y aplica **taste-skill**, **impeccable** y **emil-skills**. El piso de calidad 3D es `CircuitLab3D.tsx` y `Parametric3DLab.tsx`: nada más simple que eso.

## Archivos de tu propiedad

Solo `src/tracks/segundo/**` (incluye `DroneFleetHangar`, `DgacBriefing` y `TelemetryHud`, que el Arquitecto movió a `segundo/components/`; puedes mejorarlos). Las imágenes las crea el agente 05 con las claves listadas en su brief. Mientras no existan, usa respaldos de `MEDIA_CATALOG` (`grade3Drones`, `grade4Geomatica`, `thermalSensorSar`, `ndviAgriculture`, `photogrammetry3D`, `droneExplodedView`).

Datos de la flota: `src/data/curriculumData.ts` (`FLEET_DRONES`). Es de solo lectura para ti; si hay un dato malo, va a "Pedidos".

## Flota real disponible

FPV Indoor, FPV Outdoor, DJI NEO, DJI Mini 4K, DJI Phantom 4, DJI Mavic 3M (multiespectral), DJI Mavic 3T (térmico).

## Clase 1 · Ingeniería y operación de drones (3° Medio) — 90 min

| # | Estación | Min | Contenido e interacción |
|---|---|---|---|
| 0 | Ruta Geomática: 3° y 4° Medio | 00–10 | Bento de 2 años. **3°:** ingeniería RPAS, pilotaje, normativa. **4°:** sensores térmicos, NDVI, fotogrametría y **topografía**. Imagen y "meta práctica" por año. |
| 1 | Anatomía 3D del dron | 10–25 | **Three.js**: cuadricóptero con brazos de carbono, 4 motores brushless con campana y bobinas, hélices (2 CW y 2 CCW girando en el sentido correcto), stack de controladora + ESC, GPS en mástil y LiPo con correa. Slider de **vista explotada** y clic en cada pieza para ver su función. Bandeja 3 (`PassAroundCard`). |
| 2 | Física del vuelo | 25–40 | Simulador: sliders de peso y empuje por motor → el dron sube, flota o baja. Botones de **alabeo, cabeceo y guiñada** que muestran qué motores aceleran (resaltados) y el giro resultante. Fórmula visible: empuje total vs peso. |
| 3 | Hangar de la flota | 40–55 | Mejora `DroneFleetHangar`: los 7 drones con foto, rol, fichas técnicas y qué año se usa cada uno. Tarjeta de demo segura en sala con **DJI NEO / FPV Indoor**. |
| 4 | Control de mando (Modo 2) | 55–68 | Radio control dibujado en SVG/3D con 2 sticks arrastrables (throttle/yaw a la izquierda, pitch/roll a la derecha) que mueven en vivo un dron 3D pequeño. Ejercicio guiado: "despega, gira 90°, avanza, aterriza". |
| 5 | Normativa DGAC y clima en Chillán | 68–80 | Mejora `DgacBriefing`. Cita la normativa vigente (DAN 151 / DAN 91) **solo con datos verificables**; si no puedes verificar una cifra, márcala "referencial" y anótala en Pedidos. Clima: viento, lluvia y temperatura como factores de decisión de vuelo (simulador "¿vuelo o no vuelo?"). |
| 6 | Checklist pre-vuelo y cierre | 80–90 | Checklist interactivo (batería, hélices, GPS, zona, clima, permisos). Al completarlo: "Listo para volar ✓" + resumen de la clase. |

## Clase 2 · Sensores, misiones y topografía (4° Medio) — 90 min

| # | Estación | Min | Contenido e interacción |
|---|---|---|---|
| 0 | De piloto a analista | 00–08 | Hero: el dron como herramienta de datos. 4 tarjetas de misión: rescate, agricultura, mapeo 3D y topografía. |
| 1 | Mavic 3T: térmico y rescate | 08–20 | Comparador deslizable **RGB ↔ térmico** sobre la misma escena. Paletas (Ironbow, White-hot) y explicación de qué detecta el infrarrojo. |
| 2 | Mavic 3M: NDVI y agricultura | 20–32 | Simulador de parcela por zonas: el alumno ajusta la reflectancia del rojo y del infrarrojo cercano, y se calcula NDVI = (NIR − Rojo) / (NIR + Rojo) por zona, con el mapa coloreado en vivo. |
| 3 | Phantom 4: fotogrametría | 32–45 | Planificador de vuelo en grilla: sliders de altura y traslape → se recalculan en vivo el **GSD (cm/píxel)**, el número de fotos y el tiempo de vuelo, con las líneas de vuelo dibujadas sobre el terreno. Resultado: modelo 3D / nube de puntos. |
| 4 | **Topografía con drones** | 45–60 | **Three.js**: terreno 3D con relieve y **curvas de nivel** que se regeneran al cambiar la equidistancia. Puntos de control (GCP) y **GNSS RTK** explicados. Herramientas: perfil de elevación entre 2 puntos y **cálculo de volumen** de un acopio (montículo). Muestra la relación entre MDE y curvas de nivel. |
| 5 | Planificación de misión y telemetría | 60–72 | Mejora `TelemetryHud`: el alumno elige una misión (rescate, NDVI, topografía) → la app propone dron, sensor, altura y patrón de vuelo, y luego se reproduce la misión con HUD de telemetría. |
| 6 | Trivia de Geomática | 72–82 | Trivia propia (crea `segundo/components/GeomaticaTrivia.tsx`; puedes basarte en el estilo de `TacticalTrivia`, pero el archivo es tuyo). 8–10 preguntas de esta inducción. |
| 7 | **¿Sigues la senda en 3° y 4° Medio?** | 82–90 | Cierre: línea de tiempo 3° → 4° → egreso, campos laborales (agricultura, minería, construcción, emergencias, topografía), proyectos posibles, link al portal premilitar y confeti sobrio. |

## Calidad exigida

- Cada simulación debe responder en vivo y mostrar números correctos (GSD, NDVI y volumen calculados con fórmulas reales).
- Los modelos 3D se limpian en el `cleanup` del `useEffect` (dispose de geometrías, materiales y renderer).
- Rendimiento: 60 fps en un PC de sala común. Usa `InstancedMesh` para objetos repetidos y limita el `pixelRatio` a 2.
- Si una estación 3D crece mucho, cárgala con `React.lazy`.

## Terminado cuando

- `segundoTrack` tiene Clase 1 (7 estaciones) y Clase 2 (8 estaciones), todas funcionales, sin stubs.
- `npm.cmd run build` termina con 0 errores.
- `ESTADO.md` actualizado, con la lista de datos marcados "referencial".

