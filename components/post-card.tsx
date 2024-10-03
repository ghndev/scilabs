import { Post } from '@prisma/client'
import { Card } from './ui/card'
import { formatDate, formatEnumValue } from '@/lib/utils'
import { CircleUser } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarImage } from './ui/avatar'

export function PostCard({
  author,
  post
}: {
  author: { name: string; image: string | null }
  post: Post
}) {
  return (
    <Card className="p-4 space-y-2.5">
      <Link href={`/posts/${post.id}`}>
        {post.thumbnail ? (
          <img
            src={post.thumbnail}
            alt="thumbnail"
            className="rounded-lg object-cover w-full h-40"
          />
        ) : (
          <img
            src="/img_not_available.png"
            alt="thumbnail"
            className="rounded-lg object-cover w-full h-40"
          />
        )}
      </Link>
      <div className="text-white text-[0.65rem] w-fit py-1 px-2 bg-[#4B6BFB] rounded">
        {formatEnumValue(post.topic)}
      </div>
      <Link
        href={`/posts/${post.id}`}
        className="rounded h-12 line-clamp-2 font-bold w-full">
        {post.title}
      </Link>
      <div className="flex items-center mt-3 mb-5 gap-3">
        <div className="flex items-center gap-1.5">
          {author.image ? (
            <Avatar className="size-6">
              <AvatarImage src={author.image} alt="author" />
            </Avatar>
          ) : (
            <CircleUser className="text-primary h-6 w-6" strokeWidth={1} />
          )}
          <p className="text-[#97989F] text-xs font-semibold">{author.name}</p>
        </div>
        <p className="text-[#97989F] text-xs">{formatDate(post.createdAt)}</p>
      </div>
    </Card>
  )
}
