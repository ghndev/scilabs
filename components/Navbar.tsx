import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import { Fira_Sans_Condensed } from 'next/font/google'
import SearchBar from './SearchBar'

const firaSansCondensed = Fira_Sans_Condensed({
  subsets: ['latin'],
  weight: ['400', '600']
})

export default function Navbar() {
  return (
    <nav className="h-16">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between h-full">
          <Link href="/" className={`${firaSansCondensed.className} text-3xl`}>
            sci<span className="text-primary font-semibold">LABS</span>
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/">Home</Link>
            <Link href="/blog">Blog</Link>
          </div>
          <div className="flex items-center gap-5">
            <SearchBar />
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}
