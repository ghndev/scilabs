import { db } from '@/db'
import { notFound } from 'next/navigation'
import { unstable_cache as nextCache } from 'next/cache'
import { PostDetail } from './post-detail'

interface PageProps {
  params: { postId: string }
}

async function getPost(postId: string) {
  const post = await db.post.findUnique({
    where: {
      id: postId
    },
    include: {
      author: {
        select: {
          name: true,
          image: true
        }
      }
    }
  })

  if (!post) {
    return notFound()
  }

  return post
}

const getCachedPost = nextCache(getPost, ['post detail'], {
  tags: ['post detail'],
  revalidate: 60
})

export async function generateMetadata({ params: { postId } }: PageProps) {
  const post = await getCachedPost(postId)

  return { title: `${post.title} by ${post.author.name}` }
}

export default async function Page({ params: { postId } }: PageProps) {
  const post = await getCachedPost(postId)

  return <PostDetail post={post} author={post.author} />
}
