# 02 · Agente Arquitecto (Fase 1)

## Misión

Dejar lista la **estructura de dos inducciones** (portada, store, header, navegación, carpetas y registro), moviendo los archivos actuales a su lugar sin cambiar su contenido pedagógico. Así, en la Fase 2, el Agente 8° y el Agente 2° trabajan en paralelo **sin tocar los mismos archivos**.

Antes de empezar, lee `docs/orquestacion/SKILLS_INSTALADAS.md` y usa **emil-skills** para las transiciones de la portada.

## Archivos de tu propiedad

`src/App.tsx`, `src/main.tsx`, `src/index.css`, `src/store/usePlatformStore.ts`, `src/tracks/types.ts`, `src/tracks/registry.ts`, `src/components/shared/**`, `src/components/home/**`, `vite.config.ts`, `index.html`.

## Tareas

### 1. Nueva estructura de carpetas (mover con `git mv` para conservar historial; sin commit)

```
src/
  tracks/
    types.ts                  ← contrato (ver 00_JEFE)
    registry.ts               ← TRACKS = { octavo, segundo }
    octavo/
      index.ts                ← octavoTrack (stub inicial que funciona)
      class1/                 ← mover aquí src/components/class1/*
      class2/                 ← mover aquí PromptEngineeringLab, AiRadarLab, TacticalTrivia
    segundo/
      index.ts                ← segundoTrack (stub con estaciones "En construcción")
      components/             ← mover aquí DroneFleetHangar, DgacBriefing, TelemetryHud
  components/
    shared/                   ← mover aquí layout/* (Header, StationNavigator, PassAroundCard, PremilitarModal)
    home/
      TrackPicker.tsx         ← portada nueva
```

- `Class1SequentialView.tsx` y `Class2SequentialView.tsx` hoy son un gran `if (stationIndex === n)`. **Divídelos** en un componente por estación, por ejemplo `octavo/class1/stations/RutaFormativa.tsx`, y regístralos en `octavoTrack`. El contenido no cambia; solo se reorganiza.
- Todas las estaciones actuales de la Clase 2, **incluidas** las de drones (Anatomía, Hangar, DGAC, Sensores), se registran **provisionalmente** en `octavoTrack`, para que la app siga completa. El Agente 8° las reemplaza después por un resumen; el Agente 2° crea las versiones a fondo.
- Revisa con búsqueda de texto si `BreadboardVsPcb.tsx`, `ManufacturingCompare.tsx` y `OhmLawSimulator.tsx` se importan en algún lado. Si no se usan, bórralos y anótalo.
- Borra `src/assets/react.svg`, `src/assets/vite.svg` y `src/assets/hero.png` si nadie los importa.

### 2. Store (`usePlatformStore.ts`)

- Agrega `activeTrack: TrackId | null` (`null` = portada).
- Acciones: `setTrack(id | null)`, `setActiveClass(id)`, `goToStation`, `nextStation`, `prevStation`.
- Los límites salen de `TRACKS[activeTrack].classes[i].stations.length`. Elimina el `5 : 7` fijo.
- Guarda `activeTrack`, `activeClass` y `stationIndex` en la URL (`?t=octavo&c=class-1&s=3`), para que el profesor pueda recargar sin perder el lugar y compartir enlaces directos. Usa query string, no rutas: es compatible con GitHub Pages sin 404.
- Al cambiar de clase, el reloj se reinicia a `durationMin`.

### 3. Portada `TrackPicker.tsx`

- Dos tarjetas grandes de vidrio, lado a lado en pantalla ancha y apiladas en móvil:
  - **8° Básico**: "¿Te sumas a Geogo en 1° Medio?". Imagen `MEDIA_CATALOG[octavoTrack.heroMediaKey]`.
  - **2° Medio**: "¿Sigues la senda de Geomática en 3° y 4° Medio?". Imagen `MEDIA_CATALOG[segundoTrack.heroMediaKey]`.
- Logo y nombre del Liceo Bicentenario San Nicolás arriba, y link al portal `premilitar.liceosannicolas.cl` (modal existente).
- Entrada animada con stagger, hover con elevación suave y transición hacia la inducción elegida (patrones de emil-skills).
- Si una clave de imagen aún no existe (Fase 2 la crea), usa una imagen existente como respaldo. **Nunca** un `<img>` roto.

### 4. Header y dock

- Header: botón "← Inducciones" (vuelve a la portada), nombre de la inducción activa con su color, selector de Clase 1 / Clase 2 de esa inducción, reloj y portal premilitar.
- Colores sugeridos: 8° = esmeralda/azul; 2° = índigo/cielo.
- `StationNavigator`: recibe estaciones del registro; sin cambios visuales grandes.
- En la portada no se muestran ni el header de estaciones ni el dock.

### 5. Configuración de despliegue

- `vite.config.ts`: `base: '/inducciongeogo/'`.
- `index.html`: el favicon apunta a un archivo que exista (hoy apunta a `hero_ladder.svg`; usa `favicon.svg`).
- **No** cambies el remoto de git (lo hace el agente 06).

## Terminado cuando

- La portada muestra las 2 inducciones; 8° tiene sus 2 clases con **todas** las estaciones actuales funcionando; 2° tiene 2 clases con estaciones stub "En construcción" (con la lista de títulos de `04_AGENTE_SEGUNDO.md`).
- `npm.cmd run build` termina con 0 errores.
- `ESTADO.md` actualizado con el mapa de archivos movidos.

