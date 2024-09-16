'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { PostCard } from './post-card'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { loadMorePosts } from '@/app/(main)/actions'
import { POSTS_PER_PAGE } from '@/lib/constants'
import { Card } from './ui/card'
import { Skeleton } from './ui/skeleton'

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
            <Card key={index} className="p-4 space-y-2.5">
              <Skeleton className="rounded-lg object-cover w-full h-40" />
              <Skeleton className="w-12 h-[1.475rem] py-1 px-2 rounded" />
              <div className="rounded space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex items-center mt-3 mb-5 gap-3">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
              </div>
            </Card>
          ))}
      </div>
    )
  }

  return (
    <div className="my-8 grid sm:grid-cols-2 md:grid-cols-3 gap-5 items-center">
      {data?.pages.flatMap((page) =>
        page.map((post) => (
          <PostCard key={post.id} post={post} author={post.author} />
        ))
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
