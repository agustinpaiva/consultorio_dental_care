import { describe, it, expect, vi, beforeEach } from 'vitest'

// vi.hoisted garantiza que estas variables existen cuando vi.mock() corre (se hoistea al tope)
const { mockInsert, mockUpdate, mockEq, mockFrom } = vi.hoisted(() => ({
  mockInsert: vi.fn(),
  mockUpdate: vi.fn(),
  mockEq: vi.fn(),
  mockFrom: vi.fn(),
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => { throw new Error(`NEXT_REDIRECT:${url}`) }),
}))

vi.mock('@/lib/supabase-server', () => ({
  createClient: vi.fn().mockResolvedValue({ from: mockFrom }),
}))

import { crearPaciente, actualizarPaciente, eliminarPaciente } from '@/app/dashboard/pacientes/actions'

const formDataValida = () => {
  const fd = new FormData()
  fd.set('nombre', 'María')
  fd.set('apellido', 'García')
  fd.set('dni', '25678901')
  fd.set('telefono', '1145678901')
  fd.set('email', 'maria@gmail.com')
  fd.set('fecha_nacimiento', '1985-03-15')
  fd.set('obra_social', 'OSDE')
  fd.set('notas', '')
  return fd
}

beforeEach(() => {
  vi.clearAllMocks()
  mockEq.mockResolvedValue({ error: null })
  mockUpdate.mockReturnValue({ eq: mockEq })
  mockInsert.mockResolvedValue({ error: null })
  mockFrom.mockReturnValue({ insert: mockInsert, update: mockUpdate })
})

describe('crearPaciente', () => {
  it('retorna error si el nombre está vacío', async () => {
    const fd = formDataValida()
    fd.set('nombre', '')
    const result = await crearPaciente(null, fd)
    expect(result).toEqual({ error: 'El nombre es requerido' })
  })

  it('retorna error si el DNI tiene letras', async () => {
    const fd = formDataValida()
    fd.set('dni', '1234567x')
    const result = await crearPaciente(null, fd)
    expect(result).toEqual({ error: 'El DNI debe contener solo números' })
  })

  it('retorna error si el email es inválido', async () => {
    const fd = formDataValida()
    fd.set('email', 'no-es-email')
    const result = await crearPaciente(null, fd)
    expect(result).toEqual({ error: 'Email inválido' })
  })

  it('retorna error de DNI duplicado cuando Supabase devuelve code 23505', async () => {
    mockInsert.mockResolvedValue({ error: { code: '23505' } })
    const result = await crearPaciente(null, formDataValida())
    expect(result).toEqual({ error: 'Ya existe un paciente con ese DNI' })
  })

  it('redirige a /dashboard/pacientes al guardar exitosamente', async () => {
    await expect(crearPaciente(null, formDataValida())).rejects.toThrow('NEXT_REDIRECT:/dashboard/pacientes')
  })
})

describe('actualizarPaciente', () => {
  const id = 'uuid-de-prueba-123'

  it('retorna error de validación si el apellido está vacío', async () => {
    const fd = formDataValida()
    fd.set('apellido', '')
    const result = await actualizarPaciente(id, null, fd)
    expect(result).toEqual({ error: 'El apellido es requerido' })
  })

  it('redirige al actualizar exitosamente', async () => {
    await expect(actualizarPaciente(id, null, formDataValida())).rejects.toThrow('NEXT_REDIRECT:/dashboard/pacientes')
  })
})

describe('eliminarPaciente', () => {
  it('hace soft delete (activo = false) en lugar de borrar el registro', async () => {
    const id = 'uuid-de-prueba-123'
    await eliminarPaciente(id)
    expect(mockUpdate).toHaveBeenCalledWith({ activo: false })
    expect(mockEq).toHaveBeenCalledWith('id', id)
  })
})
