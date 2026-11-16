# Skills instaladas (Fase 0)

Verificado `.gitignore`: `.agents/` sigue excluido del repositorio Git. Todas las carpetas `.git` internas fueron eliminadas para evitar repositorios anidados.

---

## elephant-goldfish-model
- **Ruta:** `.agents/skills/elephant-goldfish-model/`
- **Qué es:** Plugin de código abierto de Google ("Design with an elephant. Review with a goldfish") para explorar ideas de diseño de software, redactar especificaciones técnicas y revisar documentos o planes contra el código mediante revisores aislados sin contexto previo.
- **Archivos clave a leer:**
  - `.agents/skills/elephant-goldfish-model/README.md`
  - `.agents/skills/elephant-goldfish-model/skills/egm-brainstorm/SKILL.md`
  - `.agents/skills/elephant-goldfish-model/skills/egm-draft/SKILL.md`
  - `.agents/skills/elephant-goldfish-model/skills/egm-review/SKILL.md`
  - `.agents/skills/elephant-goldfish-model/skills/egm-drift-report/SKILL.md`
  - `.agents/skills/elephant-goldfish-model/skills/egm-resolve/SKILL.md`
  - `.agents/skills/elephant-goldfish-model/skills/egm-review-loop/SKILL.md`
  - `.agents/skills/elephant-goldfish-model/skills/egm-bootstrap/SKILL.md`
- **Cuándo usarla en este proyecto:** No es necesaria en la construcción de la interfaz ni del contenido web, porque la arquitectura y los briefs ya fueron definidos y cerrados en `docs/orquestacion/`. Podría usarse de forma opcional solo si se quisiera auditar deriva entre documentación y código (`egm-drift-report`).
- **Agentes que deben usarla:** Ninguno requerido para desarrollo web (opcional solo para revisión documental).
- **¿Aplica a la web?:** No — Es un flujo de redacción y revisión de especificaciones de ingeniería de software, no una skill de diseño visual, animaciones o desarrollo frontend.

---

## emil-skills (`emilkowalski/skills`)
- **Ruta:** `.agents/skills/emil-skills/`
- **Qué es:** Colección de 20 skills creadas por Emil Kowalski (Vercel/Linear/Sonner/Vaul) orientadas a ingeniería de diseño UI, animaciones fluidas estilo Apple WWDC, físicas de resorte (springs), coreografía de entradas y rendimiento en navegador.
- **Sub-skills disponibles en `.agents/skills/emil-skills/skills/`:**
  - `apple-design` (interfaces fluidas estilo Apple, springs `bounce: 0` / `damping: 1.0`, interrumpibilidad, respuesta en `pointer-down`)
  - `emil-design-eng` (filosofía de detalle, curvas `cubic-bezier(0.23, 1, 0.32, 1)`, tabla de revisión Before/After, regla de no animar atajos de teclado repetitivos)
  - `animate`, `choreograph`, `improve-animations`, `review-animations`, `find-animation-opportunities`, `remove-animations`, `animation-performance`, `animation-vocabulary`, `gestures`, `pick-ui-library`, `prototype`, `mobile-native`, `break-ui`, `learn-taste`, `ask-emil`, `ask-sonner`, `animate-expo`, `write-swift`.
- **Archivos clave a leer:**
  - `.agents/skills/emil-skills/skills/apple-design/SKILL.md`
  - `.agents/skills/emil-skills/skills/emil-design-eng/SKILL.md`
  - `.agents/skills/emil-skills/skills/choreograph/SKILL.md`
  - `.agents/skills/emil-skills/skills/animation-performance/SKILL.md`
  - `.agents/skills/emil-skills/skills/break-ui/SKILL.md`
- **Cuándo usarla en este proyecto:**
  - Al construir y animar la portada (`TrackPicker.tsx`), el cambio de inducción y el paso entre estaciones (`App.tsx`, `StationNavigator.tsx`).
  - Al diseñar interacciones en simuladores (`hover`, `:active`, arrastre 1:1 en sticks de radio control y comparadores deslizables, manteniendo `ease-out` rápido y cero animaciones molestas en teclado `←` / `→` repetido si se vuelve pesado).
- **Agentes que deben usarla:** `02`, `03`, `04`, `06`.
- **¿Aplica a la web?:** Sí — Aporta reglas concretas de Framer Motion, CSS easings, respuesta inmediata y rendimiento 60fps.

---

## impeccable (`pbakaus/impeccable`)
- **Ruta:** `.agents/skills/impeccable/`
- **Qué es:** Sistema completo de criterio visual, diseño y auditoría de interfaces (`craft-floor`, `critique`, `audit`, `polish`, `typeset`, `layout`, `harden`, `clarify`, `optimize`), orientado a evitar patrones genéricos de IA y elevar contraste, tipografía, espaciado y accesibilidad.
- **Archivos clave a leer:**
  - `.agents/skills/impeccable/.agents/skills/impeccable/SKILL.md`
  - `.agents/skills/impeccable/.agents/skills/impeccable/reference/craft-floor.md`
  - `.agents/skills/impeccable/.agents/skills/impeccable/reference/polish.md`
  - `.agents/skills/impeccable/.agents/skills/impeccable/reference/critique.md`
  - `.agents/skills/impeccable/.agents/skills/impeccable/reference/audit.md`
  - `.agents/skills/impeccable/.agents/skills/impeccable/reference/typeset.md`
  - `.agents/skills/impeccable/.agents/skills/impeccable/reference/layout.md`
  - `.agents/skills/impeccable/.agents/skills/impeccable/reference/harden.md`
- **Cuándo usarla en este proyecto:**
  - Antes de editar componentes nuevos (leer `craft-floor.md`) para respetar contraste, jerarquía tipográfica para proyector y evitar ruido visual o tarjetas innecesariamente anidadas.
  - En la revisión final del Agente 06 (`critique`, `audit`, `polish`) recorriendo portada y todas las estaciones en 1366×768 y 1920×1080.
- **Agentes que deben usarla:** `02`, `03`, `04`, `06` (principal para el `06`).
- **¿Aplica a la web?:** Sí — Es el estándar principal de revisión visual, accesibilidad, jerarquía tipográfica y pulido final.

---

## taste-skill (`leonxlnx/taste-skill`)
- **Ruta:** `.agents/skills/taste-skill/` (skill principal en `.agents/skills/taste-skill/skills/taste-skill/`)
- **Qué es:** Skill frontend anti-slop (`tasteskill 2.5.1`) con reglas estrictas de composición editorial, proporciones de pantalla, uso real de fotografías e iconos, microinteracciones discretas, copia directa y contraste en navegador real.
- **Archivos clave a leer:**
  - `.agents/skills/taste-skill/skills/taste-skill/SKILL.md`
  - `.agents/skills/taste-skill/skills/taste-skill/references/layout-v4.md`
  - `.agents/skills/taste-skill/skills/taste-skill/references/cards.md`
  - `.agents/skills/taste-skill/skills/taste-skill/references/motion.md`
  - `.agents/skills/taste-skill/skills/taste-skill/references/copy.md`
- **Cuándo usarla en este proyecto:**
  - Para garantizar que cada estación quepa limpia por pantalla (sin encabezados cortados o texto inflado), que las imágenes dominen sin subtítulos redundantes debajo, con bordes laterales alineados, microinteracciones de tarjetas (`hover` sutil + escala de imagen) y alto contraste para lectura en proyector.
- **Agentes que deben usarla:** `02`, `03`, `04`, `06`.
- **¿Aplica a la web?:** Sí — Define reglas concretas de layout, tarjetas, fotografía y copy limpio sin relleno.

