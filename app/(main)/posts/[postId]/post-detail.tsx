import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { formatDate, formatEnumValue } from '@/lib/utils'
import { CircleUser, Ellipsis, Pencil, Trash2 } from 'lucide-react'
import { EditorOutput } from '@/components/editor-output'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { PostData } from '@/lib/types'
import { LikeButton } from '@/components/like-button'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { BookmarkButton } from '@/components/boomark-button'
import { validateRequest } from '@/auth'

export async function PostDetail({ post }: { post: PostData }) {
  const { user } = await validateRequest()
  // const [isDeletePostModalOpen, setIsDeletePostModalOPen] = useState(false)

  // const { data: post, isFetching } = useQuery({
  //   queryKey: ['post', postId],
  //   queryFn: () => getPost(postId),
  //   staleTime: Infinity
  // })

  // if (isFetching) {
  //   return <PostDetailSkeleton />
  // }

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
          <p className="text-[#696A75] text-xs font-semibold">
            {post.author.name}
          </p>
        </div>
        <p className="text-[#696A75] text-xs">{formatDate(post.createdAt)}</p>
      </div>
      <div className="flex justify-between items-center py-2 px-0.5 border-y text-[#97989F]">
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
                  // onClick={() => setIsDeletePostModalOPen(true)}
                  className="cursor-pointer">
                  <Trash2 className="size-4 text-destructive mr-2" />
                  <p className="text-destructive">Delete Post</p>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem className="cursor-pointer">
              <p className="text-destructive">Report Post</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <EditorOutput content={post.content} />
      {/* {isDeletePostModalOpen && (
        <DeletePost
          isOpen={isDeletePostModalOpen}
          setIsOpen={setIsDeletePostModalOPen}
          post={post}
        />
      )} */}
    </MaxWidthWrapper>
  )
}
