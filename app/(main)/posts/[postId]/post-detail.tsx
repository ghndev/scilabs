'use client'

import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { formatDate, formatEnumValue } from '@/lib/utils'
import {
  BadgeCheck,
  CircleUser,
  Ellipsis,
  Pencil,
  ShieldAlert,
  Trash2
} from 'lucide-react'
import { EditorOutput } from '@/components/editor-output'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { LikeButton } from '@/components/like-button'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { BookmarkButton } from '@/components/boomark-button'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PostDetailSkeleton } from '@/components/post-detail-skeleton'
import { notFound } from 'next/navigation'
import { useSession } from '@/components/session-provider'
import { DeletePostModal } from '@/components/modal/delete-post-modal'
import { getPostDetail } from './actions'
import { CommentForm } from '@/components/comment-form'
import CommentList from '@/components/comment-list'

export function PostDetail({ postId }: { postId: string }) {
  const { user } = useSession()
  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false)

  const { data: post, isFetching } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => await getPostDetail(postId),
    staleTime: Infinity
  })

  if (isFetching) {
    return <PostDetailSkeleton />
  }

  if (!post) {
    return notFound()
  }

  return (
    <MaxWidthWrapper className="max-w-[700px] mt-5 pb-12">
      <div className="text-white text-[0.65rem] w-fit py-1 px-2 bg-[#4B6BFB] rounded">
        {formatEnumValue(post.topic)}
      </div>
      <h1 className="text-2xl mt-2 font-bold">{post.title}</h1>
      <div className="flex items-center mt-3 mb-5 gap-3">
        <div className="flex items-center gap-1.5">
          {post.author.image ? (
            <Avatar className="size-6">
              <AvatarImage src={post.author.image} alt="author" />
            </Avatar>
          ) : (
            <CircleUser className="text-primary h-6 w-6" strokeWidth={1} />
          )}
          <p className="text-[#696A75] text-xs font-semibold flex items-center justify-center">
            {post.author.name}{' '}
            {post.author.verified && (
              <BadgeCheck className="ml-1 size-4 text-primary" />
            )}
          </p>
        </div>
        <p className="text-[#696A75] text-xs">{formatDate(post.createdAt)}</p>
      </div>
      <div className="flex justify-between items-center py-2 px-0.5 border-y">
        <div className="flex items-center gap-2">
          <LikeButton
            postId={post.id}
            initialState={{
              likes: post._count.likes,
              isLikedByUser: post.likes.some((like) => like.userId === user?.id)
            }}
          />
          <BookmarkButton
            postId={post.id}
            initialState={{
              isBookmarkedByUser: post.bookmarks.some(
                (bookmark) => bookmark.userId === user?.id
              )
            }}
          />
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
              <>
                <Link href={`/posts/${post.id}/edit`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Pencil className="size-4 mr-2" />
                    Edit Post
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  onClick={() => setIsDeletePostModalOpen(true)}
                  className="cursor-pointer">
                  <Trash2 className="size-4 text-destructive mr-2" />
                  <p className="text-destructive">Delete Post</p>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem className="cursor-pointer">
              <ShieldAlert className="size-4 text-destructive mr-2" />
              <p className="text-destructive">Report Post</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <EditorOutput content={post.content} />
      {!isFetching && <CommentForm postId={post.id} />}
      <CommentList postId={post.id} userId={user?.id} />
      {isDeletePostModalOpen && (
        <DeletePostModal
          isOpen={isDeletePostModalOpen}
          setIsOpen={setIsDeletePostModalOpen}
          post={post}
        />
      )}
    </MaxWidthWrapper>
  )
}
