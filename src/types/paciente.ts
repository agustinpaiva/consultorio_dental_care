import { z } from 'zod'

export const pacienteSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  apellido: z.string().min(1, 'El apellido es requerido'),
  dni: z.string()
    .min(7, 'El DNI debe tener al menos 7 dígitos')
    .max(8, 'El DNI no puede tener más de 8 dígitos')
    .regex(/^\d+$/, 'El DNI debe contener solo números'),
  telefono: z.string().optional().transform(v => v || null),
  email: z
    .string()
    .refine(v => !v || z.string().email().safeParse(v).success, { message: 'Email inválido' })
    .optional()
    .transform(v => v || null),
  fecha_nacimiento: z.string().optional().transform(v => v || null),
  obra_social: z.string().optional().transform(v => v || null),
  notas: z.string().optional().transform(v => v || null),
})

export type PacienteFormData = z.infer<typeof pacienteSchema>

export type Paciente = {
  id: string
  nombre: string
  apellido: string
  dni: string
  telefono: string | null
  email: string | null
  fecha_nacimiento: string | null
  obra_social: string | null
  notas: string | null
  activo: boolean
  created_at: string
  updated_at: string
}
