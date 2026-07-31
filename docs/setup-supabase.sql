-- Setup de Supabase para consultorio_dental_care
-- Correr esto UNA VEZ en un proyecto Supabase nuevo (SQL Editor del dashboard)
-- para tener la misma estructura que el proyecto original.

create table public.pacientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  apellido text not null,
  dni text not null unique,
  telefono text,
  email text,
  fecha_nacimiento date,
  obra_social text,
  notas text,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Mantiene updated_at al día en cada UPDATE
create function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger pacientes_updated_at
before update on public.pacientes
for each row
execute function public.update_updated_at();

-- Row Level Security: cualquier usuario autenticado puede leer/escribir pacientes
alter table public.pacientes enable row level security;

create policy authenticated_can_manage_pacientes
on public.pacientes
for all
to authenticated
using (true)
with check (true);
