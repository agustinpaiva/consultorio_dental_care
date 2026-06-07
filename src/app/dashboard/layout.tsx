import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { logout } from '@/app/auth/actions'
import Sidebar from '@/components/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar userEmail={user.email!} logoutAction={logout} />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
