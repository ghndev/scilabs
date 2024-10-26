import { CommentData } from '@/lib/types'
import { Avatar, AvatarImage } from './ui/avatar'
import { BadgeCheck, CircleUser, MessageCircle } from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils'

interface CommentProps {
  comment: CommentData
}

export function Comment({ comment }: CommentProps) {
  return (
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
        <div className="flex items-center gap-1 text-gray-400 font-semibold">
          {comment._count.likes} Like
        </div>
        <div className="flex items-center text-gray-400">
          <MessageCircle className="mr-0.5 size-5" />
          <p className="font-semibold">reply</p>
        </div>
      </div>
    </div>
  )
}
