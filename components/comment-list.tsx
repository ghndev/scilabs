import { loadMoreComments } from '@/app/(main)/posts/[postId]/actions'
import { COMMENTS_PER_PAGE } from '@/lib/constants'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Comment } from './comment'
import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import { CommentSkeleton } from './comment-skeleton'

export default function CommentList({
  postId,
  userId
}: {
  postId: string
  userId: string | undefined
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['comments', postId],
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        loadMoreComments(postId, pageParam, COMMENTS_PER_PAGE),
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
