import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { db } from '@/db'
import { formatDate, formatEnumValue } from '@/lib/utils'
import { CircleUser } from 'lucide-react'
import Link from 'next/link'
import { unstable_cache as nextCache } from 'next/cache'
import { MAIN_POST_ID } from '@/lib/constants'
import { PostList } from '@/components/post-list'

async function getPost() {
  const post = await db.post.findUnique({
    where: {
      id: MAIN_POST_ID
    },
    include: {
      author: {
        select: {
          name: true,
          image: true
        }
      }
    }
  })

  return post
}

const getCachedPost = nextCache(getPost, ['post detail'], {
  tags: ['post detail'],
  revalidate: 60
})

export default async function Home() {
  const post = await getCachedPost()

  return (
    <MaxWidthWrapper>
      {/* Main post  */}
      {post?.thumbnail && (
        <div className="relative">
          <Link href={`/posts/${post.id}`}>
            <img
              src={post.thumbnail}
              alt="post"
              className="mt-5 rounded-lg w-full h-[25rem] object-cover select-none"
            />
          </Link>
          <div className="absolute bottom-5 left-5 sm:bottom-9 sm:left-9 flex flex-col gap-2">
            <div className="text-white text-[0.65rem] w-fit py-1 px-2 bg-[#4B6BFB] rounded">
              {formatEnumValue(post.topic)}
            </div>
            <Link
              href={`/posts/${post.id}`}
              className="text-white font-semibold text-2xl cursor-pointer">
              <p className="w-60 sm:w-[30rem] line-clamp-2">{post.title}</p>
            </Link>
            <div className="flex items-center mt-3 gap-3">
              <div className="flex items-center gap-1.5">
                {post.author.image ? (
                  <img
                    src={post.author.image}
                    alt="user"
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <CircleUser
                    className="text-primary h-6 w-6"
                    strokeWidth={1}
                  />
                )}
                <p className="text-white text-xs">{post.author.name}</p>
              </div>
              <p className="text-white text-xs font-light">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
        </div>
      )}
      <PostList />
    </MaxWidthWrapper>
  )
}
