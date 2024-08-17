import { Navbar } from '@/components/navbar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-[calc(100vh-4rem)]">{children}</main>
    </>
  )
}
