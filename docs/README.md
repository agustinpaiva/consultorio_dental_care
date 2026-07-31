# docs/ — Fichas técnicas por módulo (para el agente)

Estos `.md` **no son documentación para humanos**: son fichas técnicas pensadas para que el agente
(Claude) las **lea antes de tocar un módulo** y no rompa nada, sin tener que releer todo el código
cada vez. Cada ficha tiene rutas de archivos, flujos clave, invariantes que no hay que romper y
trampas conocidas.

La regla de uso vive en `../CLAUDE.md` (sección "Documentación por módulo"): **leer la ficha antes
de editar el módulo**, y **actualizarla en el mismo cambio** si el cambio invalidó el "mapa" (un
flujo, una invariante, la lista de archivos o una trampa). Fixes internos que no cambian contratos
no requieren tocar la ficha.

## Índice

| Módulo / tema | Ficha | Qué cubre |
|---|---|---|
| Autenticación | [auth.md](auth.md) | Signup/login/logout, `proxy.ts`, protección de `/dashboard`. |
| Pacientes | [pacientes.md](pacientes.md) | CRUD, soft-delete, validación Zod, búsqueda. |
| Infraestructura | [infraestructura.md](infraestructura.md) | Clientes Supabase, env vars, utils, Sidebar. |

## Módulos sin ficha (todavía)

No hay más módulos de negocio implementados hoy (Turnos/Tratamientos/Reportes/Configuración son
solo links en el `Sidebar`, sin página — ver trampa en `infraestructura.md`). Cuando se implemente
alguno, crearle su ficha.
