'use client'

import { useTransition } from 'react'

interface Props {
  action: () => Promise<void>
}

export default function DeleteButton({ action }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm('¿Eliminar este paciente? Esta acción se puede revertir.')) return
    startTransition(() => action())
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="rounded px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {isPending ? '...' : 'Eliminar'}
    </button>
  )
}
