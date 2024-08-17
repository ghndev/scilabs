import { GoogleLoginButton } from '@/components/google-login-button'
import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { Fira_Sans_Condensed } from 'next/font/google'
import Link from 'next/link'

const firaSansCondensed = Fira_Sans_Condensed({
  subsets: ['latin'],
  weight: ['400', '600']
})

export default function LoginForm() {
  return (
    <MaxWidthWrapper className="pt-20 max-w-lg flex flex-col items-center justify-center">
      <Link href="/" className={`${firaSansCondensed.className} text-4xl`}>
        sci<span className="text-primary font-semibold">LABS</span>
      </Link>
      <h1 className="text-xl mt-3 font-semibold">WELCOME TO THE sciLABS</h1>
      <p className="text-gray-600">Explore a Variety of Science Articles!</p>
      <div className="mt-8 w-full flex flex-col">
        <span className="text-sm font-medium text-start">Social Login</span>
        <GoogleLoginButton />
      </div>
    </MaxWidthWrapper>
  )
}
