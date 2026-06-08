import { describe, it, expect } from 'vitest'
import { pacienteSchema } from '@/types/paciente'

const datosValidos = {
  nombre: 'María',
  apellido: 'García',
  dni: '25678901',
  telefono: '1145678901',
  email: 'maria@gmail.com',
  fecha_nacimiento: '1985-03-15',
  obra_social: 'OSDE',
  notas: 'Paciente con brackets',
}

describe('pacienteSchema — campos requeridos', () => {
  it('acepta datos completamente válidos', () => {
    expect(pacienteSchema.safeParse(datosValidos).success).toBe(true)
  })

  it('rechaza nombre vacío', () => {
    const r = pacienteSchema.safeParse({ ...datosValidos, nombre: '' })
    expect(r.success).toBe(false)
    expect(r.error?.issues[0].message).toBe('El nombre es requerido')
  })

  it('rechaza apellido vacío', () => {
    const r = pacienteSchema.safeParse({ ...datosValidos, apellido: '' })
    expect(r.success).toBe(false)
    expect(r.error?.issues[0].message).toBe('El apellido es requerido')
  })
})

describe('pacienteSchema — validación de DNI', () => {
  it('acepta DNI de 7 dígitos', () => {
    expect(pacienteSchema.safeParse({ ...datosValidos, dni: '1234567' }).success).toBe(true)
  })

  it('acepta DNI de 8 dígitos', () => {
    expect(pacienteSchema.safeParse({ ...datosValidos, dni: '12345678' }).success).toBe(true)
  })

  it('rechaza DNI con menos de 7 dígitos', () => {
    const r = pacienteSchema.safeParse({ ...datosValidos, dni: '123456' })
    expect(r.success).toBe(false)
    expect(r.error?.issues[0].message).toBe('El DNI debe tener al menos 7 dígitos')
  })

  it('rechaza DNI con más de 8 dígitos', () => {
    const r = pacienteSchema.safeParse({ ...datosValidos, dni: '123456789' })
    expect(r.success).toBe(false)
    expect(r.error?.issues[0].message).toBe('El DNI no puede tener más de 8 dígitos')
  })

  it('rechaza DNI con letras', () => {
    const r = pacienteSchema.safeParse({ ...datosValidos, dni: '1234567a' })
    expect(r.success).toBe(false)
    expect(r.error?.issues[0].message).toBe('El DNI debe contener solo números')
  })
})

describe('pacienteSchema — campos opcionales', () => {
  it('acepta paciente solo con campos requeridos', () => {
    const r = pacienteSchema.safeParse({ nombre: 'Ana', apellido: 'López', dni: '3256789' })
    expect(r.success).toBe(true)
  })

  it('convierte telefono vacío a null', () => {
    const r = pacienteSchema.safeParse({ ...datosValidos, telefono: '' })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.telefono).toBeNull()
  })

  it('convierte obra_social vacía a null', () => {
    const r = pacienteSchema.safeParse({ ...datosValidos, obra_social: '' })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.obra_social).toBeNull()
  })

  it('convierte fecha_nacimiento vacía a null', () => {
    const r = pacienteSchema.safeParse({ ...datosValidos, fecha_nacimiento: '' })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.fecha_nacimiento).toBeNull()
  })
})

describe('pacienteSchema — validación de email', () => {
  it('acepta email válido', () => {
    expect(pacienteSchema.safeParse({ ...datosValidos, email: 'test@ejemplo.com' }).success).toBe(true)
  })

  it('acepta email vacío (campo opcional)', () => {
    const r = pacienteSchema.safeParse({ ...datosValidos, email: '' })
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.email).toBeNull()
  })

  it('rechaza email sin @', () => {
    const r = pacienteSchema.safeParse({ ...datosValidos, email: 'no-es-email' })
    expect(r.success).toBe(false)
    expect(r.error?.issues[0].message).toBe('Email inválido')
  })

  it('rechaza email sin dominio', () => {
    const r = pacienteSchema.safeParse({ ...datosValidos, email: 'usuario@' })
    expect(r.success).toBe(false)
    expect(r.error?.issues[0].message).toBe('Email inválido')
  })
})
