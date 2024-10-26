import { commentSchema, CommentValues } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem } from './ui/form'
import TextareaAutosize from 'react-textarea-autosize'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { COMMENT_MAX_LENGTH } from '@/lib/constants'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createComment } from '@/app/(main)/posts/[postId]/actions'
import { Loader2 } from 'lucide-react'

export function CommentForm({ postId }: { postId: string }) {
  const form = useForm<CommentValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: ''
    }
  })

  const queryClient = useQueryClient()

  const { mutate: saveComment, isPending } = useMutation({
    mutationKey: ['comment'],
    mutationFn: async (values: CommentValues) =>
      await createComment(values, postId),
    onSuccess: () => {
      form.setValue('content', '')
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    }
  })

  const contentLength = form.watch('content').length

  const onSubmit = (values: CommentValues) => {
    saveComment(values)
  }

  return (
    <Form {...form}>
      <form className="mt-5" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="relative">
              <FormControl>
                <>
                  <TextareaAutosize
                    {...field}
                    className="pt-5 pb-16 px-4 border-2 border-[#4B6BFB] rounded-md resize-none w-full appearance-none overflow-hidden focus:outline-none"
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
                    disabled={contentLength > COMMENT_MAX_LENGTH || isPending}
                    size="sm"
                    className="text-xs absolute bottom-5 right-4 bg-[#4B6BFB]">
                    {isPending && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Send
                  </Button>
                </>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
