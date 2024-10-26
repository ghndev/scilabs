'use client'

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
import { ERROR_DESCRIPTIONS } from '@/lib/constants'

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState)
      toast({
        variant: 'destructive',
        description:
          ERROR_DESCRIPTIONS[
            error.message as keyof typeof ERROR_DESCRIPTIONS
          ] || ERROR_DESCRIPTIONS.DEFAULT
      })
    }
  })
  return (
    <BookmarkPlus
      onClick={() => mutate()}
      className={cn(
        'size-5 cursor-pointer hover:fill-[#97989F] text-[#97989F]',
        data.isBookmarkedByUser === true && 'fill-[#97989F]'
      )}
    />
  )
}
