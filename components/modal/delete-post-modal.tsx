import { PostData } from '@/lib/types'
import { Dispatch, SetStateAction } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../ui/dialog'
import { Loader2, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePost } from '@/app/(main)/posts/[postId]/actions'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'

interface DeletePostModalProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  post: PostData
}

export function DeletePostModal({
  isOpen,
  setIsOpen,
  post
}: DeletePostModalProps) {
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationKey: ['delete-post'],
    mutationFn: async (postId: string) => await deletePost(postId),
    onSuccess() {
      toast({
        title: 'Post deleted successfully'
      })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      router.push('/')
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Trash2 className="size-4 text-destructive mr-1.5" /> Delete Post
          </DialogTitle>
          <DialogDescription className="line-clamp-1">
            {post.title}
          </DialogDescription>
        </DialogHeader>
        <p className="text-center text-xl mt-10">
          Deletion is not reversible, and the post will be{' '}
          <span className="uppercase font-bold underline text-destructive">
            completely deleted
          </span>
        </p>
        <div className="flex items-center gap-2 mt-10 justify-end">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => mutate(post.id)}
            disabled={isPending}
            className="font-semibold"
            variant="destructive">
            {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
