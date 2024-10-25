'use client'

import { getBoomarkedPosts } from '@/app/(main)/bookmarks/actions'
import { useQuery } from '@tanstack/react-query'

export function BookmarkList() {
  const { data, isFetching } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => await getBoomarkedPosts(),
    staleTime: Infinity
  })

  return <div></div>
}
