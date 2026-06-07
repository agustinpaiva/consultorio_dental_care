import { createBrowserClient } from '@supabase/ssr'

// Este cliente se usa en componentes del navegador (botones, formularios, etc.)
// Lee las variables de entorno que pusiste en .env.local
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
