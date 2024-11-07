import { loadMoreComments } from '@/app/(main)/posts/[postId]/actions'
import { COMMENTS_PER_PAGE } from '@/lib/constants'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { Comment } from './comment'
import { useEffect, useRef, useState } from 'react'
import { ChartNoAxesGantt, Loader2 } from 'lucide-react'
import { CommentSkeleton } from './comment-skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select'
import { CommentSortType } from '@/lib/types'

export default function CommentList({
  postId,
  userId
}: {
  postId: string
  userId: string | undefined
}) {
  const [sortBy, setSortBy] = useState<CommentSortType>('likes')
  const queryClient = useQueryClient()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['comments', postId, sortBy],
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        loadMoreComments(postId, pageParam, COMMENTS_PER_PAGE, sortBy),
      getNextPageParam: (lastPage, allPage) => {
        return lastPage.length === COMMENTS_PER_PAGE
          ? allPage.length + 1
          : undefined
      }
    })

  const observerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(observerRef.current)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (status === 'pending') {
    return (
      <div className="mt-5 space-y-10">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <CommentSkeleton key={index} />
          ))}
      </div>
    )
  }

  return (
    <div className="mt-5 space-y-10">
      <Select
        onValueChange={(value) => {
          setSortBy(value as CommentSortType)
          queryClient.invalidateQueries({
            queryKey: ['comments', postId, sortBy]
          })
        }}>
        <SelectTrigger className="w-[150px]">
          <div className="flex gap-2 items-center">
            <ChartNoAxesGantt className="size-4" rotate="180" /> Sort
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem defaultChecked value="likes">
            Most Liked
          </SelectItem>
          <SelectItem value="latest">Latest</SelectItem>
        </SelectContent>
      </Select>
      {data?.pages.flatMap((page) =>
        page.map((comment) => (
          <Comment key={comment.id} comment={comment} userId={userId} />
        ))
      )}
      <div
        ref={observerRef}
        className="col-span-1 sm:col-span-2 md:col-span-3 mx-auto">
        {isFetchingNextPage && <CommentSkeleton />}
      </div>
    </div>
  )
}
