# Plataforma Interactiva de Inducción: Geogo & Geomática
### Liceo Bicentenario Polivalente San Nicolás

Experiencia web pedagógica estilo Apple Glassmorphism diseñada para guiar dos recorridos completos de inducción (**8° Básico** y **2° Medio**, de 2 clases de 90 minutos cada uno), reemplazando presentaciones estáticas por laboratorios 3D y simuladores en tiempo real.

---

## 🌐 Acceso en Vivo (GitHub Pages)

**[https://profchristopherr.github.io/inducciongeogo/](https://profchristopherr.github.io/inducciongeogo/)**

Enlaces directos por URL (`query string` compatible con recarga):
- Inducción 8° Básico: `?t=octavo&c=class-1&s=0`
- Inducción 2° Medio: `?t=segundo&c=class-1&s=0`

---

## 🧭 Dos Inducciones en una Plataforma

### 1. Inducción 8° Básico (`¿Te sumas a Geogo en 1° Medio?`)
- **Clase 1 · Electrónica, Diseño 3D y Manufactura (90 min):**
  - Ruta Formativa completa de 1° a 4° Medio (incluye Topografía con drones en 4° Medio).
  - Simulador 3D realista de **Ley de Ohm** con resistencias axiales de 4 bandas, serie/paralelo, potenciómetro, transistor y cortocircuito.
  - Comparativa en vivo **Protoboard vs. Placa PCB** con simulador de vibración + Bandeja 1.
  - Modelado **CAD Paramétrico en Autodesk Fusion** (brazo estructural 3D con cotas editables en sala).
  - Manufactura Digital (**Impresión 3D FDM** vs. **Corte Láser**) + Bandeja 2 y cierre de Clase 1.
- **Clase 2 · IA, Programación y Primer Vistazo a Drones (90 min):**
  - El cerebro digital (C++, Python e IA como copiloto) e Ingeniería de Prompts para Arduino.
  - Demo en vivo: **Radar Ultrasónico HC-SR04** con simulación sonora.
  - **Un vistazo a los drones:** hotspots interactivos, tira de los 7 drones del liceo y demo segura en sala (DJI NEO / FPV Indoor).
  - **Trivia de 8° Básico** y estación final de decisión **"¿Te vienes a Geogo en 1° Medio?"**.

### 2. Inducción 2° Medio (`¿Sigues la senda de Geomática en 3° y 4° Medio?`)
Enfocada íntegramente en **Ingeniería RPAS, Vuelo y Geomática (3° y 4° Medio)** con la flota real (*FPV Indoor, FPV Outdoor 5", DJI NEO, DJI Mini 4K, DJI Phantom 4 Pro/RTK, DJI Mavic 3T y DJI Mavic 3M*):
- **Clase 1 · Ingeniería y Operación RPAS (3° Medio — 90 min):**
  - Ruta Geomática 3° → 4° Medio.
  - **Anatomía 3D del Dron (Three.js)** con vista explotada, motores brushless de bobinas de cobre, hélices 2 CW / 2 CCW y Bandeja 3.
  - **Física del Vuelo:** simulador de empuje vs peso + alabeo, cabeceo y guiñada.
  - **Hangar de la Flota** (7 drones) y demo segura indoor.
  - **Control de Mando Modo 2:** 2 sticks interactivos 1:1 conectados a una arena 3D en vivo.
  - **Normativa DGAC (DAN 91 / DAN 151)**, reporte **METAR Chillán (SCCH)**, simulador *"¿Vuelo o No Vuelo?"* y **Checklist Pre-Vuelo**.
- **Clase 2 · Sensores, Misiones y Topografía (4° Medio — 90 min):**
  - **Mavic 3T (Térmico):** cortina deslizable RGB ↔ Infrarrojo y paletas LWIR para Búsqueda y Rescate (SAR).
  - **Mavic 3M (Multiespectral):** simulador zonal de reflectancia Rojo/NIR y cálculo en vivo del índice **NDVI**.
  - **Phantom 4 Pro (Fotogrametría):** planificador de grilla aérea con cálculo real de **GSD (cm/px)**, traslape y tiempo de vuelo.
  - **Topografía con Drones (Three.js):** terreno 3D con curvas de nivel regeneradas por equidistancia (0.5 / 1 / 2 / 5 m), estación base **GNSS RTK**, **Puntos de Control (GCP)**, perfil de elevación y **cubicación de volumen de acopio ($m^3$)**.
  - **Telemetría OSD por Misión**, **Trivia de Geomática** y estación final **"¿Sigues la senda en 3° y 4° Medio?"**.

---

## 🖼️ Cómo Reemplazar Imágenes por Fotos Reales del Liceo

Todas las imágenes del proyecto están en formato **WebP optimizado** (< 400 KB) dentro de `public/media/` y catalogadas en [`src/data/media.ts`](src/data/media.ts) con la indicación exacta (`realPhotoSlot`) de qué foto tomar:

- **Opción rápida:** Guarda tu foto real en `public/media/<nombre>.webp` conservando el mismo nombre de archivo.
- **Opción automática desde JPG/PNG:** Coloca tus `.jpg` o `.png` en una carpeta `raw_media/` con el prefijo correspondiente (ej. `raw_media/octavo_hero.jpg`) y ejecuta:
  ```bash
  npm run media
  ```
  El script usa `sharp` para redimensionar y comprimir automáticamente todas las imágenes a WebP reales (< 400 KB).

---

## 💻 Ejecución Local

```bash
npm install
npm run dev      # Servidor local en http://localhost:5173/inducciongeogo/
npm run build    # Compila para producción (dist/)
npm run lint     # Verificación oxlint
```
