import { validateRequest } from '@/auth'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { SessionProvider } from '@/components/session-provider'
import { Toaster } from '@/components/ui/toaster'
import NextTopLoader from 'nextjs-toploader'

export default async function Layout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await validateRequest()

  return (
    <SessionProvider value={session}>
      <NextTopLoader color="#2563eb" height={1.5} showSpinner={false} />
      <Navbar />
      <main className="flex flex-col min-h-[calc(100vh-4rem)]">{children}</main>
      <Footer />
      <Toaster />
    </SessionProvider>
  )
}
