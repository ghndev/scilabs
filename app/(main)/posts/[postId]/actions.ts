'use server'

import { validateRequest } from '@/auth'
import { db } from '@/db'
import { getPostDataInclude } from '@/lib/types'

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
