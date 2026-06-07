import { login } from '@/app/auth/actions'
import AuthCard from '@/components/AuthCard'
import AuthInput from '@/components/AuthInput'

type Props = {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <AuthCard
      title="Iniciar sesión"
      error={error}
      footer={
        <>
          ¿No tenés cuenta?{' '}
          <a href="/signup" className="text-blue-600 hover:underline">Registrate</a>
        </>
      }
    >
      <form action={login} className="flex flex-col gap-4">
        <AuthInput label="Email" name="email" type="email" required />
        <AuthInput label="Contraseña" name="password" type="password" required />
        <button
          type="submit"
          className="rounded bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
    </AuthCard>
  )
}
