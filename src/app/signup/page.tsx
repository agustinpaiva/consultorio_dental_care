import { signup } from '@/app/auth/actions'

// Recibe los errores que vienen en la URL (ej: /signup?error=Email+already+in+use)
type Props = {
  searchParams: Promise<{ error?: string }>
}

export default async function SignupPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Crear cuenta</h1>

        {/* Muestra el error si hay uno */}
        {error && (
          <p className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {/* El form llama directamente a la server action signup */}
        <form action={signup} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="rounded bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Registrarse
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          ¿Ya tenés cuenta?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Iniciá sesión
          </a>
        </p>
      </div>
    </main>
  )
}
