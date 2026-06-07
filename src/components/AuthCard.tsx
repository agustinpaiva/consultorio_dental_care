interface AuthCardProps {
  title: string
  error?: string
  children: React.ReactNode
  footer: React.ReactNode
}

export default function AuthCard({ title, error, children, footer }: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">{title}</h1>

        {error && (
          <p className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {children}

        <p className="mt-4 text-center text-sm text-gray-500">{footer}</p>
      </div>
    </main>
  )
}
