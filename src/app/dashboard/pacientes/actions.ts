'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { pacienteSchema } from '@/types/paciente'

export type ActionState = { error: string } | null

export async function crearPaciente(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const raw = Object.fromEntries(formData)
  const result = pacienteSchema.safeParse(raw)

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('pacientes').insert(result.data)

  if (error) {
    if (error.code === '23505') return { error: 'Ya existe un paciente con ese DNI' }
    return { error: 'Error al guardar el paciente' }
  }

  revalidatePath('/dashboard/pacientes')
  redirect('/dashboard/pacientes')
}

export async function actualizarPaciente(id: string, prevState: ActionState, formData: FormData): Promise<ActionState> {
  const raw = Object.fromEntries(formData)
  const result = pacienteSchema.safeParse(raw)

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('pacientes').update(result.data).eq('id', id)

  if (error) {
    if (error.code === '23505') return { error: 'Ya existe un paciente con ese DNI' }
    return { error: 'Error al actualizar el paciente' }
  }

  revalidatePath('/dashboard/pacientes')
  redirect('/dashboard/pacientes')
}

export async function eliminarPaciente(id: string): Promise<void> {
  const supabase = await createClient()
  await supabase.from('pacientes').update({ activo: false }).eq('id', id)
  revalidatePath('/dashboard/pacientes')
}
