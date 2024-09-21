import { Prisma } from '@prisma/client'

export function getUserDataSelect() {
  return {
    name: true,
    image: true
  } satisfies Prisma.UserSelect
}

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>
}>

export function getPostDataInclude(loggedInUserId?: string) {
  return {
    author: {
      select: getUserDataSelect()
    },
    likes: {
      where: {
        userId: loggedInUserId
      },
      select: {
        userId: true
      }
    },
    _count: {
      select: {
        likes: true
      }
    }
  } satisfies Prisma.PostInclude
}

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>
}>

export interface LikeInfo {
  likes: number
  isLikedByUser: boolean
}
