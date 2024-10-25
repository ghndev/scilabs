import { validateRequest } from '@/auth'
import { db } from '@/db'

export async function getBoomarkedPosts() {
  const { user } = await validateRequest()

  if (!user) {
    throw new Error('auth_required')
  }

  const posts = await db.post.findMany({
    where: {
      bookmarks: {
        some: {
          userId: user.id
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return posts
}
