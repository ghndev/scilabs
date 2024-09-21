'use server'

import { db } from '@/db'
import { MAIN_POST_ID } from '@/lib/constants'
import { getPostDataInclude } from '@/lib/types'

export async function loadMorePosts(page: number, limit: number) {
  const skip = (page - 1) * limit

  const posts = await db.post.findMany({
    where: {
      NOT: {
        id: MAIN_POST_ID
      }
    },
    include: getPostDataInclude(),
    take: limit,
    skip: skip,
    orderBy: {
      createdAt: 'desc'
    }
  })

  return posts
}
