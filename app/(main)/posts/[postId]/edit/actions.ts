'use server'

import { validateRequest } from '@/auth'
import { db } from '@/db'
import { EditorJSContent, extractThumbnail } from '@/lib/utils'
import { postSchema, PostValues } from '@/lib/validation'
import { revalidatePath } from 'next/cache'

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

  const hasChanges =
    topic !== savedPost.topic ||
    title !== savedPost.title ||
    JSON.stringify(content) !== JSON.stringify(savedPost.content)

  if (!hasChanges) {
    throw new Error('No changes detected')
  }

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

  revalidatePath(url)

  return { url }
}
