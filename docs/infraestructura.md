# Módulo: Infraestructura (Supabase, utils, navegación)

> Ficha técnica para el agente. **Leer antes de tocar los clientes Supabase, variables de entorno,
> o el menú lateral.**

## Para qué sirve

Piezas transversales que usan tanto Auth como Pacientes: los dos clientes de Supabase (browser y
server), utilidades chicas, y el layout/navegación del dashboard.

## Archivos

| Archivo | Contenido |
|---|---|
| `src/lib/supabase-browser.ts` | Cliente Supabase para componentes `'use client'`. Lee `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`. |
| `src/lib/supabase-server.ts` | Cliente Supabase para Server Components / Server Actions. Usa `cookies()` de Next — por eso es `async`. |
| `src/lib/utils.ts` | Hoy solo `formatDate` (ver trampa abajo). |
| `src/proxy.ts` | Entry point de infra a nivel request (refresca sesión). Detalle completo en `docs/auth.md`. |
| `src/components/Sidebar.tsx` | Menú lateral del dashboard + botón logout. |

## Variables de entorno

`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`, en `.env.local` (gitignoreado, no
está commiteado). Sin esto, **nada** que toque Supabase funciona ni en dev ni en build — fallan
`supabase-browser.ts`, `supabase-server.ts` y `proxy.ts` por igual.

## 🚨 Trampa: el Sidebar tiene links a rutas que no existen

`Sidebar.tsx` linkea a `/dashboard/turnos`, `/dashboard/tratamientos`, `/dashboard/reportes` y
`/dashboard/configuracion`. Ninguna de esas rutas tiene página todavía — solo existe
`/dashboard/pacientes` (ver `docs/pacientes.md`) y `/dashboard` (bienvenida vacía). Clickearlas da
404. **No es un bug para "arreglar" borrando los links** — son placeholders de módulos futuros; si
los tocás, avisar antes de sacarlos.

## Otras trampas

- `formatDate` (`utils.ts`) asume el formato `YYYY-MM-DD` y hace `split('-')` a mano — si le pasás
  cualquier otro formato de fecha (o un `Date` object), rompe o da resultado incorrecto. Solo se usa
  hoy para `fecha_nacimiento` de pacientes, que siempre viene en ese formato desde el `<input
  type="date">`.
- Nunca uses el cliente browser (`supabase-browser.ts`) en un Server Component o Server Action —
  no tiene acceso a las cookies de sesión, las queries van a fallar como si no hubiera usuario
  logueado. Server Components/Actions → siempre `supabase-server.ts`.

## Con qué se conecta

- **Auth** (`docs/auth.md`): `proxy.ts` y `supabase-server.ts` son la base de cómo se sabe si hay
  sesión.
- **Pacientes** (`docs/pacientes.md`): único consumidor real hoy de `supabase-server.ts` para
  queries de negocio.
