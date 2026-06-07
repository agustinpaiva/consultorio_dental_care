import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Este cliente se usa en Server Components y Server Actions (código que corre en el servidor)
// Necesita acceso a las cookies para saber si el usuario está logueado
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
