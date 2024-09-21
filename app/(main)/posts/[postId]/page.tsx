import { db } from '@/db'
import { PostDetail } from './post-detail'
import { getPost } from './actions'

interface PageProps {
  params: { postId: string }
}

export async function generateMetadata({ params: { postId } }: PageProps) {
  const post = await db.post.findUnique({
    where: {
      id: postId
    },
    include: {
      author: {
        select: {
          name: true
        }
      }
    }
  })

  if (!post) {
    return { title: 'Post not found' }
  }

  return { title: `${post.title} by ${post.author.name}` }
}

export default async function Page({ params: { postId } }: PageProps) {
  const post = await getPost(postId)

  return <PostDetail post={post} />
}
