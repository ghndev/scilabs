'use server'

import { db } from '@/db'

export async function getPost(postId: string) {
  const post = await db.post.findUnique({
    where: {
      id: postId
    },
    include: {
      author: {
        select: {
          name: true,
          image: true
        }
      }
    }
  })

  if (!post) {
    throw new Error('Post not found')
  }

  return post
}
