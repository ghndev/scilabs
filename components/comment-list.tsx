import { loadMoreComments } from '@/app/(main)/posts/[postId]/actions'
import { COMMENTS_PER_PAGE } from '@/lib/constants'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Comment } from './comment-card'

export default function CommentList({ postId }: { postId: string }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['comments'],
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        loadMoreComments(postId, pageParam, COMMENTS_PER_PAGE),
      getNextPageParam: (lastPage, allPage) => {
        return lastPage.length === COMMENTS_PER_PAGE
          ? allPage.length + 1
          : undefined
      }
    })

  return (
    <div className="mt-5 space-y-10">
      {data?.pages.flatMap((page) =>
        page.map((comment) => <Comment key={comment.id} comment={comment} />)
      )}
    </div>
  )
}
