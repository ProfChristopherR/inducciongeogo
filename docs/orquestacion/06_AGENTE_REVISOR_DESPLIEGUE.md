# 06 · Agente Revisor y Despliegue (Fase 3)

## Misión

Revisar todo con ojo de diseñador exigente y de profesor en sala, corregir lo que encuentres y publicar en GitHub Pages. Eres el **único** agente que hace commit y push.

Lee `SKILLS_INSTALADAS.md`. Tu herramienta principal de auditoría es **impeccable**, complementada con **taste-skill**.

## Paso 1 · Verificación técnica

- `npm.cmd run build` termina con 0 errores.
- `npm.cmd run lint`: corrige los errores reales (las advertencias de estilo menores se pueden dejar, anotadas).
- Busca imports a archivos inexistentes, claves de `MEDIA_CATALOG` mal escritas e imágenes que no existan en `public/media/`.

## Paso 2 · Revisión visual estación por estación

Recorre **las 4 clases completas** (8°-C1, 8°-C2, 2°-C1, 2°-C2) más la portada, en dos resoluciones:

- **1366 × 768** (proyector típico de sala).
- **1920 × 1080**.

Para tomar capturas, usa el subagente de navegador o `node .agents/skills/anatomy/scripts/drive.mjs <url> '[["shot","out.png"]]'`, con el servidor de desarrollo levantado en el mismo comando. Chrome headless puede requerir salir del sandbox.

Checklist por estación:

- [ ] Nada se corta ni se superpone (header, dock inferior, tarjetas).
- [ ] El texto se lee a 4 metros (tamaño, contraste, largo de línea).
- [ ] Las imágenes cargan y no se ven pixeladas ni deformadas.
- [ ] Las escenas 3D cargan, responden y no dejan la pestaña lenta.
- [ ] La navegación ← / → funciona, el dock marca bien la estación y el reloj corresponde a la clase.
- [ ] Al volver a la portada y cambiar de inducción, el estado se reinicia correctamente.
- [ ] Los enlaces con `?t=...&c=...&s=...` abren la estación correcta.
- [ ] Coherencia visual entre las dos inducciones (mismo sistema, distinto color de acento).

Anota cada hallazgo en `docs/orquestacion/REVISION.md` (estación · problema · corrección · captura). Corrige lo visual y lo menor tú mismo. Si es un cambio grande de contenido, anótalo en Pedidos para el Jefe.

## Paso 3 · Despliegue

1. Cambia el remoto: `git remote set-url origin https://github.com/ProfChristopherR/inducciongeogo.git`.
2. Confirma que `vite.config.ts` tenga `base: '/inducciongeogo/'`.
3. Revisa `.github/workflows/deploy.yml` (ya tiene `enablement: true` y Node 22).
4. Actualiza `README.md`: dos inducciones, nueva URL y cómo reemplazar imágenes.
5. `git add -A` y luego `git status`: revisa que **no** entren `node_modules/`, `dist/` ni `.agents/`.
6. Commit: `feat: plataforma con inducciones 8° Básico y 2° Medio`.
7. `git push origin main` (fuera del sandbox).
8. Verifica que el workflow de Actions termine en verde y que `https://profchristopherr.github.io/inducciongeogo/` cargue la portada y las imágenes.

## Terminado cuando

- `REVISION.md` completo, sin hallazgos críticos abiertos.
- La web publicada funciona en la URL de Pages.
- `ESTADO.md` actualizado con el enlace final.

