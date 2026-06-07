import Link from 'next/link'
import { crearPaciente } from '../actions'
import PacienteForm from '@/components/PacienteForm'

export default function NuevoPacientePage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/dashboard/pacientes" className="text-sm text-blue-600 hover:underline">
          ← Volver a pacientes
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-800">Nuevo paciente</h1>
      </div>
      <PacienteForm action={crearPaciente} submitLabel="Guardar paciente" />
    </div>
  )
}
