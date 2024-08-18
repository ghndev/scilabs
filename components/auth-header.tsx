import { Fira_Sans_Condensed } from 'next/font/google'
import Link from 'next/link'

const firaSansCondensed = Fira_Sans_Condensed({
  subsets: ['latin'],
  weight: ['400', '600']
})

export function AuthHeader({
  title,
  description
}: {
  title: string
  description: string
}) {
  return (
    <>
      <Link href="/" className={`${firaSansCondensed.className} text-4xl`}>
        sci<span className="text-primary font-semibold">LABS</span>
      </Link>
      <h1 className="text-xl mt-3 font-semibold">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </>
  )
}
