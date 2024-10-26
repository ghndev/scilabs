import { CommentData } from '@/lib/types'
import { Avatar, AvatarImage } from './ui/avatar'
import { BadgeCheck, CircleUser, Loader2, MessageCircle } from 'lucide-react'
import { cn, formatTimeAgo } from '@/lib/utils'
import { CommentLikeButton } from './comment-like-button'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { commentSchema, CommentValues } from '@/lib/validation'
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form'
import TextareaAutosize from 'react-textarea-autosize'
import { Button } from './ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createComment } from '@/app/(main)/posts/[postId]/actions'
import { COMMENT_MAX_LENGTH } from '@/lib/constants'

interface CommentProps {
  comment: CommentData
  userId: string | undefined
}

export function Comment({ comment, userId }: CommentProps) {
  const [isReplyFormOpen, setIsReplyFormOpen] = useState(false)

  const form = useForm<CommentValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: ''
    }
  })

  const queryClient = useQueryClient()

  const { mutate: saveReply, isPending } = useMutation({
    mutationKey: ['reply', comment.id],
    mutationFn: async (values: CommentValues) =>
      await createComment(values, comment.postId, comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', comment.postId] })
      form.reset()
    }
  })

  const contentLength = form.watch('content').length

  const onSubmit = (values: CommentValues) => {
    saveReply(values)
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {comment.author.image ? (
            <Avatar className="size-10">
              <AvatarImage src={comment.author.image} alt="author" />
            </Avatar>
          ) : (
            <CircleUser className="text-primary size-10" strokeWidth={1} />
          )}
          <p className="font-semibold flex items-center justify-center">
            {comment.author.name}{' '}
            {comment.author.verified && (
              <BadgeCheck className="ml-1 size-4 text-primary" />
            )}
          </p>
          <p className="text-gray-400 text-xs">
            {formatTimeAgo(comment.createdAt)}
          </p>
        </div>
        <p>{comment.content}</p>
        <div className="flex items-center gap-3 text-xs">
          <CommentLikeButton
            commentId={comment.id}
            initialState={{
              likes: comment._count.likes,
              isLikedByUser: comment.likes.some(
                (like) => like.userId === userId
              )
            }}
          />
          <div
            onClick={() => setIsReplyFormOpen(!isReplyFormOpen)}
            className="flex items-center text-gray-400 cursor-pointer">
            <MessageCircle className="mr-0.5 size-4" />
            <p className="font-semibold">reply</p>
          </div>
        </div>
      </div>
      <div className="ml-1.5 px-4 border-l-2 border-dashed border-gray-300">
        <div
          className={cn('', {
            hidden: !isReplyFormOpen
          })}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <TextareaAutosize
                          {...field}
                          className="placeholder:text-sm text-sm pt-5 pb-16 px-4 border-2 border-[#4B6BFB] rounded-md resize-none w-full appearance-none overflow-hidden focus:outline-none"
                          placeholder="Type your comment here"
                        />
                        <p
                          className={cn(
                            'text-xs absolute bottom-[1.9rem] left-4 text-gray-400',
                            {
                              'text-red-500': contentLength > COMMENT_MAX_LENGTH
                            }
                          )}>
                          {contentLength || 0}/{COMMENT_MAX_LENGTH}
                        </p>
                        <Button
                          type="submit"
                          disabled={
                            contentLength > COMMENT_MAX_LENGTH || isPending
                          }
                          size="sm"
                          className="text-xs absolute bottom-5 right-4 bg-[#4B6BFB]">
                          {isPending && (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          )}
                          Send
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <div className="space-y-6">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="space-y-2">
              <div className="flex items-center gap-2">
                {reply.author.image ? (
                  <Avatar className="size-10">
                    <AvatarImage src={reply.author.image} alt="author" />
                  </Avatar>
                ) : (
                  <CircleUser
                    className="text-primary size-10"
                    strokeWidth={1}
                  />
                )}
                <p className="font-semibold flex items-center justify-center">
                  {reply.author.name}{' '}
                  {reply.author.verified && (
                    <BadgeCheck className="ml-1 size-4 text-primary" />
                  )}
                </p>
                <p className="text-gray-400 text-xs">
                  {formatTimeAgo(reply.createdAt)}
                </p>
              </div>
              <p>{reply.content}</p>
              <div className="flex items-center gap-3 text-xs">
                <CommentLikeButton
                  commentId={reply.id}
                  initialState={{
                    likes: reply._count.likes,
                    isLikedByUser: reply.likes.some(
                      (like) => like.userId === userId
                    )
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
