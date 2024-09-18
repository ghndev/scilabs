'use server'

import { validateRequest } from '@/auth'
import { db } from '@/db'
import { EditorJSContent, extractThumbnail } from '@/lib/utils'
import { postSchema, PostValues } from '@/lib/validation'

export async function updatePost(values: PostValues, postId: string) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error('You need to be logged in')
  }

  const savedPost = await db.post.findUnique({
    where: {
      id: postId
    }
  })

  if (!savedPost) {
    throw new Error('Post not found')
  }

  if (savedPost.authorId !== user.id) {
    throw new Error('You do not have permission to edit this post')
  }

  const { topic, title, content } = postSchema.parse(values)

  const thumbnail = extractThumbnail(content as EditorJSContent)

  const updatedPost = await db.post.update({
    where: { id: postId },
    data: {
      topic,
      title,
      content,
      thumbnail
    }
  })

  const url = `/posts/${updatedPost.id}`

  return { url }
}
