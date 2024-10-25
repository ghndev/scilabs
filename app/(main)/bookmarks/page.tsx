import { validateRequest } from '@/auth'
import { BookmarkList } from '@/components/boomark-list'
import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { Fira_Sans_Condensed } from 'next/font/google'
import { redirect } from 'next/navigation'

const firaSansCondensed = Fira_Sans_Condensed({
  subsets: ['latin'],
  weight: ['400', '600']
})

export default async function Page() {
  const { user } = await validateRequest()

  if (!user) {
    redirect('/login')
  }

  return (
    <MaxWidthWrapper>
      <h1 className={`${firaSansCondensed.className} mt-14 mb-10`}>
        Bookmarks
      </h1>
      <BookmarkList />
    </MaxWidthWrapper>
  )
}
