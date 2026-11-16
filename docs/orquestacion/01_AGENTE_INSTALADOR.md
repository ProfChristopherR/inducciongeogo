# 01 · Agente Instalador (Fase 0)

## Misión

Instalar 4 repositorios de skills dentro de `.agents/skills/` y documentar con precisión qué aporta cada uno, para que los demás agentes sepan cómo usarlos. **No tocas código de la web.**

## Repositorios

| # | Repositorio | Carpeta destino |
|---|---|---|
| 1 | https://github.com/google/elephant-goldfish-model | `.agents/skills/elephant-goldfish-model/` |
| 2 | https://github.com/emilkowalski/skills | `.agents/skills/emil-skills/` |
| 3 | https://github.com/pbakaus/impeccable | `.agents/skills/impeccable/` |
| 4 | https://github.com/leonxlnx/taste-skill | `.agents/skills/taste-skill/` |

## Pasos

1. Clona cada repositorio con `git clone --depth 1 <url> <carpeta destino>`. Requiere salir del sandbox; ejecuta **solo** el `git clone` fuera.
2. Borra la carpeta `.git` interna de cada clon, para que no queden repos anidados.
3. Lee el `README.md` y cualquier `SKILL.md` o `skills/*/SKILL.md` de cada uno.
4. Si un repo trae varias skills en subcarpetas (posible en `emilkowalski/skills`), conserva la estructura y lista cada skill.
5. Si un repo pide un paso de instalación propio (npm, script, copiar a otra ruta), síguelo y anota qué hiciste.
6. **`elephant-goldfish-model`:** determina con honestidad qué es. Si no es una skill para diseño o desarrollo web (por ejemplo, si es un modelo de investigación), **no lo fuerces**: deja el clon, márcalo "No aplica a la web" y explica por qué en una línea.
7. Confirma que `.agents/` sigue en `.gitignore` (ya lo está).

## Entregable: `docs/orquestacion/SKILLS_INSTALADAS.md`

Para cada repo:

```md
## <nombre>
- Ruta: .agents/skills/<carpeta>/
- Qué es (1–2 líneas):
- Archivos clave a leer: (rutas exactas de SKILL.md / guías)
- Cuándo usarla en este proyecto: (concreto: "al animar la portada", "auditoría final de tipografía", etc.)
- Agentes que deben usarla: 02 / 03 / 04 / 06
- ¿Aplica a la web?: Sí / No (motivo)
```

## Terminado cuando

- Los 4 repos están en `.agents/skills/` sin `.git` interno.
- Existe `SKILLS_INSTALADAS.md` completo.
- `ESTADO.md`: fila 01 en ✅ y resumen escrito.

Si un clon falla (repo privado, URL inexistente), marca ⛔, anota el error exacto en "Pedidos" y continúa con los demás.

