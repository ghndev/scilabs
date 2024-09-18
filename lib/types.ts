import { Prisma } from '@prisma/client'

export function getPostDataSelect() {
  return {
    id: true,
    topic: true,
    title: true,
    content: true,
    thumbnail: true,
    authorId: true,
    createdAt: true,
    updatedAt: true,
    author: {
      select: {
        name: true,
        image: true
      }
    }
  } satisfies Prisma.PostSelect
}

export type PostData = Prisma.PostGetPayload<{
  select: ReturnType<typeof getPostDataSelect>
}>
