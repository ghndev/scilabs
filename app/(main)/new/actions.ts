import { validateRequest } from '@/auth'
import { db } from '@/db'
import { postSchema, PostValues } from '@/lib/validation'
import { Topic } from '@prisma/client'

export async function createPost(values: PostValues) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error('You need to be logged in')
  }

  const { topic, title, content } = postSchema.parse(values)

  await db.post.create({
    data: {
      topic: topic as Topic,
      title,
      content,
      authorId: user.id
    }
  })
}
