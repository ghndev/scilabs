'use client'

import { GoogleLoginButton } from '@/components/google-login-button'
import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { Fira_Sans_Condensed } from 'next/font/google'
import Link from 'next/link'

const firaSansCondensed = Fira_Sans_Condensed({
  subsets: ['latin'],
  weight: ['400', '600']
})

export function LoginForm() {
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
      <div className="relative mt-7 w-full">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-500/30 dark:border-gray-500/70"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500 dark:bg-gray-800">
            OR
          </span>
        </div>
      </div>
      <div className="mt-8"></div>
    </MaxWidthWrapper>
  )
}
