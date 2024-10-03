'use server'

import { validateRequest } from '@/auth'
import { db } from '@/db'
import { getPostDataInclude } from '@/lib/types'

export async function getPost(postId: string) {
  const { user } = await validateRequest()

  const post = await db.post.findUnique({
    where: {
      id: postId
    },
    include: getPostDataInclude(user?.id)
  })

  if (!post) {
    throw new Error('Post not found')
  }

  return post
}

export async function getLikeStatus(postId: string) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error('You need to be logged in')
  }

  const post = await db.post.findUnique({
    where: {
      id: postId
    },
    include: {
      likes: {
        where: {
          userId: user.id
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
    }
  })

  if (!post) {
    throw new Error('Post not found')
  }

  const data = { likes: post._count.likes, isLikedByUser: !!post.likes.length }

  return data
}

export async function createLike(postId: string) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error('You need to be logged in')
  }

  const post = await db.post.findUnique({
    where: {
      id: postId
    },
    select: {
      authorId: true
    }
  })

  if (!post) {
    throw new Error('Post not found')
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
    throw new Error('You need to be logged in')
  }

  const post = await db.post.findUnique({
    where: {
      id: postId
    }
  })

  if (!post) {
    throw new Error('Post not found')
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
    throw new Error('You do not have permission to delete this post')
  }

  await db.post.delete({
    where: {
      id: postId
    }
  })

  return { message: 'Post deleted successfully' }
}
