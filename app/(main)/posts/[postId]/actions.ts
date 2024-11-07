'use server'

import { validateRequest } from '@/auth'
import { db } from '@/db'
import { COMMENTS_PER_PAGE } from '@/lib/constants'
import {
  CommentSortType,
  getCommentDataInclude,
  getPostDataInclude
} from '@/lib/types'
import { commentSchema, CommentValues } from '@/lib/validation'
import { Prisma } from '@prisma/client'

export async function getPostDetail(postId: string) {
  const { user } = await validateRequest()

  const post = await db.post.findUnique({
    where: {
      id: postId
    },
    include: getPostDataInclude(user?.id)
  })

  if (!post) {
    throw new Error('post_not_found')
  }

  return post
}

export async function getBookmarkStatus(postId: string) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error('auth_required')
  }

  const post = await db.post.findUnique({
    where: {
      id: postId
    },
    include: {
      bookmarks: {
        where: {
          userId: user.id
        }
      }
    }
  })

  if (!post) {
    throw new Error('post_not_found')
  }

  const data = {
    isBookmarkedByUser: !!post.bookmarks.length
  }

  return data
}

export async function createBookmark(postId: string) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error('auth_required')
  }

  const post = await db.post.findUnique({
    where: {
      id: postId
    }
  })

  if (!post) {
    throw new Error('post_not_found')
  }

  const bookmarkCount = await db.bookmark.count({
    where: {
      userId: user.id
    }
  })

  if (bookmarkCount >= 10) {
    throw new Error('bookmark_limit_exceeded')
  }

  await db.bookmark.upsert({
    where: {
      id: {
        userId: user.id,
        postId: postId
      }
    },
    create: {
      userId: user.id,
      postId
    },
    update: {}
  })
}

export async function deleteBookmark(postId: string) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error('auth_required')
  }

  const post = await db.post.findUnique({
    where: {
      id: postId
    }
  })

  if (!post) {
    throw new Error('post_not_found')
  }

  await db.bookmark.deleteMany({
    where: {
      userId: user.id,
      postId
    }
  })
}

export async function getLikeStatus(postId: string) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error('auth_required')
  }

  const post = await db.post.findUnique({
    where: {
      id: postId
    },
    include: {
      likes: {
        where: {
          userId: user.id
        }
      },
      _count: {
        select: {
          likes: true
        }
      }
    }
  })

  if (!post) {
    throw new Error('post_not_found')
  }

  const data = { likes: post._count.likes, isLikedByUser: !!post.likes.length }

  return data
}

export async function createLike(postId: string) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error('auth_required')
  }

  const post = await db.post.findUnique({
    where: {
      id: postId
    }
  })

  if (!post) {
    throw new Error('post_not_found')
  }

  await db.like.upsert({
    where: {
      id: {
        userId: user.id,
        postId
      }
    },
    create: {
      userId: user.id,
      postId
    },
    update: {}
  })
}

export async function deleteLike(postId: string) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error('auth_required')
  }

  const post = await db.post.findUnique({
    where: {
      id: postId
    }
  })

  if (!post) {
    throw new Error('post_not_found')
  }

  await db.like.deleteMany({
    where: {
      userId: user.id,
      postId: post.id
    }
  })
}

export async function deletePost(postId: string) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error('auth_required')
  }

  const savedPost = await db.post.findUnique({
    where: {
      id: postId
    }
  })

  if (!savedPost) {
    throw new Error('post_not_found')
  }

  if (savedPost.authorId !== user.id) {
    throw new Error('permission_denied')
  }

  await db.post.delete({
    where: {
      id: postId
    }
  })
}

export async function createComment(
  values: CommentValues,
  postId: string,
  parentId?: string
) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error('auth_required')
  }

  const { content } = commentSchema.parse(values)

  const post = await db.post.findUnique({
    where: {
      id: postId
    }
  })

  if (!post) {
    throw new Error('post_not_found')
  }

  if (parentId) {
    const parentComment = await db.comment.findUnique({
      where: {
        id: parentId
      }
    })

    if (!parentComment) {
      throw new Error('parent_comment_not_found')
    }

    if (parentComment.parentId) {
      throw new Error('nested_reply_not_allowed')
    }
  }

  await db.comment.create({
    data: {
      content,
      authorId: user.id,
      postId,
      ...(parentId && { parentId })
    }
  })
}

export async function loadMoreComments(
  postId: string,
  page: number,
  limit: number,
  sortBy: CommentSortType = 'likes'
) {
  const { user } = await validateRequest()

  const skip = (page - 1) * limit

  const desc = Prisma.SortOrder.desc

  const orderBy =
    sortBy === 'likes'
      ? [
          {
            likes: {
              _count: desc
            }
          },
          {
            createdAt: desc
          }
        ]
      : [
          {
            createdAt: desc
          }
        ]

  const comments = await db.comment.findMany({
    where: {
      postId,
      parentId: null
    },
    include: getCommentDataInclude(user?.id),
    orderBy,
    take: limit,
    skip
  })

  return comments
}

export async function getCommentLikeStatus(commentId: string) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error('auth_required')
  }

  const comment = await db.comment.findUnique({
    where: {
      id: commentId
    },
    include: {
      likes: {
        where: {
          userId: user.id
        }
      },
      _count: {
        select: {
          likes: true
        }
      }
    }
  })

  if (!comment) {
    throw new Error('comment_not_found')
  }

  const data = {
    likes: comment._count.likes,
    isLikedByUser: !!comment.likes.length
  }

  return data
}

export async function deleteCommentLike(commentId: string) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error('auth_required')
  }

  const post = await db.comment.findUnique({
    where: {
      id: commentId
    }
  })

  if (!post) {
    throw new Error('post_not_found')
  }

  await db.commentLike.deleteMany({
    where: {
      userId: user.id,
      commentId
    }
  })
}

export async function createCommentLike(commentId: string) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error('auth_required')
  }

  const comment = await db.comment.findUnique({
    where: {
      id: commentId
    }
  })

  if (!comment) {
    throw new Error('comment_not_found')
  }

  await db.commentLike.upsert({
    where: {
      id: {
        userId: user.id,
        commentId
      }
    },
    create: {
      userId: user.id,
      commentId
    },
    update: {}
  })
}
