import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import SearchInput from '@/components/SearchInput'
import DeleteButton from '@/components/DeleteButton'
import { eliminarPaciente } from './actions'
import type { Paciente } from '@/types/paciente'
import { formatDate } from '@/lib/utils'

type Props = {
  searchParams: Promise<{ q?: string }>
}

export default async function PacientesPage({ searchParams }: Props) {
  const { q } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('pacientes')
    .select('*')
    .eq('activo', true)
    .order('apellido')

  if (q) {
    query = query.or(`nombre.ilike.%${q}%,apellido.ilike.%${q}%,dni.ilike.%${q}%`)
  }

  const { data: pacientes } = await query

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pacientes</h1>
          <p className="mt-1 text-sm text-slate-500">
            {pacientes?.length ?? 0} paciente{pacientes?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/dashboard/pacientes/nuevo"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Nuevo paciente
        </Link>
      </div>

      <div className="mb-4">
        <SearchInput defaultValue={q} placeholder="Buscar por nombre, apellido o DNI..." />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        {!pacientes?.length ? (
          <p className="p-8 text-center text-sm text-slate-500">
            {q ? 'No se encontraron pacientes con esa búsqueda.' : 'No hay pacientes cargados aún.'}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Apellido y nombre</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">DNI</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Fecha nac.</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Teléfono</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Obra social</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pacientes.map((p: Paciente) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {p.apellido}, {p.nombre}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.dni}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(p.fecha_nacimiento)}</td>
                  <td className="px-4 py-3 text-slate-600">{p.telefono ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{p.obra_social ?? '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/pacientes/${p.id}/editar`}
                        className="rounded px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                      >
                        Editar
                      </Link>
                      <DeleteButton action={eliminarPaciente.bind(null, p.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
