import { Bookmark, Ellipsis, ThumbsUp } from 'lucide-react'
import { MaxWidthWrapper } from './max-width-wrapper'
import { Skeleton } from './ui/skeleton'

export function PostDetailSkeleton() {
  return (
    <MaxWidthWrapper className="max-w-[700px] mt-5 pb-12">
      {/* Topic */}
      <Skeleton className="w-11 h-6 rounded" />
      {/* Title */}
      <Skeleton className="mt-2 w-[30rem] h-8 rounded-md" />
      {/* User Info */}
      <div className="flex items-center mt-3 mb-5 gap-3">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
        <Skeleton className="h-4 w-28" />
      </div>
      {/* Post Icons */}
      <div className="flex justify-between items-center py-2 px-0.5 border-muted animate-pulse border-y">
        <div className="flex items-center gap-2">
          <ThumbsUp className="size-5 text-muted animate-pulse fill-muted" />
          <Bookmark className="size-5 text-muted animate-pulse fill-muted" />
        </div>
        <Ellipsis className="size-5 text-muted animate-pulse fill-muted" />
      </div>
      {/* Post Image */}
      <Skeleton className="my-5 h-72 w-full" />
      {/* Post Content */}
      <div className="py-[0.6rem] space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </div>
    </MaxWidthWrapper>
  )
}
