'use client'

import { getBoomarkedPosts } from '@/app/(main)/bookmarks/actions'
import { formatDate, formatEnumValue } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'nextjs-toploader/app'
import { Skeleton } from './ui/skeleton'

export function BookmarkList() {
  const router = useRouter()

  const { data, isFetching } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => await getBoomarkedPosts(),
    staleTime: Infinity
  })

  if (isFetching) {
    return (
      <div className="divide-y divide-gray-500/30 dark:divide-gray-500/70">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="py-5 cursor-pointer space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="w-11 h-6 rounded" />
                <Skeleton className="w-32 h-6 rounded" />
              </div>
              <Skeleton className="w-72 h-6 rounded" />
            </div>
          ))}
      </div>
    )
  }

  if (!data) {
    return (
      <p className="text-primary text-lg font-semibold text-center">
        Add your favorite post to your list. Simply click the bookmark icon on
        any post to get started.
      </p>
    )
  }

  return (
    <div className="divide-y divide-gray-500/30 dark:divide-gray-500/70">
      {data.map((post) => (
        <div
          key={post.id}
          className="py-5 cursor-pointer"
          onClick={() => router.push(`/posts/${post.id}`)}>
          <div className="flex items-center justify-between">
            <div className="text-white text-[0.65rem] w-fit py-1 px-2 bg-[#4B6BFB] rounded">
              {formatEnumValue(post.topic)}
            </div>
            <p className="text-gray-500 text-sm">
              {formatDate(post.createdAt)}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold mt-2.5 w-[30rem] line-clamp-1">
              {post.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
