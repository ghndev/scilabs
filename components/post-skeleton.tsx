import { Card } from './ui/card'
import { Skeleton } from './ui/skeleton'

export function PostSkeleton() {
  return (
    <Card className="p-4 space-y-2.5">
      <Skeleton className="rounded-lg object-cover w-full h-40" />
      <Skeleton className="w-12 h-[1.475rem] py-1 px-2 rounded" />
      <div className="rounded space-y-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="flex items-center mt-3 mb-5 gap-3">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-full" />
      </div>
    </Card>
  )
}
