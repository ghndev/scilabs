'use client'

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
import Link from 'next/link'
import { PostData } from '@/lib/types'
import { useSession } from '@/components/session-provider'
import { useQuery } from '@tanstack/react-query'
import { getPost } from './actions'

export function PostDetail({ post }: { post: PostData }) {
  const { user } = useSession()

  const { data } = useQuery({
    queryKey: ['post'],
    queryFn: async () => {
      const data = await getPost(post.id)
      return data
    },
    initialData: post
  })

  console.log(data)

  return (
    <MaxWidthWrapper className="max-w-[700px] mt-5 pb-12">
      <div className="text-white text-[0.65rem] w-fit py-1 px-2 bg-[#4B6BFB] rounded">
        {formatEnumValue(data.topic)}
      </div>
      <h1 className="text-2xl mt-2 font-bold">{data.title}</h1>
      <div className="flex items-center mt-3 mb-5 gap-3">
        <div className="flex items-center gap-1.5">
          {data.author.image ? (
            <img
              src={data.author.image}
              alt="user"
              className="h-6 w-6 rounded-full"
            />
          ) : (
            <CircleUser className="text-primary h-6 w-6" strokeWidth={1} />
          )}
          <p className="text-[#696A75] text-xs font-semibold">
            {data.author.name}
          </p>
        </div>
        <p className="text-[#696A75] text-xs">{formatDate(data.createdAt)}</p>
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
            {user?.id === post.authorId && (
              <Link href={`/posts/${post.id}/edit`}>
                <DropdownMenuItem className="cursor-pointer">
                  Edit post
                </DropdownMenuItem>
              </Link>
            )}
            <DropdownMenuItem className="cursor-pointer">
              <p className="text-destructive">Report post...</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <EditorOutput content={data.content} />
    </MaxWidthWrapper>
  )
}
