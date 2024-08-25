import { validateRequest } from '@/auth'
import { Navbar } from '@/components/navbar'
import { SessionProvider } from '@/components/session-provider'

export default async function Layout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await validateRequest()

  return (
    <SessionProvider value={session}>
      <Navbar />
      <main className="flex flex-col min-h-[calc(100vh-4rem)]">{children}</main>
    </SessionProvider>
  )
}
