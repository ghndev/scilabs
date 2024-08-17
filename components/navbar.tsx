import Link from 'next/link'
import { Fira_Sans_Condensed } from 'next/font/google'
import { MaxWidthWrapper } from './max-width-wrapper'
import { SearchBar } from './search-bar'
import { ThemeSwitch } from './theme-switch'
import { CircleUser, LogIn, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'

const firaSansCondensed = Fira_Sans_Condensed({
  subsets: ['latin'],
  weight: ['400', '600']
})

export function Navbar() {
  return (
    <nav className="h-16">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between h-full">
          <Link href="/" className={`${firaSansCondensed.className} text-3xl`}>
            sci<span className="text-primary font-semibold">LABS</span>
          </Link>
          <div className="hidden md:flex items-center gap-5">
            <Link href="/">Home</Link>
            <Link href="/blog">Blog</Link>
          </div>
          <div className="flex items-center gap-5">
            <SearchBar />
            <ThemeSwitch />
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <CircleUser className="text-primary h-6 w-6" strokeWidth={1} />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="dark:border-primary">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <Link href="/login">
                  <DropdownMenuItem className="cursor-pointer">
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Login</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}
