import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import GarageView from '@/components/garage/GarageView'

export default async function GaragePage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Garage</h1>
          <p className="mt-1 text-sm text-gray-500">
            Signed in as {session.user?.email}
          </p>
        </div>
        <GarageView />
      </div>
    </main>
  )
}
