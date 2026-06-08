import { describe, it, expect } from 'vitest'
import { formatDate } from '@/lib/utils'

describe('formatDate', () => {
  it('convierte YYYY-MM-DD a DD/MM/YYYY', () => {
    expect(formatDate('1985-03-15')).toBe('15/03/1985')
  })

  it('retorna — para null', () => {
    expect(formatDate(null)).toBe('—')
  })

  it('mantiene ceros a la izquierda en día y mes', () => {
    expect(formatDate('2000-01-05')).toBe('05/01/2000')
  })

  it('funciona con fechas de fin de año', () => {
    expect(formatDate('1960-12-25')).toBe('25/12/1960')
  })
})
