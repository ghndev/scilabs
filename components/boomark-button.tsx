import { BookmarkPlus } from 'lucide-react'
import { useToast } from './ui/use-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createBookmark,
  deleteBookmark,
  getBookmarkStatus
} from '@/app/(main)/posts/[postId]/actions'
import { BookmarkInfo } from '@/lib/types'
import { cn } from '@/lib/utils'

interface BookmarkButtonProps {
  postId: string
  initialState: BookmarkInfo
}

export function BookmarkButton({ postId, initialState }: BookmarkButtonProps) {
  const { toast } = useToast()

  const queryClient = useQueryClient()

  const queryKey = ['bookmark-info', postId]

  const { data } = useQuery({
    queryKey,
    queryFn: async () => await getBookmarkStatus(postId),
    initialData: initialState,
    staleTime: Infinity
  })

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser ? deleteBookmark(postId) : createBookmark(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey)

      queryClient.setQueryData<BookmarkInfo>(queryKey, (old) => ({
        isBookmarkedByUser: !old?.isBookmarkedByUser
      }))

      return { previousState }
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState)
      toast({
        variant: 'destructive',
        description: 'Something went wrong.'
      })
    }
  })
  return (
    <BookmarkPlus
      onClick={() => mutate()}
      className={cn(
        'size-5 cursor-pointer hover:fill-[#97989F]',
        data.isBookmarkedByUser === true && 'fill-[#97989F]'
      )}
      strokeWidth={1}
    />
  )
}