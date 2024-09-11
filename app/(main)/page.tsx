import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { PostCard } from '@/components/post-card'
import { db } from '@/db'
import { formatDate, formatEnumValue } from '@/lib/utils'
import { CircleUser } from 'lucide-react'
import Link from 'next/link'
import { cache } from 'react'

async function getPost() {
  const post = await db.post.findUnique({
    where: {
      id: 'cm0rtq19v00015t1mkv0benln'
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

const getCachedPost = cache(getPost)

export default async function Home() {
  const post = await getCachedPost()

  const posts = await db.post.findMany({
    where: {
      NOT: {
        id: 'cm0rtq19v00015t1mkv0benln'
      }
    },
    include: {
      author: {
        select: {
          name: true,
          image: true
        }
      }
    },
    take: 9
  })

  return (
    <MaxWidthWrapper>
      {/* Main post  */}
      {post?.thumbnail && (
        <div className="relative">
          <img
            src={post.thumbnail}
            alt="post"
            className="mt-5 rounded-lg w-full h-[25rem] object-cover select-none"
          />
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
      <div className="my-8 grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {/* Posts */}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} author={post.author} />
        ))}
      </div>
    </MaxWidthWrapper>
  )
}
