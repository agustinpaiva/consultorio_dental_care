'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import FormField from './FormField'
import type { ActionState } from '@/app/dashboard/pacientes/actions'
import type { Paciente } from '@/types/paciente'

interface Props {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
  defaultValues?: Partial<Paciente>
  submitLabel?: string
}

export default function PacienteForm({ action, defaultValues, submitLabel = 'Guardar' }: Props) {
  const [state, formAction, isPending] = useActionState(action, null)

  return (
    <>
      {state?.error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</p>
      )}
      <form action={formAction} className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Nombre" name="nombre" required defaultValue={defaultValues?.nombre} />
          <FormField label="Apellido" name="apellido" required defaultValue={defaultValues?.apellido} />
          <FormField label="DNI" name="dni" required placeholder="12345678" defaultValue={defaultValues?.dni} />
          <FormField label="Teléfono" name="telefono" type="tel" defaultValue={defaultValues?.telefono ?? ''} />
          <FormField label="Email" name="email" type="email" defaultValue={defaultValues?.email ?? ''} />
          <FormField label="Fecha de nacimiento" name="fecha_nacimiento" type="date" defaultValue={defaultValues?.fecha_nacimiento ?? ''} />
          <FormField label="Obra social" name="obra_social" defaultValue={defaultValues?.obra_social ?? ''} />
        </div>
        <div className="mt-4">
          <FormField label="Notas" name="notas" multiline defaultValue={defaultValues?.notas ?? ''} />
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Guardando...' : submitLabel}
          </button>
          <Link
            href="/dashboard/pacientes"
            className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </>
  )
}
