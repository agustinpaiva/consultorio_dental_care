import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { actualizarPaciente } from '../../actions'
import PacienteForm from '@/components/PacienteForm'
import type { Paciente } from '@/types/paciente'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditarPacientePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: paciente } = await supabase
    .from('pacientes')
    .select('*')
    .eq('id', id)
    .eq('activo', true)
    .single()

  if (!paciente) notFound()

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/dashboard/pacientes" className="text-sm text-blue-600 hover:underline">
          ← Volver a pacientes
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-800">
          Editar: {paciente.apellido}, {paciente.nombre}
        </h1>
      </div>
      <PacienteForm
        action={actualizarPaciente.bind(null, id)}
        defaultValues={paciente as Paciente}
        submitLabel="Actualizar paciente"
      />
    </div>
  )
}
