'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { PostCard } from './post-card'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { loadMorePosts } from '@/app/(main)/actions'
import { POSTS_PER_PAGE } from '@/lib/constants'
import { PostSkeleton } from './post-skeleton'

export function PostList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['posts'],
      initialPageParam: 1,
      queryFn: ({ pageParam }) => loadMorePosts(pageParam, POSTS_PER_PAGE),
      getNextPageParam: (lastPage, allPage) => {
        return lastPage.length === POSTS_PER_PAGE
          ? allPage.length + 1
          : undefined
      }
    })

  if (status === 'pending') {
    return (
      <div className="my-8 grid sm:grid-cols-2 md:grid-cols-3 gap-5 items-center">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <PostSkeleton key={index} />
          ))}
      </div>
    )
  }

  return (
    <div className="my-8 grid sm:grid-cols-2 md:grid-cols-3 gap-5 items-center">
      {data?.pages.flatMap((page) =>
        page.map((post) => <PostCard key={post.id} post={post} />)
      )}
      <div className="col-span-1 sm:col-span-2 md:col-span-3 mx-auto">
        {isFetchingNextPage ? (
          <Loader2 className="size-5 animate-spin" />
        ) : hasNextPage ? (
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
            className="shadow-sm">
            Load More
          </Button>
        ) : null}
      </div>
    </div>
  )
}
