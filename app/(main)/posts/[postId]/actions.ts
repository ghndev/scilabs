'use server'

import { db } from '@/db'
import { notFound } from 'next/navigation'

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
    return notFound()
  }

  return post
}
