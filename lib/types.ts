import { Prisma } from '@prisma/client'

export function getUserDataSelect() {
  return {
    name: true,
    image: true,
    bio: true,
    verified: true
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
    bookmarks: {
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

export interface BookmarkInfo {
  isBookmarkedByUser: boolean
}

export function getCommentDataInclude(loggedInUserId?: string) {
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
    replies: {
      include: {
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    },
    _count: {
      select: {
        likes: true
      }
    }
  } satisfies Prisma.CommentInclude
}

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>
}>

export type CommentSortType = 'latest' | 'likes'
