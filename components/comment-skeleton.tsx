import { Skeleton } from './ui/skeleton'

export function CommentSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="rounded-full size-10" />
        <Skeleton className="w-24 h-4" />
      </div>
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-32 h-4" />
    </div>
  )
}
