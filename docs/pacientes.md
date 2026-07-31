# Módulo: Pacientes (`/dashboard/pacientes`)

> Ficha técnica para el agente. **Leer antes de tocar el alta, edición, listado o borrado de
> pacientes.**

## Para qué sirve

CRUD de pacientes del consultorio: listar (con búsqueda), crear, editar y "eliminar" (soft-delete).
Es el único módulo de negocio implementado hoy — el resto de los ítems del `Sidebar` (Turnos,
Tratamientos, Reportes, Configuración) son links a rutas que **todavía no existen** (ver
`docs/infraestructura.md`).

## Archivos

| Archivo | Contenido |
|---|---|
| `src/app/dashboard/pacientes/actions.ts` | Server Actions `crearPaciente`, `actualizarPaciente`, `eliminarPaciente`. Toda la lógica de negocio vive acá. |
| `src/app/dashboard/pacientes/page.tsx` | Listado + búsqueda (`?q=`), filtra `activo=true`. |
| `src/app/dashboard/pacientes/nuevo/page.tsx` | Alta — usa `PacienteForm` con `action={crearPaciente}`. |
| `src/app/dashboard/pacientes/[id]/editar/page.tsx` | Edición — trae el paciente (`activo=true` también acá) y usa `PacienteForm` con `action={actualizarPaciente.bind(null, id)}`. |
| `src/types/paciente.ts` | `pacienteSchema` (Zod, valida antes de tocar Supabase) + tipos `Paciente`/`PacienteFormData`. |
| `src/components/PacienteForm.tsx` | Form único, se reusa para alta y edición (`defaultValues` opcional). |
| `src/components/FormField.tsx` | Input/textarea genérico usado por `PacienteForm`. |
| `src/components/DeleteButton.tsx` | Botón "Eliminar" con `confirm()` del browser + `useTransition`. |
| `src/components/SearchInput.tsx` | Input de búsqueda, actualiza `?q=` en la URL con `router.replace` (no hay debounce con timer, se apoya en `useTransition` para no bloquear la UI). |
| `src/__tests__/paciente.actions.test.ts` | Tests de las 3 Server Actions (mockea el cliente Supabase). |
| `src/__tests__/paciente.schema.test.ts` | Tests del Zod schema. |

## Mapa rápido (acción → dónde)

| Quiero tocar… | Archivo → función |
|---|---|
| Reglas de validación (DNI, email, campos requeridos) | `types/paciente.ts` → `pacienteSchema` |
| Qué pasa al guardar/actualizar | `pacientes/actions.ts` → `crearPaciente` / `actualizarPaciente` |
| Qué pasa al eliminar | `pacientes/actions.ts` → `eliminarPaciente` (ver invariante abajo) |
| Columnas de la tabla / búsqueda | `pacientes/page.tsx` |
| Campos del formulario | `components/PacienteForm.tsx` (agregar un `<FormField>` + agregarlo también a `pacienteSchema`) |

## 🚨 Invariantes críticas

- **Soft-delete**: `eliminarPaciente` hace `update({ activo: false })`, **nunca borra la fila**. El
  DNI queda "ocupado" (constraint único en la tabla `pacientes`), así que recrear un paciente
  eliminado con el mismo DNI tira `Ya existe un paciente con ese DNI` (código Postgres `23505`,
  mapeado a mensaje amigable en `crearPaciente`/`actualizarPaciente`). **No hay UI para reactivar**
  todavía — si se pide, es un `update(activo: true)`, no un insert nuevo. Confirmado por el test
  `eliminarPaciente > hace soft delete...`.
- **Listado y edición filtran `activo=true`**: un paciente "eliminado" no aparece en la lista y su
  URL de edición devuelve 404 (`notFound()` en `editar/page.tsx`). Si agregás una vista de
  "papelera" en el futuro, tiene que ser una query separada sin ese filtro.
- **`actualizarPaciente(id, prevState, formData)` tiene 3 parámetros**, pero `useActionState` (usado
  en `PacienteForm`) necesita una función de 2 parámetros `(prevState, formData)`. Por eso
  `editar/page.tsx` la pasa como `actualizarPaciente.bind(null, id)`. Si cambiás la firma de
  `actualizarPaciente`, actualizá ese `.bind`.
- **Validación siempre con Zod antes de tocar Supabase**: tanto `crearPaciente` como
  `actualizarPaciente` hacen `pacienteSchema.safeParse(raw)` y cortan devolviendo `{ error }` si
  falla. No le agregues un insert/update que salte este paso.

## Trampas conocidas

- `telefono`, `email`, `fecha_nacimiento`, `obra_social`, `notas` son todos opcionales en el schema
  y se transforman `"" → null` (`.transform(v => v || null)`). Si agregás un campo nuevo opcional,
  seguí el mismo patrón o vas a guardar strings vacíos en vez de `null`.
- El error de Supabase se distingue solo por `error.code === '23505'` (unique violation). Si la
  tabla gana otro constraint único en el futuro, este mismo código va a disparar el mensaje de
  "DNI duplicado" aunque el conflicto sea por otra columna — hay que desambiguar si eso pasa.

## Con qué se conecta

- **Auth**: todo `/dashboard/pacientes/*` está protegido por `dashboard/layout.tsx` (ver
  `docs/auth.md`).
- **Infraestructura**: usa el cliente Supabase server (`docs/infraestructura.md`) para todas las
  queries — nunca hay `fetch` directo ni SQL crudo.
