'use server'

import { validateRequest } from '@/auth'
import { db } from '@/db'
import { postSchema, PostValues } from '@/lib/validation'
import { Topic } from '@prisma/client'
import { redirect } from 'next/navigation'

export interface EditorJSBlock {
  id: string
  type: string
  data: {
    text?: string
    level?: number
    file?: {
      url: string
    }
    caption?: string
    withBorder?: boolean
    stretched?: boolean
    withBackground?: boolean
  }
}

export interface EditorJSContent {
  time: number
  blocks: EditorJSBlock[]
  version: string
}

function extractThumbnail(content: EditorJSContent): string | null {
  if (content && Array.isArray(content.blocks)) {
    const imageBlock = content.blocks.find((block) => block.type === 'image')
    if (
      imageBlock &&
      imageBlock.data &&
      imageBlock.data.file &&
      imageBlock.data.file.url
    ) {
      return imageBlock.data.file.url
    }
  }
  return null
}

export async function createPost(values: PostValues) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error('You need to be logged in')
  }

  const { topic, title, content } = postSchema.parse(values)

  const thumbnail = extractThumbnail(content as EditorJSContent)

  const post = await db.post.create({
    data: {
      topic: topic as Topic,
      title,
      content,
      thumbnail,
      authorId: user.id
    }
  })

  redirect(`/posts/${post.id}`)
}
