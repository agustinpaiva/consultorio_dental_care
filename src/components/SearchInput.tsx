'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'

interface Props {
  defaultValue?: string
  placeholder?: string
}

export default function SearchInput({ defaultValue = '', placeholder = 'Buscar...' }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    const params = new URLSearchParams()
    if (value) params.set('q', value)
    startTransition(() => {
      router.replace(value ? `${pathname}?${params}` : pathname)
    })
  }

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="search"
        defaultValue={defaultValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isPending ? 'opacity-50' : ''
        }`}
      />
    </div>
  )
}
