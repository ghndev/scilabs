'use server'

import { validateRequest } from '@/auth'
import { db } from '@/db'
import { EditorJSContent, extractThumbnail } from '@/lib/utils'
import { postSchema, PostValues } from '@/lib/validation'

export async function createPost(values: PostValues) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error('auth_required')
  }

  const { topic, title, content } = postSchema.parse(values)

  const thumbnail = extractThumbnail(content as EditorJSContent)

  const post = await db.post.create({
    data: {
      topic,
      title,
      content,
      thumbnail,
      authorId: user.id
    }
  })

  return { url: `/posts/${post.id}` }
}
