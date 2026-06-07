import { signup } from '@/app/auth/actions'
import AuthCard from '@/components/AuthCard'
import AuthInput from '@/components/AuthInput'

type Props = {
  searchParams: Promise<{ error?: string }>
}

export default async function SignupPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <AuthCard
      title="Crear cuenta"
      error={error}
      footer={
        <>
          ¿Ya tenés cuenta?{' '}
          <a href="/login" className="text-blue-600 hover:underline">Iniciá sesión</a>
        </>
      }
    >
      <form action={signup} className="flex flex-col gap-4">
        <AuthInput label="Email" name="email" type="email" required />
        <AuthInput label="Contraseña" name="password" type="password" required minLength={6} />
        <button
          type="submit"
          className="rounded bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Registrarse
        </button>
      </form>
    </AuthCard>
  )
}
