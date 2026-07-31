# Módulo: Autenticación (signup / login / logout)

> Ficha técnica para el agente. **Leer antes de tocar login, signup, logout, o cualquier ruta
> "protegida".**

## Para qué sirve

Registro e inicio de sesión con email/password vía Supabase Auth, y protección de las rutas
`/dashboard/*` para que solo usuarios logueados entren.

## Archivos

| Archivo | Contenido |
|---|---|
| `src/app/auth/actions.ts` | Server Actions `signup`, `login`, `logout`. Todo el trabajo real vive acá. |
| `src/proxy.ts` | Se ejecuta en (casi) cada request. **Next.js 16 renombró `middleware.ts` a `proxy.ts`** — no busques `middleware.ts`, no existe. |
| `src/app/dashboard/layout.tsx` | Acá está la **protección real** de `/dashboard/*` (ver invariante abajo). |
| `src/app/login/page.tsx` / `src/app/signup/page.tsx` | Formularios, muestran error via query param `?error=`. |
| `src/app/page.tsx` | Ruta raíz `/`: redirige a `/dashboard` si hay sesión, a `/login` si no. |
| `src/components/AuthCard.tsx` | Contenedor visual de login/signup (título, error, footer). |
| `src/components/AuthInput.tsx` | Input controlado simple para email/password (sin validación propia, solo `required`/`minLength` de HTML). |

## Mapa rápido (acción → dónde)

| Quiero tocar… | Archivo → función |
|---|---|
| Registrar usuario nuevo | `auth/actions.ts` → `signup` |
| Iniciar sesión | `auth/actions.ts` → `login` |
| Cerrar sesión | `auth/actions.ts` → `logout` (la llama `Sidebar.tsx` en un `<form action={logoutAction}>`) |
| Proteger una ruta nueva (ej. `/dashboard/turnos` cuando exista) | Poné el mismo check de `dashboard/layout.tsx` en su propio `layout.tsx`, **no** en `proxy.ts` (ver invariante) |
| Mensaje de error en el form | `login`/`signup` hacen `redirect('/login?error=' + msg)`; la page lee `searchParams.error` y se lo pasa a `AuthCard` |

## 🚨 Invariante crítica: `proxy.ts` NO protege rutas

`src/proxy.ts` (el "middleware" de Next 16) **solo refresca la cookie de sesión** llamando
`supabase.auth.getUser()` — no redirige, no bloquea nada. Es el patrón estándar de
`@supabase/ssr`, pero es fácil asumir lo contrario (que ahí se corta el acceso a rutas privadas).

La protección real de `/dashboard/*` está en `src/app/dashboard/layout.tsx`:
```ts
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/login')
```
Esto corre en TODAS las páginas bajo `/dashboard` porque `layout.tsx` envuelve a sus hijas. Si el
día de mañana agregás una ruta protegida que **no** cuelga de `/dashboard` (ej. algo en la raíz),
necesita su propio chequeo — copiando este mismo patrón, no tocando `proxy.ts`.

## Trampas conocidas

- El `matcher` de `proxy.ts` corre en casi todas las rutas (excluye `_next/static`, imágenes,
  favicon). Si algo deja de refrescar la sesión (usuario deslogueado "solo" random después de un
  rato), mirá acá primero.
- **No hay validación de password en el servidor** más allá de lo que Supabase Auth exige por
  default. El `minLength={6}` de signup es solo del lado del browser (atributo HTML), no hay Zod
  ni chequeo en `auth/actions.ts`.
- `AuthCard`/`AuthInput` son genéricos y sin lógica — si necesitás validación visual (ej. "email
  inválido" en vivo), hay que agregarla, hoy no existe.

## Con qué se conecta

- **Pacientes**: `dashboard/layout.tsx` es el gate que protege `dashboard/pacientes/*` (ver
  `docs/pacientes.md`).
- **Infraestructura**: usa el cliente Supabase server (`src/lib/supabase-server.ts`, ver
  `docs/infraestructura.md`) en todos lados — nunca el cliente browser, porque necesita leer/escribir
  cookies de sesión.
