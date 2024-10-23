import { db } from '@/db'
import { PostDetail } from './post-detail'
import { unstable_cache as nextCache } from 'next/cache'

interface PageProps {
  params: { postId: string }
}

async function getPost(postId: string) {
  const post = db.post.findUnique({
    where: {
      id: postId
    }
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
  return { title: `sciLABS | ${post.title}` }
}

export default async function Page({ params: { postId } }: PageProps) {
  return <PostDetail postId={postId} />
}
