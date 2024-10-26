'use client'

import { LikeInfo } from '@/lib/types'
import { useToast } from './ui/use-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCommentLike,
  deleteCommentLike,
  getCommentLikeStatus
} from '@/app/(main)/posts/[postId]/actions'
import { ThumbsUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ERROR_DESCRIPTIONS } from '@/lib/constants'

interface CommentLikeButtonProps {
  commentId: string
  initialState: LikeInfo
}

export function CommentLikeButton({
  commentId,
  initialState
}: CommentLikeButtonProps) {
  const { toast } = useToast()

  const queryClient = useQueryClient()

  const queryKey = ['like-info', commentId]

  const { data } = useQuery({
    queryKey,
    queryFn: async () => await getCommentLikeStatus(commentId),
    initialData: initialState,
    staleTime: Infinity
  })

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? deleteCommentLike(commentId)
        : createCommentLike(commentId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      const previousState = queryClient.getQueryData<LikeInfo>(queryKey)

      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser
      }))

      return { previousState }
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
    <div className="flex items-center gap-1 text-gray-400 font-semibold">
      <ThumbsUp
        onClick={() => mutate()}
        className={cn(
          'size-4 cursor-pointer hover:fill-gray-400 text-gray-400',
          data.isLikedByUser && 'fill-gray-400'
        )}
      />
      {data.likes === 0 || data.likes === 1
        ? `${data.likes} Like`
        : `${data.likes} Likes`}
    </div>
  )
}
