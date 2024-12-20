import Link from 'next/link'
import { Fira_Sans_Condensed } from 'next/font/google'
import { MaxWidthWrapper } from './max-width-wrapper'
import { SearchBar } from './search-bar'
import { ThemeSwitch } from './theme-switch'

import { UserButton } from './user-button'
import { SquarePen } from 'lucide-react'

const firaSansCondensed = Fira_Sans_Condensed({
  subsets: ['latin'],
  weight: ['400', '600']
})

export async function Navbar() {
  return (
    <nav className="h-16">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between h-full">
          <Link
            href="/"
            className={`relative ${firaSansCondensed.className} text-3xl`}>
            sci<span className="text-primary font-semibold">LABS</span>
            <span className="font-semibold text-xs"> beta</span>
          </Link>
          <SearchBar />
          <div className="flex items-center gap-5">
            <ThemeSwitch />
            <Link href="/new">
              <SquarePen className="text-primary h-6 w-6" strokeWidth={1} />
            </Link>
            <UserButton />
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}
