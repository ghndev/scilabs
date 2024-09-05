'use server'

import { validateRequest } from '@/auth'
import { db } from '@/db'
import { postSchema, PostValues } from '@/lib/validation'
import { Topic } from '@prisma/client'
import { redirect } from 'next/navigation'

export async function createPost(values: PostValues) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error('You need to be logged in')
  }

  const { topic, title, content } = postSchema.parse(values)

  const post = await db.post.create({
    data: {
      topic: topic as Topic,
      title,
      content,
      authorId: user.id
    }
  })

  redirect(`/posts/${post.id}`)
}
