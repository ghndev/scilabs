'use server'

import { validateRequest } from '@/auth'
import { db } from '@/db'
import { MAIN_POST_ID } from '@/lib/constants'
import { getPostDataInclude } from '@/lib/types'
import { profileSchema, ProfileValues } from '@/lib/validation'
import { Prisma } from '@prisma/client'

export async function loadMorePosts(page: number, limit: number) {
  const skip = (page - 1) * limit

  const desc = Prisma.SortOrder.desc

  const orderBy = [
    {
      likes: {
        _count: desc
      }
    },
    {
      createdAt: desc
    }
  ]

  const posts = await db.post.findMany({
    where: {
      NOT: {
        id: MAIN_POST_ID
      }
    },
    include: getPostDataInclude(),
    take: limit,
    skip: skip,
    orderBy
  })

  return posts
}

export async function updateProfile(values: ProfileValues) {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error('auth_required')
  }

  const { image, username, bio } = profileSchema.parse(values)

  const updates: Partial<ProfileValues> = {}

  if (image !== user.image) updates.image = image
  if (username !== user.name) updates.username = username
  if (bio !== user.bio) updates.bio = bio

  if (Object.keys(updates).length > 0) {
    await db.user.update({
      where: { id: user.id },
      data: {
        image: updates.image,
        name: updates.username,
        bio: updates.bio
      }
    })
    return { message: 'Profile updated successfully' }
  } else {
    return { message: 'No changes detected' }
  }
}

export async function getCurrentUser() {
  const { user } = await validateRequest()
  return user
}
