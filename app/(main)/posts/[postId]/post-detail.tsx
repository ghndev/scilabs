import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { formatDate, formatEnumValue } from '@/lib/utils'
import { BookmarkPlus, CircleUser, Ellipsis, ThumbsUp } from 'lucide-react'
import { EditorOutput } from '@/components/editor-output'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Post } from '@prisma/client'

export function PostDetail({
  author,
  post
}: {
  author: { name: string; image: string | null }
  post: Post
}) {
  return (
    <MaxWidthWrapper className="max-w-[700px] mt-5 pb-12">
      <div className="text-white text-[0.65rem] w-fit py-1 px-2 bg-[#4B6BFB] rounded">
        {formatEnumValue(post.topic)}
      </div>
      <h1 className="text-2xl mt-2 font-bold">{post.title}</h1>
      <div className="flex items-center mt-3 mb-5 gap-3">
        <div className="flex items-center gap-1.5">
          {author.image ? (
            <img
              src={author.image}
              alt="user"
              className="h-6 w-6 rounded-full"
            />
          ) : (
            <CircleUser className="text-primary h-6 w-6" strokeWidth={1} />
          )}
          <p className="text-[#696A75] text-xs font-semibold">{author.name}</p>
        </div>
        <p className="text-[#696A75] text-xs">{formatDate(post.createdAt)}</p>
      </div>
      <div className="flex justify-between items-center py-2 px-0.5 border-y text-[#97989F]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <ThumbsUp
              className="size-5 cursor-pointer hover:fill-[#97989F]"
              strokeWidth={1}
            />
            <p className="text-sm font-extralight ">0</p>
          </div>
          <div>
            <BookmarkPlus
              className="size-5 cursor-pointer hover:fill-[#97989F]"
              strokeWidth={1}
            />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis
              className="size-5 cursor-pointer fill-[#97989F]"
              strokeWidth={1}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="cursor-pointer">
            <DropdownMenuItem className="cursor-pointer">
              <p className="text-destructive">Report post...</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <EditorOutput content={post.content} />
    </MaxWidthWrapper>
  )
}
