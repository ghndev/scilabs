import { db } from '@/db'
import { PostDetail } from './post-detail'
import { getPostDataInclude } from '@/lib/types'
import { validateRequest } from '@/auth'
import { notFound } from 'next/navigation'
import { unstable_cache as nextCache } from 'next/cache'

interface PageProps {
  params: { postId: string }
}

async function getPost(postId: string, userId?: string) {
  const post = db.post.findUnique({
    where: {
      id: postId
    },
    include: getPostDataInclude(userId)
  })

  return post
}

const getCachedPost = nextCache(getPost, ['post'], {
  tags: ['post'],
  revalidate: 60
})

export async function generateMetadata({ params: { postId } }: PageProps) {
  const post = await getCachedPost(postId)

  if (!post) {
    return { title: 'Post not found' }
  }

  return { title: `${post.title} by ${post.author.name}` }
}

export default async function Page({ params: { postId } }: PageProps) {
  const { user } = await validateRequest()
  const post = await getCachedPost(postId, user?.id)

  if (!post) {
    return notFound()
  }

  return <PostDetail post={post} />
}
