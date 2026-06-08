# CLAUDE.md

## Sobre este proyecto

- **Nombre:** mi-app-supabase
- **Para qué sirve:** Sistema de gestión de pacientes para consultorio/clínica — registro, alta, edición y búsqueda de pacientes con autenticación
- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Supabase (auth + DB) · Tailwind CSS v4 · Zod · Vitest

> ⚠️ **Next.js 16 tiene cambios importantes** respecto a versiones anteriores. Antes de tocar routing, data fetching o configuración, leer `node_modules/next/dist/docs/`. No asumir comportamiento de versiones anteriores.

---

## Sobre el desarrollador

- Soy **vibe coder**, no programador formal. Delego mucho.
- Comunicación **en español, simple y directo**.
- Si usás un término técnico, explicámelo la primera vez.
- Prefiero respuestas cortas con pasos claros antes que párrafos largos.
- **Ejecución directa** — no preguntes antes de cada paso si ya está claro qué hay que hacer.

---

## Comandos

- **Dev:** `npm run dev`
- **Build:** `npm run build`
- **Tests:** `npm run test`
- **Lint:** `npm run lint`

---

## Reglas de oro (NUNCA romper)

1. **Antes de modificar cualquier archivo, leélo entero primero.** No asumas qué hace.
2. **NUNCA borres código sin avisarme antes.** Si pensás que algo sobra, mostrámelo y preguntame.
3. **NUNCA instales paquetes sin preguntar.** Listame opciones, dejame elegir.
4. **NUNCA modifiques `package.json`, `next.config.*` o archivos de configuración raíz sin avisar primero.**
5. **Si algo funciona, no lo refactorices ni lo "mejores"** salvo que te lo pida explícitamente.
6. **Si yo te pido algo que rompe la arquitectura o estas reglas, frenáme y avisame.**
7. **Antes de cambios importantes, proponé un plan breve.** Explicar ventajas y desventajas si hay alternativas.

> **Antes de cualquier fix, investigá primero** (grep + leer el archivo completo).

---

## Arquitectura del proyecto

```
/src
  /app              → Rutas Next.js (App Router). Solo UI y llamadas a actions/lib.
    /dashboard      → Páginas protegidas (requieren sesión)
    /auth           → Server Actions de autenticación
  /components       → Componentes React reutilizables. Solo presentación, sin lógica de negocio.
  /lib              → Utilidades y clientes de Supabase (browser y server)
  /types            → Tipos e interfaces TypeScript compartidos
  /__tests__        → Tests Vitest
```

**Regla clave:** Los componentes y páginas NO acceden a Supabase directamente.
Todo pasa por **Server Actions** (`actions.ts`) o funciones de `/lib`.

**Server vs Client components:**
- Por defecto todo es Server Component — no agregues `"use client"` sin necesidad real
- `"use client"` solo si el componente necesita estado (`useState`), efectos (`useEffect`) o eventos de browser
- Las Server Actions (`"use server"`) manejan mutaciones de datos y van en archivos `actions.ts`

**Validación:** Toda entrada del usuario se valida con **Zod** antes de llegar a Supabase.

**Tamaño de archivos:** Si un archivo supera ~300-400 líneas, evaluar dividirlo.

---

## Supabase — cosas importantes

- **Cliente browser** (`supabase-browser.ts`): para componentes client-side
- **Cliente server** (`supabase-server.ts`): para Server Components y Server Actions (usa cookies)
- **NUNCA** expongas la `service_role` key en el cliente
- **NUNCA** concatenes strings para queries — usá los métodos del cliente Supabase (`.eq()`, `.match()`, etc.)
- Row Level Security (RLS): asumir que está activo; no deshabilitar sin avisar

---

## Seguridad

- **Inputs del usuario → validar con Zod siempre**, antes de cualquier operación
- No confiar en datos que llegan desde el cliente en Server Actions
- Variables de entorno sensibles: solo en `.env.local`, nunca en el código
- `.env.local` está en `.gitignore` — nunca commitear secrets

---

## Estilo de código

- **TypeScript estricto** — no usar `any` sin justificación
- **Componentes:** PascalCase (`PacienteForm.tsx`)
- **Funciones/variables:** camelCase
- **Archivos de utilidad/lib:** kebab-case (`supabase-server.ts`)
- **Tailwind** para estilos — no agregar CSS custom salvo que Tailwind no alcance
- **Comentarios** solo cuando el "por qué" no es obvio. No comentar el "qué".
- No duplicar lógica: si una regla o función se repite en dos lugares, extraerla

---

## Dependencias

- No agregar librerías sin explicar qué problema resuelven y por qué no alcanza lo nativo
- Preferir las capacidades del framework cuando sean suficientes
- Minimizar dependencias externas

---

## Testing (Vitest)

- Tests en `src/__tests__/`
- Probar lógica de validación (Zod schemas) y funciones utilitarias
- Para Server Actions: testear la lógica, mockear el cliente Supabase
- Correr `npm run test` antes de declarar algo como listo

---

## Cómo debuggear

Antes de cualquier fix, **buscá con grep todos los lugares que tocan el campo/función con problema**:

- **Un componente muestra data incorrecta** → buscá quién llama la Server Action y qué retorna
- **Error de autenticación** → revisá `middleware.ts` y el cliente server de Supabase
- **Tipo TypeScript incorrecto** → revisá `/types` y el tipo retornado por Supabase
- **NUNCA escribir un fix sin haber leído el código que produce el problema.**

---

## Cómo explicar los cambios

1. **Qué se hizo** (lista corta)
2. **Cómo probarlo** (pasos: "abrí X, hacé Y, deberías ver Z")
3. **Si algo puede romperse, dónde mirar primero**

---

## Checklist antes de decir "listo"

- [ ] ¿Compila sin errores? (`npm run build`)
- [ ] ¿Los tests pasan? (`npm run test`)
- [ ] ¿La feature funciona en el browser?
- [ ] ¿Hay validación Zod en los inputs?
- [ ] ¿Las variables de entorno sensibles no están hardcodeadas?
- [ ] ¿Se usó el cliente Supabase correcto (browser vs server)?
