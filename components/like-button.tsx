'use client'

import { LikeInfo } from '@/lib/types'
import { useToast } from './ui/use-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createLike,
  deleteLike,
  getLikeStatus
} from '@/app/(main)/posts/[postId]/actions'
import { ThumbsUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ERROR_DESCRIPTIONS } from '@/lib/constants'

interface LikeButtonProps {
  postId: string
  initialState: LikeInfo
}

export function LikeButton({ postId, initialState }: LikeButtonProps) {
  const { toast } = useToast()

  const queryClient = useQueryClient()

  const queryKey = ['like-info', postId]

  const { data } = useQuery({
    queryKey,
    queryFn: async () => await getLikeStatus(postId),
    initialData: initialState,
    staleTime: Infinity
  })

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isLikedByUser ? deleteLike(postId) : createLike(postId),
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
    <div className="flex items-center gap-1">
      <ThumbsUp
        onClick={() => mutate()}
        className={cn(
          'size-5 cursor-pointer hover:fill-[#97989F] text-[#97989F]',
          data.isLikedByUser && 'fill-[#97989F]'
        )}
        strokeWidth={1}
      />
      <p className="text-sm font-extralight text-[#97989F]">{data.likes}</p>
    </div>
  )
}
